/**
 * ProfileCard Component
 * Displays a household member profile with their health filters
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

const ProfileCard = ({
  profile,
  onPress,
  onEdit,
  compact = false,
  style,
}) => {
  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.compactEmoji}>{profile.emoji}</Text>
        <Text style={styles.compactName}>{profile.name}</Text>
        {profile.filters && profile.filters.length > 0 && (
          <Text style={styles.compactFilter}>{profile.filters[0]}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.emoji}>{profile.emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.meta}>
            {profile.type} {profile.age && `• Age ${profile.age}`}
          </Text>
        </View>
        {onEdit && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => onEdit(profile)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {profile.filters && profile.filters.length > 0 && (
        <View style={styles.filtersContainer}>
          {profile.filters.slice(0, 4).map((filter, index) => (
            <View key={index} style={styles.filterTag}>
              <Text style={styles.filterText}>{filter}</Text>
            </View>
          ))}
          {profile.filters.length > 4 && (
            <View style={styles.moreTag}>
              <Text style={styles.moreText}>+{profile.filters.length - 4}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
    marginRight: theme.spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  meta: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textTransform: 'capitalize',
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

  // Filters
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.md,
    gap: 8,
  },
  filterTag: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  filterText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  moreTag: {
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  moreText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },

  // Compact variant
  compactCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    minWidth: 140,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  compactEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  compactFilter: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
});

export default ProfileCard;