/**
 * IngredientDetailScreen - Detailed view of a single ingredient
 * Shows plain English explanation, health notes, hidden names, etc.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, getScoreColor, getScoreLabel, getConcernBadge } from '../theme';
import ScoreRing from '../components/ScoreRing';
import ingredientDatabase from '../data/ingredientDatabase';

export default function IngredientDetailScreen({ route, navigation }) {
  const { ingredient } = route.params || {};
  
  // Get full ingredient data from database
  const ingredientData = ingredientDatabase[ingredient?.id] || ingredient || {
    name: 'Unknown Ingredient',
    score: 50,
    concern: 'moderate',
    category: 'Unknown',
    plainEnglish: 'No information available for this ingredient.',
    healthNotes: 'Please consult additional resources for more information.',
    hiddenNames: [],
    foundIn: [],
  };

  const badge = getConcernBadge(ingredientData.concern);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: getScoreColor(ingredientData.score) + '10' }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <ScoreRing score={ingredientData.score} size={80} strokeWidth={6} />
            <View style={styles.headerInfo}>
              <Text style={styles.ingredientName}>{ingredientData.name}</Text>
              <View style={styles.headerMeta}>
                <Text style={styles.category}>{ingredientData.category}</Text>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.color }]}>
                    {badge.label}
                  </Text>
                </View>
              </View>
              {ingredientData.eNumber && (
                <Text style={styles.eNumber}>E-Number: {ingredientData.eNumber}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Plain English Section */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>IN PLAIN ENGLISH</Text>
            <Text style={styles.cardText}>{ingredientData.plainEnglish}</Text>
          </View>
        </View>

        {/* Health Notes Section */}
        <View style={styles.section}>
          <View style={[
            styles.card,
            ingredientData.concern === 'high' && styles.cardDanger
          ]}>
            <Text style={[
              styles.cardLabel,
              ingredientData.concern === 'high' && styles.cardLabelDanger
            ]}>
              {ingredientData.concern === 'high' ? '⚠️ ' : ''}HEALTH NOTES
            </Text>
            <Text style={styles.cardText}>{ingredientData.healthNotes}</Text>
            
            {ingredientData.dailyLimit && (
              <View style={styles.limitBox}>
                <Text style={styles.limitLabel}>Recommended limit:</Text>
                <Text style={styles.limitValue}>{ingredientData.dailyLimit}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Hidden Names Section */}
        {ingredientData.hiddenNames && ingredientData.hiddenNames.length > 0 && (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>🔍 ALSO KNOWN AS</Text>
              <View style={styles.tagContainer}>
                {ingredientData.hiddenNames.map((name, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Found In Section */}
        {ingredientData.foundIn && ingredientData.foundIn.length > 0 && (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>COMMONLY FOUND IN</Text>
              <View style={styles.tagContainer}>
                {ingredientData.foundIn.map((item, index) => (
                  <View key={index} style={styles.tagLight}>
                    <Text style={styles.tagLightText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Alternatives Section */}
        {ingredientData.alternatives && ingredientData.alternatives.length > 0 && (
          <View style={styles.section}>
            <View style={[styles.card, styles.cardSuccess]}>
              <Text style={[styles.cardLabel, styles.cardLabelSuccess]}>
                ✓ SAFER ALTERNATIVES
              </Text>
              <View style={styles.tagContainer}>
                {ingredientData.alternatives.map((alt, index) => (
                  <View key={index} style={styles.tagSuccess}>
                    <Text style={styles.tagSuccessText}>{alt}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Alert Badges */}
        {(ingredientData.kidAlert || ingredientData.heartHealthAlert || ingredientData.diabeticAlert) && (
          <View style={styles.section}>
            <View style={styles.alertsContainer}>
              {ingredientData.kidAlert && (
                <View style={styles.alertBadge}>
                  <Text style={styles.alertEmoji}>👶</Text>
                  <Text style={styles.alertText}>Caution for children</Text>
                </View>
              )}
              {ingredientData.heartHealthAlert && (
                <View style={styles.alertBadge}>
                  <Text style={styles.alertEmoji}>❤️</Text>
                  <Text style={styles.alertText}>Heart health concern</Text>
                </View>
              )}
              {ingredientData.diabeticAlert && (
                <View style={styles.alertBadge}>
                  <Text style={styles.alertEmoji}>🩺</Text>
                  <Text style={styles.alertText}>Watch for diabetics</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Sources */}
        {ingredientData.sources && ingredientData.sources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sourcesTitle}>Sources</Text>
            {ingredientData.sources.map((source, index) => (
              <Text key={index} style={styles.sourceText}>• {source}</Text>
            ))}
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
    marginBottom: theme.spacing.lg,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  ingredientName: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  category: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  eNumber: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
    fontFamily: 'Courier',
  },

  // Sections
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },

  // Cards
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardDanger: {
    backgroundColor: theme.colors.danger + '10',
    borderColor: theme.colors.danger + '30',
  },
  cardSuccess: {
    backgroundColor: theme.colors.scoreExcellent + '10',
    borderColor: theme.colors.scoreExcellent + '30',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  cardLabelDanger: {
    color: theme.colors.danger,
  },
  cardLabelSuccess: {
    color: theme.colors.scoreExcellent,
  },
  cardText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },

  // Limit Box
  limitBox: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: theme.borderRadius.sm,
  },
  limitLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  limitValue: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 2,
  },

  // Tags
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  tagText: {
    fontSize: 13,
    color: theme.colors.text,
    fontFamily: 'Courier',
  },
  tagLight: {
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  tagLightText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  tagSuccess: {
    backgroundColor: theme.colors.scoreExcellent + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  tagSuccessText: {
    fontSize: 13,
    color: theme.colors.scoreExcellent,
    fontWeight: '500',
  },

  // Alerts
  alertsContainer: {
    gap: 8,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning + '15',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.warning + '30',
  },
  alertEmoji: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  alertText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },

  // Sources
  sourcesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  sourceText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    lineHeight: 18,
    marginBottom: 4,
  },
});