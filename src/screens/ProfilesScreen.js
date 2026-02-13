/**
 * ProfilesScreen - Manage household profiles
 * Set dietary restrictions and health filters for family members.
 * Profiles are linked to the authenticated user account.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { useSettings } from '../context/SettingsContext';

// Available filter options
const FILTER_OPTIONS = [
  { id: 'kid-safe', label: 'Kid-Safe', emoji: '👶', description: 'Flags artificial dyes and controversial additives' },
  { id: 'no-dyes', label: 'No Artificial Dyes', emoji: '🎨', description: 'Alerts for Red 40, Yellow 5, Blue 1, etc.' },
  { id: 'low-sugar', label: 'Low Sugar', emoji: '🍬', description: 'Flags hidden sugars and high sugar content' },
  { id: 'heart-healthy', label: 'Heart-Healthy', emoji: '❤️', description: 'Flags high sodium, trans fats, and inflammatory oils' },
  { id: 'diabetic', label: 'Diabetic-Friendly', emoji: '🩺', description: 'Alerts for high glycemic ingredients' },
  { id: 'anti-inflammatory', label: 'Anti-Inflammatory', emoji: '🌿', description: 'Flags inflammatory additives and oils' },
  { id: 'gluten-free', label: 'Gluten-Free', emoji: '🌾', description: 'Detects gluten-containing ingredients' },
  { id: 'dairy-free', label: 'Dairy-Free', emoji: '🥛', description: 'Alerts for dairy and lactose' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱', description: 'Flags animal-derived ingredients' },
  { id: 'no-msg', label: 'No MSG', emoji: '⚡', description: 'Detects MSG and hidden glutamates' },
];

// Profile type options
const PROFILE_TYPES = [
  { id: 'child', label: 'Child', emoji: '👧' },
  { id: 'teen', label: 'Teen', emoji: '🧑' },
  { id: 'adult', label: 'Adult', emoji: '👨' },
  { id: 'senior', label: 'Senior', emoji: '👵' },
];

// Profile Card Component
const ProfileCard = ({ profile, onPress, onEdit, onDelete }) => {
  const activeFilters = FILTER_OPTIONS.filter(f => profile.filters.includes(f.id));

  const handleDelete = () => {
    Alert.alert(
      'Remove Profile',
      `Are you sure you want to remove ${profile.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => onDelete(profile.id) },
      ],
    );
  };

  return (
    <TouchableOpacity
      style={styles.profileCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.profileHeader}>
        <Text style={styles.profileEmoji}>{profile.emoji}</Text>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileMeta}>
            {PROFILE_TYPES.find(t => t.id === profile.type)?.label} • Age {profile.age}
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(profile)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        {activeFilters.map((filter) => (
          <View key={filter.id} style={styles.filterTag}>
            <Text style={styles.filterEmoji}>{filter.emoji}</Text>
            <Text style={styles.filterLabel}>{filter.label}</Text>
          </View>
        ))}
        {activeFilters.length === 0 && (
          <Text style={styles.noFiltersText}>No filters set</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Add / Edit Profile Modal
const ProfileModal = ({ visible, onClose, onSave, editProfile }) => {
  const [name, setName] = useState(editProfile?.name || '');
  const [age, setAge] = useState(editProfile?.age?.toString() || '');
  const [type, setType] = useState(editProfile?.type || 'adult');
  const [selectedFilters, setSelectedFilters] = useState(editProfile?.filters || []);

  // Reset form when modal opens with new data
  React.useEffect(() => {
    if (visible) {
      setName(editProfile?.name || '');
      setAge(editProfile?.age?.toString() || '');
      setType(editProfile?.type || 'adult');
      setSelectedFilters(editProfile?.filters || []);
    }
  }, [visible, editProfile]);

  const toggleFilter = (filterId) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const handleSave = () => {
    const profileType = PROFILE_TYPES.find(t => t.id === type);
    onSave({
      id: editProfile?.id || Date.now(),
      name,
      age: parseInt(age) || 0,
      type,
      emoji: profileType?.emoji || '👤',
      filters: selectedFilters,
    });
    onClose();
  };

  const isEditing = !!editProfile;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {isEditing ? 'Edit Profile' : 'Add Profile'}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={!name}>
            <Text style={[styles.modalSave, !name && styles.modalSaveDisabled]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>

          {/* Age Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.textInput}
              value={age}
              onChangeText={setAge}
              placeholder="Enter age"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="number-pad"
            />
          </View>

          {/* Profile Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Profile Type</Text>
            <View style={styles.typeContainer}>
              {PROFILE_TYPES.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.typeButton, type === t.id && styles.typeButtonActive]}
                  onPress={() => setType(t.id)}
                >
                  <Text style={styles.typeEmoji}>{t.emoji}</Text>
                  <Text style={[styles.typeLabel, type === t.id && styles.typeLabelActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Filters */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Health Filters</Text>
            <Text style={styles.inputHint}>
              Select the dietary needs and restrictions for this profile
            </Text>
            <View style={styles.filtersList}>
              {FILTER_OPTIONS.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterOption,
                    selectedFilters.includes(filter.id) && styles.filterOptionActive
                  ]}
                  onPress={() => toggleFilter(filter.id)}
                >
                  <Text style={styles.filterOptionEmoji}>{filter.emoji}</Text>
                  <View style={styles.filterOptionInfo}>
                    <Text style={styles.filterOptionLabel}>{filter.label}</Text>
                    <Text style={styles.filterOptionDesc}>{filter.description}</Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    selectedFilters.includes(filter.id) && styles.checkboxActive
                  ]}>
                    {selectedFilters.includes(filter.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default function ProfilesScreen({ navigation }) {
  const { profiles, user, addProfile, updateProfile, removeProfile } = useSettings();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  // Filter profiles to only show current user's profiles
  const userProfiles = profiles.filter(
    (p) => !p.userId || p.userId === user?.id
  );

  const handleAddProfile = (newProfile) => {
    if (editingProfile) {
      updateProfile(editingProfile.id, newProfile);
    } else {
      addProfile(newProfile);
    }
    setEditingProfile(null);
  };

  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
    setModalVisible(true);
  };

  const handleProfilePress = (profile) => {
    // Open edit for now
    handleEditProfile(profile);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingProfile(null);
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
          <Text style={styles.title}>Household Profiles</Text>
          <Text style={styles.subtitle}>
            Set up health filters for your family
          </Text>
          {user && (
            <Text style={styles.accountBadge}>
              Linked to {user.email}
            </Text>
          )}
        </View>

        {/* Empty State or Profiles List */}
        {userProfiles.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.emptyStateTitle}>No profiles yet</Text>
            <Text style={styles.emptyStateText}>
              Add family members to get personalized ingredient alerts based on their specific health needs
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyStateButtonText}>+ Add First Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {userProfiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onPress={() => handleProfilePress(profile)}
                onEdit={handleEditProfile}
                onDelete={removeProfile}
              />
            ))}

            {/* Add Profile Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonIcon}>+</Text>
              <Text style={styles.addButtonText}>Add Family Member</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How Profiles Work</Text>
          <Text style={styles.infoText}>
            When you scan a product, Purelytics will automatically check it against
            each profile's health filters and alert you to any concerns specific to
            that family member. All profiles are saved to your account.
          </Text>
        </View>
      </ScrollView>

      {/* Add / Edit Profile Modal */}
      <ProfileModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleAddProfile}
        editProfile={editingProfile}
      />
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

  // Header
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  accountBadge: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
    marginTop: 6,
  },

  // Profile Cards
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  profileEmoji: {
    fontSize: 40,
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  profileMeta: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteButtonText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  filterEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  filterLabel: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  noFiltersText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },

  // Add Button
  addButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  addButtonIcon: {
    fontSize: 32,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  addButtonText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },

  // Info Card
  infoCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text,
  },
  modalCancel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  modalSave: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  modalSaveDisabled: {
    color: theme.colors.textMuted,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.lg,
  },

  // Input Groups
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  inputHint: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  textInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Type Selection
  typeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeButtonActive: {
    backgroundColor: theme.colors.primary + '15',
    borderColor: theme.colors.primary,
  },
  typeEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  typeLabelActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },

  // Filters List
  filtersList: {
    gap: theme.spacing.sm,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterOptionActive: {
    backgroundColor: theme.colors.primary + '10',
    borderColor: theme.colors.primary,
  },
  filterOptionEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  filterOptionInfo: {
    flex: 1,
  },
  filterOptionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  filterOptionDesc: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Empty State
  emptyState: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyStateIcon: {
    fontSize: 56,
    marginBottom: theme.spacing.md,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  emptyStateButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
