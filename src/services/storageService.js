/**
 * Storage Service - Multi-layered persistent storage
 *
 * Layer 1: SecureStore — auth tokens and sensitive credentials
 * Layer 2: AsyncStorage — settings, profiles, scan history, user data
 *
 * SecureStore has a 2048-byte value limit, so only small secrets go there.
 * Everything else uses AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// AsyncStorage keys (non-sensitive)
const KEYS = {
  SETTINGS: '@purelytics/settings',
  PROFILES: '@purelytics/profiles',
  SCAN_HISTORY: '@purelytics/scanHistory',
  USER_PROFILE: '@purelytics/userProfile',
  USERS_DB: '@purelytics/usersDb',
};

// SecureStore keys (sensitive)
const SECURE_KEYS = {
  AUTH_TOKEN: 'purelytics_auth_token',
};

// ─── Secure Layer (auth tokens) ───────────────────────────────────

async function getAuthToken() {
  try {
    return await SecureStore.getItemAsync(SECURE_KEYS.AUTH_TOKEN);
  } catch (e) {
    console.error('storageService.getAuthToken error:', e);
    return null;
  }
}

async function saveAuthToken(token) {
  try {
    await SecureStore.setItemAsync(SECURE_KEYS.AUTH_TOKEN, token);
  } catch (e) {
    console.error('storageService.saveAuthToken error:', e);
  }
}

async function deleteAuthToken() {
  try {
    await SecureStore.deleteItemAsync(SECURE_KEYS.AUTH_TOKEN);
  } catch (e) {
    console.error('storageService.deleteAuthToken error:', e);
  }
}

// ─── User Accounts (local auth — no backend) ─────────────────────

/**
 * Local user database stored in AsyncStorage.
 * Each entry: { email, passwordHash, createdAt }
 * In production this would be a real backend. This is a local-first MVP.
 */
async function getUsersDb() {
  try {
    const json = await AsyncStorage.getItem(KEYS.USERS_DB);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('storageService.getUsersDb error:', e);
    return [];
  }
}

async function saveUsersDb(users) {
  try {
    await AsyncStorage.setItem(KEYS.USERS_DB, JSON.stringify(users));
  } catch (e) {
    console.error('storageService.saveUsersDb error:', e);
  }
}

/**
 * Simple hash for local password storage.
 * NOT cryptographically secure — acceptable for local-only MVP.
 * In production, use bcrypt on a real server.
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
}

/**
 * Generate a unique token for the session
 */
function generateToken(email) {
  return 'tok_' + Date.now().toString(36) + '_' + simpleHash(email);
}

async function createUser(email, password) {
  const users = await getUsersDb();
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    throw new Error('An account with this email already exists');
  }
  const newUser = {
    id: 'user_' + Date.now(),
    email: email.toLowerCase(),
    passwordHash: simpleHash(password),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  await saveUsersDb(users);
  return newUser;
}

async function verifyUser(email, password) {
  const users = await getUsersDb();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('No account found with this email');
  }
  if (user.passwordHash !== simpleHash(password)) {
    throw new Error('Incorrect password');
  }
  return user;
}

// ─── User Profile (non-sensitive) ─────────────────────────────────

async function getUserProfile() {
  try {
    const json = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('storageService.getUserProfile error:', e);
    return null;
  }
}

async function saveUserProfile(profile) {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('storageService.saveUserProfile error:', e);
  }
}

async function deleteUserProfile() {
  try {
    await AsyncStorage.removeItem(KEYS.USER_PROFILE);
  } catch (e) {
    console.error('storageService.deleteUserProfile error:', e);
  }
}

// ─── Settings ─────────────────────────────────────────────────────

async function getSettings() {
  try {
    const json = await AsyncStorage.getItem(KEYS.SETTINGS);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('storageService.getSettings error:', e);
    return null;
  }
}

async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('storageService.saveSettings error:', e);
  }
}

// ─── Profiles ─────────────────────────────────────────────────────

async function getProfiles() {
  try {
    const json = await AsyncStorage.getItem(KEYS.PROFILES);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('storageService.getProfiles error:', e);
    return [];
  }
}

async function saveProfiles(profiles) {
  try {
    await AsyncStorage.setItem(KEYS.PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.error('storageService.saveProfiles error:', e);
  }
}

// ─── Scan History ─────────────────────────────────────────────────

async function getScanHistory() {
  try {
    const json = await AsyncStorage.getItem(KEYS.SCAN_HISTORY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('storageService.getScanHistory error:', e);
    return [];
  }
}

async function saveScanHistory(history) {
  try {
    await AsyncStorage.setItem(KEYS.SCAN_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('storageService.saveScanHistory error:', e);
  }
}

// ─── Utility ──────────────────────────────────────────────────────

async function clearAll() {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    await SecureStore.deleteItemAsync(SECURE_KEYS.AUTH_TOKEN);
  } catch (e) {
    console.error('storageService.clearAll error:', e);
  }
}

export const storageService = {
  // Secure layer
  getAuthToken,
  saveAuthToken,
  deleteAuthToken,
  // User accounts
  createUser,
  verifyUser,
  generateToken,
  // User profile
  getUserProfile,
  saveUserProfile,
  deleteUserProfile,
  // Settings
  getSettings,
  saveSettings,
  // Profiles
  getProfiles,
  saveProfiles,
  // Scan history
  getScanHistory,
  saveScanHistory,
  // Utility
  clearAll,
};

export default storageService;
