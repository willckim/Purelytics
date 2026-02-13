/**
 * SettingsScreen - App settings including AI provider selection
 * Now uses SettingsContext for persistence instead of SecureStore
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { getConfiguredProviders, isAIConfigured, isBraveConfigured } from '../services/aiService';
import { useSettings } from '../context/SettingsContext';

// AI Provider options
const AI_PROVIDERS = [
  {
    id: 'auto',
    name: 'Auto (Best Available)',
    icon: '🤖',
    description: 'Automatically picks the best configured AI',
  },
  {
    id: 'anthropic',
    name: 'Claude (Anthropic)',
    icon: '🟣',
    description: 'Best accuracy, excellent at reading complex labels',
    link: 'https://console.anthropic.com',
  },
  {
    id: 'gemini',
    name: 'Gemini (Google)',
    icon: '🔵',
    description: 'Fast & free tier available',
    link: 'https://aistudio.google.com/apikey',
  },
  {
    id: 'openai',
    name: 'GPT-4 Vision (OpenAI)',
    icon: '🟢',
    description: 'Reliable, widely used',
    link: 'https://platform.openai.com/api-keys',
  },
];

// Setting Item Component
const SettingItem = ({ icon, title, subtitle, right }) => (
  <View style={styles.settingItem}>
    <Text style={styles.settingIcon}>{icon}</Text>
    <View style={styles.settingInfo}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {right}
  </View>
);

// AI Provider Option Component
const AIProviderOption = ({ provider, isSelected, isConfigured, onSelect }) => (
  <TouchableOpacity
    style={[
      styles.providerOption,
      isSelected && styles.providerOptionSelected,
      !isConfigured && provider.id !== 'auto' && styles.providerOptionDisabled,
    ]}
    onPress={() => {
      if (isConfigured || provider.id === 'auto') {
        onSelect(provider.id);
      } else {
        Alert.alert(
          `${provider.name} Not Configured`,
          `Add your API key to src/config/apiKeys.js to use ${provider.name}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Get API Key', onPress: () => Linking.openURL(provider.link) },
          ]
        );
      }
    }}
    activeOpacity={0.7}
  >
    <View style={styles.providerHeader}>
      <Text style={styles.providerIcon}>{provider.icon}</Text>
      <View style={styles.providerInfo}>
        <Text style={[
          styles.providerName,
          isSelected && styles.providerNameSelected,
        ]}>
          {provider.name}
        </Text>
        <Text style={styles.providerDesc}>{provider.description}</Text>
      </View>
      <View style={[
        styles.radioButton,
        isSelected && styles.radioButtonSelected,
      ]}>
        {isSelected && <View style={styles.radioButtonInner} />}
      </View>
    </View>
    {!isConfigured && provider.id !== 'auto' && (
      <View style={styles.notConfiguredBadge}>
        <Text style={styles.notConfiguredText}>⚠️ API key not set</Text>
      </View>
    )}
    {isConfigured && provider.id !== 'auto' && (
      <View style={styles.configuredBadge}>
        <Text style={styles.configuredText}>✓ Configured</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function SettingsScreen({ navigation }) {
  const { settings, updateSettings, user, logout } = useSettings();
  const [configuredProviders, setConfiguredProviders] = useState([]);

  useEffect(() => {
    setConfiguredProviders(getConfiguredProviders());
  }, []);

  const handleProviderSelect = (providerId) => {
    updateSettings({ aiProvider: providerId });
  };

  const handleAutoScanToggle = (value) => {
    updateSettings({ autoScan: value });
  };

  const handleShowScoresToggle = (value) => {
    updateSettings({ showScores: value });
  };

  const handleGetAPIKey = () => {
    Alert.alert(
      'Get API Keys',
      'Which AI provider would you like to set up?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Gemini (Free)', onPress: () => Linking.openURL('https://aistudio.google.com/apikey') },
        { text: 'OpenAI', onPress: () => Linking.openURL('https://platform.openai.com/api-keys') },
        { text: 'Claude', onPress: () => Linking.openURL('https://console.anthropic.com') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* AI Provider Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 AI Provider</Text>
          <Text style={styles.sectionSubtitle}>
            Choose which AI analyzes your ingredient labels
          </Text>

          <View style={styles.providersContainer}>
            {AI_PROVIDERS.map((provider) => (
              <AIProviderOption
                key={provider.id}
                provider={provider}
                isSelected={settings.aiProvider === provider.id}
                isConfigured={configuredProviders.includes(provider.id)}
                onSelect={handleProviderSelect}
              />
            ))}
          </View>

          {/* API Key Setup Button */}
          <TouchableOpacity
            style={styles.setupButton}
            onPress={handleGetAPIKey}
          >
            <Text style={styles.setupButtonIcon}>🔑</Text>
            <Text style={styles.setupButtonText}>Get API Keys</Text>
          </TouchableOpacity>
        </View>

        {/* Scanning Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📷 Scanning</Text>

          <SettingItem
            icon="⚡"
            title="Auto-detect text"
            subtitle="Automatically scan when text is detected"
            right={
              <Switch
                value={settings.autoScan}
                onValueChange={handleAutoScanToggle}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        {/* Display Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Display</Text>

          <SettingItem
            icon="💯"
            title="Show ingredient scores"
            subtitle="Display safety score for each ingredient"
            right={
              <Switch
                value={settings.showScores}
                onValueChange={handleShowScoresToggle}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About</Text>

          <SettingItem
            icon="📱"
            title="Version"
            subtitle="1.0.0"
          />

          <TouchableOpacity onPress={() => Linking.openURL('https://purelytics.app/privacy')}>
            <SettingItem
              icon="🔒"
              title="Privacy Policy"
              right={<Text style={styles.linkArrow}>→</Text>}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('https://purelytics.app/terms')}>
            <SettingItem
              icon="📄"
              title="Terms of Service"
              right={<Text style={styles.linkArrow}>→</Text>}
            />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {user && (
            <SettingItem
              icon="👤"
              title={user.email}
              subtitle="Signed in"
            />
          )}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: logout },
              ]);
            }}
          >
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>
            {isAIConfigured() ? 'AI Ready' : 'AI Not Configured'}
          </Text>
          <Text style={styles.statusText}>
            {isAIConfigured()
              ? `Using: ${configuredProviders.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}`
              : 'Add an API key to enable real ingredient scanning'
            }
          </Text>
          <Text style={styles.statusText}>
            {isBraveConfigured()
              ? 'Web Search: Brave Search active'
              : 'Web Search: Not configured (optional)'
            }
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
  },

  // Sections
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },

  // Provider Selection
  providersContainer: {
    gap: theme.spacing.sm,
  },
  providerOption: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  providerOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  providerOptionDisabled: {
    opacity: 0.7,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  providerNameSelected: {
    color: theme.colors.primary,
  },
  providerDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: theme.colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  notConfiguredBadge: {
    marginTop: theme.spacing.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    marginLeft: 40,
  },
  notConfiguredText: {
    fontSize: 11,
    color: '#F59E0B',
  },
  configuredBadge: {
    marginTop: theme.spacing.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    marginLeft: 40,
  },
  configuredText: {
    fontSize: 11,
    color: '#10B981',
  },

  // Setup Button
  setupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  setupButtonIcon: {
    fontSize: 18,
    marginRight: theme.spacing.sm,
  },
  setupButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },

  // Setting Items
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: theme.spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.text,
  },
  settingSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  linkArrow: {
    fontSize: 18,
    color: theme.colors.textMuted,
  },

  // Status Card
  statusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statusText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },

  // Logout
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
  },
});
