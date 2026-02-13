/**
 * Purelytics Design System Theme
 * Consistent styling across the entire application
 */

export const theme = {
  colors: {
    // Primary palette - Fresh, organic feel
    primary: '#2D5A4A',
    primaryLight: '#4A7C68',
    primaryDark: '#1A3D32',
    
    // Background layers
    background: '#FAFBF9',
    surface: '#FFFFFF',
    surfaceElevated: '#F5F7F4',
    
    // Health score colors
    scoreExcellent: '#22C55E',
    scoreGood: '#84CC16',
    scoreFair: '#EAB308',
    scorePoor: '#F97316',
    scoreBad: '#EF4444',
    
    // Semantic colors
    text: '#1A1F1C',
    textSecondary: '#5A6B62',
    textMuted: '#8B9A92',
    border: '#E2E8E4',
    
    // Accent colors
    accent: '#FF6B4A',
    accentSoft: '#FFF0ED',
    primarySoft: '#E8F0ED',
    highlight: '#10B981',
    warning: '#F59E0B',
    danger: '#DC2626',
    
    // Utility
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  typography: {
    // Font families
    fontFamily: {
      display: 'System', // Platform will use SF Pro Display (iOS) or Roboto (Android)
      heading: 'System',
      body: 'System',
      mono: 'Courier',
    },
    
    // Font sizes
    fontSize: {
      xs: 11,
      sm: 13,
      base: 15,
      md: 16,
      lg: 18,
      xl: 22,
      '2xl': 28,
      '3xl': 32,
    },
    
    // Font weights
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

// Utility functions for dynamic styling
export const getScoreColor = (score) => {
  if (score >= 80) return theme.colors.scoreExcellent;
  if (score >= 60) return theme.colors.scoreGood;
  if (score >= 40) return theme.colors.scoreFair;
  if (score >= 20) return theme.colors.scorePoor;
  return theme.colors.scoreBad;
};

export const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  if (score >= 20) return 'Poor';
  return 'Avoid';
};

export const getScoreDescription = (score) => {
  if (score >= 80) return 'This product has a clean ingredient list with minimal concerns.';
  if (score >= 60) return 'This product is generally okay but has some minor concerns.';
  if (score >= 40) return 'This product has moderate concerns. Consider alternatives.';
  if (score >= 20) return 'This product has significant concerns. Look for healthier options.';
  return 'This product has major health concerns. We recommend avoiding it.';
};

export const getConcernBadge = (concern) => {
  const badges = {
    high: { 
      bg: '#FEE2E2', 
      color: '#DC2626', 
      label: 'High Concern',
      icon: '⚠️'
    },
    moderate: { 
      bg: '#FEF3C7', 
      color: '#D97706', 
      label: 'Moderate',
      icon: '⚡'
    },
    low: { 
      bg: '#DCFCE7', 
      color: '#16A34A', 
      label: 'Low Concern',
      icon: '✓'
    },
    none: { 
      bg: '#F0FDF4', 
      color: '#15803D', 
      label: 'Safe',
      icon: '✓'
    },
  };
  return badges[concern] || badges.moderate;
};

// Common style presets
export const stylePresets = {
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  
  button: {
    primary: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold,
    },
  },
  
  text: {
    title: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text,
    },
    heading: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text,
    },
    body: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.regular,
      color: theme.colors.text,
      lineHeight: 22,
    },
    caption: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.regular,
      color: theme.colors.textMuted,
    },
  },
  
  badge: {
    container: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.full,
    },
    text: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.medium,
    },
  },
};

export default theme;