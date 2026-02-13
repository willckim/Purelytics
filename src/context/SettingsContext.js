/**
 * SettingsContext - Centralized app state with persistent storage + auth
 *
 * Architecture notes:
 * - useMemo on the context value prevents re-render cascades to consumers
 *   that only read a subset of the state.
 * - useCallback on every updater ensures referential stability so child
 *   components wrapped in React.memo won't re-render unnecessarily.
 * - Storage writes are fire-and-forget (non-blocking) to keep the UI fast.
 * - Auth state is loaded from SecureStore on mount and drives navigation.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { storageService } from '../services/storageService';

const SettingsContext = createContext(undefined);

const DEFAULT_SETTINGS = {
  aiProvider: 'auto',
  autoScan: false,
  showScores: true,
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [profiles, setProfiles] = useState([]);
  const [scanHistory, setScanHistory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auth state
  const [user, setUser] = useState(null); // { id, email }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // true until initial auth check

  // Load all persisted data once on mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Check for existing auth token first
        const [token, savedSettings, savedProfiles, savedHistory, userProfile] =
          await Promise.all([
            storageService.getAuthToken(),
            storageService.getSettings(),
            storageService.getProfiles(),
            storageService.getScanHistory(),
            storageService.getUserProfile(),
          ]);

        if (cancelled) return;

        // Restore auth state
        if (token && userProfile) {
          setUser(userProfile);
          setIsAuthenticated(true);
        }

        if (savedSettings) {
          setSettings((prev) => ({ ...prev, ...savedSettings }));
        }
        if (savedProfiles && savedProfiles.length > 0) {
          setProfiles(savedProfiles);
        }
        if (savedHistory && savedHistory.length > 0) {
          setScanHistory(savedHistory);
        }
      } catch (e) {
        console.error('SettingsProvider: failed to load persisted data', e);
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
          setIsLoaded(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ─── Auth actions ─────────────────────────────────────────────

  const login = useCallback(async (email, password) => {
    const verifiedUser = await storageService.verifyUser(email, password);
    const token = storageService.generateToken(email);
    const userProfile = { id: verifiedUser.id, email: verifiedUser.email };

    await storageService.saveAuthToken(token);
    await storageService.saveUserProfile(userProfile);

    setUser(userProfile);
    setIsAuthenticated(true);

    // Load profiles linked to this user
    const allProfiles = await storageService.getProfiles();
    const userProfiles = allProfiles.filter(
      (p) => !p.userId || p.userId === verifiedUser.id
    );
    setProfiles(userProfiles);
  }, []);

  const signup = useCallback(async (email, password) => {
    const newUser = await storageService.createUser(email, password);
    const token = storageService.generateToken(email);
    const userProfile = { id: newUser.id, email: newUser.email };

    await storageService.saveAuthToken(token);
    await storageService.saveUserProfile(userProfile);

    setUser(userProfile);
    setIsAuthenticated(true);
    setProfiles([]); // Fresh account, no profiles
  }, []);

  const logout = useCallback(async () => {
    await storageService.deleteAuthToken();
    await storageService.deleteUserProfile();
    setUser(null);
    setIsAuthenticated(false);
    setProfiles([]);
    setScanHistory([]);
  }, []);

  // ─── Settings updaters ────────────────────────────────────────

  const updateSettings = useCallback((updates) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      storageService.saveSettings(next);
      return next;
    });
  }, []);

  // ─── Profile updaters ────────────────────────────────────────

  const addProfile = useCallback(
    (profile) => {
      setProfiles((prev) => {
        // Stamp profile with current user ID
        const stamped = { ...profile, userId: user?.id || null };
        const next = [...prev, stamped];
        storageService.saveProfiles(next);
        return next;
      });
    },
    [user],
  );

  const updateProfile = useCallback((id, updates) => {
    setProfiles((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      storageService.saveProfiles(next);
      return next;
    });
  }, []);

  const removeProfile = useCallback((id) => {
    setProfiles((prev) => {
      const next = prev.filter((p) => p.id !== id);
      storageService.saveProfiles(next);
      return next;
    });
  }, []);

  // ─── Scan history updaters ────────────────────────────────────

  const addScan = useCallback((scan) => {
    setScanHistory((prev) => {
      const next = [scan, ...prev].slice(0, 50);
      storageService.saveScanHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setScanHistory([]);
    storageService.saveScanHistory([]);
  }, []);

  // Memoize the value object so consumers don't re-render unless
  // the actual data or callbacks change.
  const value = useMemo(
    () => ({
      // Auth
      user,
      isAuthenticated,
      authLoading,
      login,
      signup,
      logout,
      // App data
      settings,
      profiles,
      scanHistory,
      isLoaded,
      updateSettings,
      addProfile,
      updateProfile,
      removeProfile,
      addScan,
      clearHistory,
    }),
    [
      user,
      isAuthenticated,
      authLoading,
      login,
      signup,
      logout,
      settings,
      profiles,
      scanHistory,
      isLoaded,
      updateSettings,
      addProfile,
      updateProfile,
      removeProfile,
      addScan,
      clearHistory,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Hook to consume the settings context.
 * Throws if used outside of SettingsProvider.
 */
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (ctx === undefined) {
    throw new Error('useSettings must be used within a <SettingsProvider>');
  }
  return ctx;
}
