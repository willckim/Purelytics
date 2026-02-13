/**
 * ResultsScreen - Display scanned product analysis
 * Shows overall score, ingredient breakdown, and health alerts
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { theme, getScoreColor, getScoreLabel, getConcernBadge } from '../theme';
import { ingredientDatabase } from '../data/ingredientDatabase';

const { width } = Dimensions.get('window');

// Score Ring Component
const ScoreRing = ({ score, size = 100, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={theme.colors.surfaceElevated}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text style={[styles.scoreValue, { color }]}>{score}</Text>
        <Text style={styles.scoreLabel}>{getScoreLabel(score)}</Text>
      </View>
    </View>
  );
};

// Concern Badge Component
const ConcernBadge = ({ type, count, names }) => {
  const icons = {
    sugar: '🍬',
    preservatives: '⚠️',
    artificial: '🎨',
  };

  const labels = {
    sugar: 'Hidden Sugars',
    preservatives: 'Preservatives',
    artificial: 'Artificial Colors',
  };

  const colors = {
    sugar: theme.colors.warning,
    preservatives: theme.colors.danger,
    artificial: theme.colors.accent,
  };

  if (count === 0) return null;

  return (
    <View style={[styles.concernBadge, { backgroundColor: colors[type] + '20' }]}>
      <Text style={styles.concernIcon}>{icons[type]}</Text>
      <Text style={[styles.concernText, { color: colors[type] }]}>
        {count} {labels[type]}
      </Text>
    </View>
  );
};

// Profile Alert Component
const ProfileAlert = ({ alert }) => (
  <View style={styles.alertCard}>
    <View style={styles.alertHeader}>
      <Text style={styles.alertProfile}>{alert.profile}</Text>
    </View>
    <Text style={styles.alertMessage}>{alert.message}</Text>
  </View>
);

// Ingredient Item Component
const IngredientItem = ({ ingredient, onPress }) => {
  const badge = getConcernBadge(ingredient.concern || 'moderate');
  const scoreColor = getScoreColor(ingredient.score);

  return (
    <TouchableOpacity 
      style={styles.ingredientItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.ingredientScore, { backgroundColor: scoreColor + '20' }]}>
        <Text style={[styles.ingredientScoreText, { color: scoreColor }]}>
          {ingredient.score}
        </Text>
      </View>
      <View style={styles.ingredientInfo}>
        <Text style={styles.ingredientName}>{ingredient.name}</Text>
        <Text style={styles.ingredientCategory}>{ingredient.category || 'Ingredient'}</Text>
      </View>
      <View style={[styles.ingredientBadge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.ingredientBadgeText, { color: badge.color }]}>
          {badge.label}
        </Text>
      </View>
      <Text style={styles.ingredientArrow}>›</Text>
    </TouchableOpacity>
  );
};

export default function ResultsScreen({ route, navigation }) {
  const { product } = route.params || {};
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  // Get real ingredient data from database
  const getIngredientData = (id) => {
    const dbIngredient = ingredientDatabase[id];
    if (dbIngredient) {
      return {
        id: dbIngredient.id,
        name: dbIngredient.name,
        score: dbIngredient.score,
        category: dbIngredient.category,
        concern: dbIngredient.concern,
        plainEnglish: dbIngredient.plainEnglish,
        healthNotes: dbIngredient.healthNotes,
        hiddenNames: dbIngredient.hiddenNames,
        foundIn: dbIngredient.foundIn,
        dailyLimit: dbIngredient.dailyLimit,
        regulatoryStatus: dbIngredient.regulatoryStatus,
        sources: dbIngredient.sources,
        kidAlert: dbIngredient.kidAlert,
        heartHealthAlert: dbIngredient.heartHealthAlert,
        diabeticAlert: dbIngredient.diabeticAlert,
      };
    }
    return { id, name: id, score: 50, category: 'Unknown', concern: 'moderate' };
  };

  // Demo product with real ingredient data
  const productData = product || {
    name: 'Classic Hot Dogs',
    brand: 'Oscar Mayer',
    category: 'Processed Meat',
    overallScore: 28,
    ingredients: [
      getIngredientData('sodium-nitrite'),
      getIngredientData('high-fructose-corn-syrup'),
      getIngredientData('sodium-benzoate'),
      getIngredientData('bha'),
      getIngredientData('red-40'),
      getIngredientData('yellow-5'),
      getIngredientData('citric-acid'),
    ],
    concerns: {
      sugar: { count: 2, names: ['High Fructose Corn Syrup', 'Corn Syrup Solids'] },
      preservatives: { count: 3, names: ['Sodium Nitrite', 'Sodium Benzoate', 'BHA'] },
      artificial: { count: 2, names: ['Red 40', 'Yellow 5'] },
    },
    profileAlerts: [
      { profile: '👧 Kids', message: 'Contains nitrites and artificial dyes linked to hyperactivity (Southampton Study, 2007)' },
      { profile: '❤️ Heart Health', message: 'High sodium content (480mg per serving). Contains trans fat loophole ingredients.' },
    ],
    rawText: 'MECHANICALLY SEPARATED CHICKEN, WATER, PORK, CORN SYRUP, CONTAINS LESS THAN 2% OF: SALT, POTASSIUM LACTATE, SODIUM PHOSPHATES, BEEF, SODIUM DIACETATE, SODIUM ASCORBATE, SODIUM NITRITE, FLAVOR.',
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleViewIngredient = (ingredient) => {
    navigation.navigate('IngredientDetail', { ingredient });
  };

  const handleFindAlternatives = () => {
    navigation.navigate('Alternatives', { product: productData });
  };

  const displayedIngredients = showAllIngredients 
    ? productData.ingredients 
    : productData.ingredients.slice(0, 4);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Score */}
        <View style={[styles.header, { backgroundColor: getScoreColor(productData.overallScore) + '15' }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back to scan</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <ScoreRing score={productData.overallScore} size={100} strokeWidth={8} />
            <View style={styles.headerInfo}>
              <Text style={styles.productName}>{productData.name}</Text>
              <Text style={styles.productBrand}>
                {productData.brand} • {productData.category}
              </Text>
              <View style={styles.concernsRow}>
                <ConcernBadge 
                  type="sugar" 
                  count={productData.concerns.sugar.count}
                  names={productData.concerns.sugar.names}
                />
                <ConcernBadge 
                  type="preservatives" 
                  count={productData.concerns.preservatives.count}
                  names={productData.concerns.preservatives.names}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Profile Alerts */}
        {productData.profileAlerts && productData.profileAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Text style={styles.alertIcon}>🔔</Text> Alerts for Your Household
            </Text>
            {productData.profileAlerts.map((alert, index) => (
              <ProfileAlert key={index} alert={alert} />
            ))}
          </View>
        )}

        {/* Ingredient Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredient Breakdown</Text>
          {displayedIngredients.map((ingredient, index) => (
            <IngredientItem
              key={ingredient.id || `${ingredient.name}-${index}`}
              ingredient={ingredient}
              onPress={() => handleViewIngredient(ingredient)}
            />
          ))}
          
          {productData.ingredients.length > 4 && !showAllIngredients && (
            <TouchableOpacity 
              style={styles.showMoreButton}
              onPress={() => setShowAllIngredients(true)}
            >
              <Text style={styles.showMoreText}>
                Show {productData.ingredients.length - 4} more ingredients
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Supplement Info (only for supplements) */}
        {productData.supplementInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Supplement Analysis</Text>
            <View style={styles.supplementCard}>
              <View style={styles.supplementRow}>
                <Text style={styles.supplementLabel}>Form Quality</Text>
                <Text style={styles.supplementValue}>
                  {productData.supplementInfo.formQuality?.charAt(0).toUpperCase() + productData.supplementInfo.formQuality?.slice(1)}
                </Text>
              </View>
              <View style={styles.supplementRow}>
                <Text style={styles.supplementLabel}>Dosage</Text>
                <Text style={styles.supplementValue}>
                  {productData.supplementInfo.dosageAdequacy?.charAt(0).toUpperCase() + productData.supplementInfo.dosageAdequacy?.slice(1)}
                </Text>
              </View>
              {productData.supplementInfo.bioavailabilityNotes && (
                <View style={styles.supplementNotesRow}>
                  <Text style={styles.supplementLabel}>Bioavailability</Text>
                  <Text style={styles.supplementNotes}>
                    {productData.supplementInfo.bioavailabilityNotes}
                  </Text>
                </View>
              )}
            </View>

            {/* DV Percentages */}
            {productData.supplementInfo.dvPercentages?.length > 0 && (
              <View style={styles.dvSection}>
                <Text style={styles.dvSectionTitle}>Daily Value Breakdown</Text>
                {productData.supplementInfo.dvPercentages.map((dv, index) => (
                  <View key={index} style={styles.dvRow}>
                    <View style={styles.dvNameCol}>
                      <Text style={styles.dvNutrient}>{dv.nutrient}</Text>
                      <Text style={styles.dvAmount}>{dv.amount}</Text>
                    </View>
                    <View style={styles.dvValueCol}>
                      <Text style={[
                        styles.dvPercent,
                        parseInt(dv.dailyValue) > 200 && styles.dvPercentHigh,
                      ]}>
                        {dv.dailyValue}
                      </Text>
                    </View>
                    {dv.assessment && (
                      <Text style={styles.dvAssessment} numberOfLines={1}>
                        {dv.assessment}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Interactions */}
            {productData.supplementInfo.interactions?.length > 0 && (
              <View style={styles.interactionsSection}>
                <Text style={styles.interactionsTitle}>Potential Interactions</Text>
                {productData.supplementInfo.interactions.map((interaction, index) => (
                  <View key={index} style={[
                    styles.interactionCard,
                    interaction.severity === 'high' && styles.interactionHigh,
                    interaction.severity === 'moderate' && styles.interactionModerate,
                  ]}>
                    <Text style={styles.interactionPair}>
                      {interaction.pair?.join(' + ')}
                    </Text>
                    <Text style={styles.interactionNote}>{interaction.note}</Text>
                    <View style={[
                      styles.severityBadge,
                      interaction.severity === 'high' && styles.severityHigh,
                      interaction.severity === 'moderate' && styles.severityModerate,
                      interaction.severity === 'low' && styles.severityLow,
                    ]}>
                      <Text style={styles.severityText}>
                        {interaction.severity?.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Megadose Warnings */}
            {productData.supplementInfo.megadoseWarnings?.length > 0 && (
              <View style={styles.warningsSection}>
                <Text style={styles.warningsTitle}>Megadose Warnings</Text>
                {productData.supplementInfo.megadoseWarnings.map((warning, index) => (
                  <View key={index} style={styles.warningCard}>
                    <Text style={styles.warningText}>{warning}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Smart Swaps CTA */}
        <TouchableOpacity 
          style={styles.alternativesButton}
          onPress={handleFindAlternatives}
          activeOpacity={0.8}
        >
          <Text style={styles.alternativesIcon}>🔄</Text>
          <Text style={styles.alternativesText}>Find Healthier Alternatives</Text>
        </TouchableOpacity>

        {/* Raw Ingredients Text */}
        {productData.rawText && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Original Label Text</Text>
            <View style={styles.rawTextCard}>
              <Text style={styles.rawText}>{productData.rawText}</Text>
            </View>
          </View>
        )}
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
    paddingBottom: 100,
  },

  // Header
  header: {
    padding: theme.spacing.lg,
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
    marginLeft: theme.spacing.lg,
  },
  productName: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  scoreValue: {
    fontSize: 30,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  // Concerns
  concernsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  concernBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  concernIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  concernText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Sections
  section: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  alertIcon: {
    marginRight: 8,
  },

  // Alerts
  alertCard: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
  },
  alertHeader: {
    marginBottom: 4,
  },
  alertProfile: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.accent,
  },
  alertMessage: {
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 18,
  },

  // Ingredients
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ingredientScore: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientScoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
  ingredientInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  ingredientCategory: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  ingredientBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  ingredientBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  ingredientArrow: {
    fontSize: 20,
    color: theme.colors.textMuted,
  },

  showMoreButton: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  showMoreText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },

  // Alternatives Button
  alternativesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  alternativesIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  alternativesText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Raw Text
  rawTextCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  rawText: {
    fontSize: 12,
    fontFamily: 'Courier',
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },

  // Supplement Info
  supplementCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  supplementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  supplementLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  supplementValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
  },
  supplementNotesRow: {
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 4,
  },
  supplementNotes: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginTop: 4,
  },

  // DV Percentages
  dvSection: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dvSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  dvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dvNameCol: {
    flex: 1,
  },
  dvNutrient: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text,
  },
  dvAmount: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  dvValueCol: {
    width: 60,
    alignItems: 'flex-end',
    marginRight: theme.spacing.sm,
  },
  dvPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  dvPercentHigh: {
    color: theme.colors.warning,
  },
  dvAssessment: {
    flex: 1,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },

  // Interactions
  interactionsSection: {
    marginTop: theme.spacing.md,
  },
  interactionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  interactionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 4,
  },
  interactionHigh: {
    borderLeftColor: theme.colors.danger,
  },
  interactionModerate: {
    borderLeftColor: theme.colors.warning,
  },
  interactionPair: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  interactionNote: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  severityHigh: {
    backgroundColor: '#FEE2E2',
  },
  severityModerate: {
    backgroundColor: '#FEF3C7',
  },
  severityLow: {
    backgroundColor: '#DCFCE7',
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text,
  },

  // Megadose Warnings
  warningsSection: {
    marginTop: theme.spacing.md,
  },
  warningsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.danger,
    marginBottom: theme.spacing.sm,
  },
  warningCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.danger,
  },
  warningText: {
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 18,
  },
});