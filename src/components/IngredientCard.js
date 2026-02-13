/**
 * IngredientCard Component
 * Displays a single ingredient with score and concern level
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme, getScoreColor, getConcernBadge } from '../theme';

const IngredientCard = ({
  ingredient,
  onPress,
  showCategory = true,
  compact = false,
  style,
}) => {
  const scoreColor = getScoreColor(ingredient.score);
  const badge = getConcernBadge(ingredient.concern || 'moderate');

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, style]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <View style={[styles.compactScore, { backgroundColor: scoreColor + '20' }]}>
          <Text style={[styles.compactScoreText, { color: scoreColor }]}>
            {ingredient.score}
          </Text>
        </View>
        <Text style={styles.compactName} numberOfLines={1}>
          {ingredient.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={[styles.scoreBox, { backgroundColor: scoreColor + '20' }]}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>
          {ingredient.score}
        </Text>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>{ingredient.name}</Text>
        {showCategory && ingredient.category && (
          <Text style={styles.category}>{ingredient.category}</Text>
        )}
      </View>

      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.badgeText, { color: badge.color }]}>
          {badge.label}
        </Text>
      </View>

      {onPress && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scoreBox: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  category: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 20,
    color: theme.colors.textMuted,
  },

  // Compact variant
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  compactScore: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  compactScoreText: {
    fontSize: 12,
    fontWeight: '700',
  },
  compactName: {
    fontSize: 13,
    color: theme.colors.text,
    flex: 1,
  },
});

export default IngredientCard;