/**
 * HomeScreen - Main dashboard of Purelytics
 * Shows quick scan access, active profiles, and recent scans
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, getScoreColor } from '../theme';
import { useSettings } from '../context/SettingsContext';

const { width } = Dimensions.get('window');

// Profile Card Component
const ProfileCard = ({ profile, onPress }) => (
  <TouchableOpacity
    style={styles.profileCard}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.profileEmoji}>{profile.emoji}</Text>
    <Text style={styles.profileName}>{profile.name}</Text>
    <Text style={styles.profileFilter}>
      {profile.filters && profile.filters.length > 0 ? profile.filters[0] : 'No filters'}
    </Text>
  </TouchableOpacity>
);

// Add Profile Button
const AddProfileButton = ({ onPress }) => (
  <TouchableOpacity
    style={styles.addProfileButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.addProfileIcon}>+</Text>
    <Text style={styles.addProfileText}>Add</Text>
  </TouchableOpacity>
);

// Recent Scan Item Component
const RecentScanItem = ({ scan, onPress }) => (
  <TouchableOpacity
    style={styles.scanItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.scanScore, { backgroundColor: getScoreColor(scan.overallScore) + '20' }]}>
      <Text style={[styles.scanScoreText, { color: getScoreColor(scan.overallScore) }]}>
        {scan.overallScore}
      </Text>
    </View>
    <View style={styles.scanInfo}>
      <Text style={styles.scanName}>{scan.name}</Text>
      <Text style={styles.scanTime}>{scan.scannedAt ? new Date(scan.scannedAt).toLocaleDateString() : ''}</Text>
    </View>
    <Text style={styles.scanArrow}>›</Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const { profiles, scanHistory } = useSettings();

  const handleScan = () => {
    navigation.navigate('Scan');
  };

  const handleScanItem = (scan) => {
    navigation.navigate('Results', { product: scan });
  };

  const recentScans = scanHistory.slice(0, 5);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Purelytics</Text>
          <Text style={styles.subtitle}>Decode what you eat</Text>
        </View>

        {/* Quick Scan Button */}
        <TouchableOpacity
          onPress={handleScan}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scanButton}
          >
            <Text style={styles.scanButtonIcon}>📷</Text>
            <View style={styles.scanButtonText}>
              <Text style={styles.scanButtonTitle}>Scan a Product</Text>
              <Text style={styles.scanButtonSubtitle}>Point camera at ingredient list</Text>
            </View>
            <Text style={styles.scanButtonArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Active Profiles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Profiles</Text>
          {profiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>👨‍👩‍👧</Text>
              <Text style={styles.emptyStateText}>No profiles yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add household members to get personalized alerts
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('Profiles')}
              >
                <Text style={styles.emptyStateButtonText}>+ Add Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.profilesList}
            >
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onPress={() => navigation.navigate('Profiles')}
                />
              ))}
              <AddProfileButton onPress={() => navigation.navigate('Profiles')} />
            </ScrollView>
          )}
        </View>

        {/* Recent Scans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          {recentScans.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📋</Text>
              <Text style={styles.emptyStateText}>No scans yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Scan your first product to see it here
              </Text>
            </View>
          ) : (
            recentScans.map((scan, index) => (
              <RecentScanItem
                key={scan.id || index}
                scan={scan}
                onPress={() => handleScanItem(scan)}
              />
            ))
          )}
        </View>

        {/* Quick Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Did you know?</Text>
          <Text style={styles.tipsText}>
            There are over 60 different names for sugar on ingredient lists.
            Purelytics automatically detects all of them!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },

  // Scan Button
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  scanButtonIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  scanButtonText: {
    flex: 1,
  },
  scanButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scanButtonSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  scanButtonArrow: {
    fontSize: 24,
    color: '#FFFFFF',
  },

  // Sections
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  // Profile Cards
  profilesList: {
    paddingRight: theme.spacing.lg,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginRight: theme.spacing.sm,
    minWidth: 140,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  profileEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  profileFilter: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  addProfileButton: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    minWidth: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addProfileIcon: {
    fontSize: 24,
    color: theme.colors.textMuted,
  },
  addProfileText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 4,
  },

  // Recent Scans
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scanScore: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanScoreText: {
    fontSize: 16,
    fontWeight: '700',
  },
  scanInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  scanName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  scanTime: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  scanArrow: {
    fontSize: 20,
    color: theme.colors.textMuted,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  tipsText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },

  // Empty State
  emptyState: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyStateIcon: {
    fontSize: 40,
    marginBottom: theme.spacing.md,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyStateButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
