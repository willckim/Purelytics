/**
 * Badge Component
 * Small status indicators and labels
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, getConcernBadge } from '../theme';

const Badge = ({
  label,
  variant = 'default', // default, success, warning, danger, info
  concern, // Alternative: use concern level directly
  size = 'medium', // small, medium
  icon,
  style,
}) => {
  // If concern is provided, use predefined styling
  if (concern) {
    const badgeStyle = getConcernBadge(concern);
    return (
      <View style={[
        styles.badge,
        styles[`badge_${size}`],
        { backgroundColor: badgeStyle.bg },
        style
      ]}>
        {badgeStyle.icon && <Text style={styles.icon}>{badgeStyle.icon}</Text>}
        <Text style={[
          styles.text,
          styles[`text_${size}`],
          { color: badgeStyle.color }
        ]}>
          {label || badgeStyle.label}
        </Text>
      </View>
    );
  }

  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return {
          bg: theme.colors.scoreExcellent + '20',
          color: theme.colors.scoreExcellent,
        };
      case 'warning':
        return {
          bg: theme.colors.warning + '20',
          color: theme.colors.warning,
        };
      case 'danger':
        return {
          bg: theme.colors.danger + '20',
          color: theme.colors.danger,
        };
      case 'info':
        return {
          bg: theme.colors.primary + '20',
          color: theme.colors.primary,
        };
      default:
        return {
          bg: theme.colors.surfaceElevated,
          color: theme.colors.textSecondary,
        };
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <View style={[
      styles.badge,
      styles[`badge_${size}`],
      { backgroundColor: variantStyle.bg },
      style
    ]}>
      {icon && <Text style={[styles.icon, { color: variantStyle.color }]}>{icon}</Text>}
      <Text style={[
        styles.text,
        styles[`text_${size}`],
        { color: variantStyle.color }
      ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
  },
  badge_small: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badge_medium: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontWeight: '500',
  },
  text_small: {
    fontSize: 10,
  },
  text_medium: {
    fontSize: 12,
  },
  icon: {
    marginRight: 4,
    fontSize: 10,
  },
});

export default Badge;