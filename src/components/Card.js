/**
 * Card Component
 * Reusable card container with consistent styling
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

const Card = ({
  children,
  variant = 'default', // default, elevated, outlined
  onPress,
  style,
  padding = true,
}) => {
  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    if (padding) {
      baseStyle.push(styles.cardPadding);
    }

    switch (variant) {
      case 'elevated':
        baseStyle.push(styles.cardElevated);
        break;
      case 'outlined':
        baseStyle.push(styles.cardOutlined);
        break;
      default:
        baseStyle.push(styles.cardDefault);
    }

    return baseStyle;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[...getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[...getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface,
  },
  cardPadding: {
    padding: theme.spacing.lg,
  },
  cardDefault: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardElevated: {
    ...theme.shadows.md,
  },
  cardOutlined: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
});

export default Card;