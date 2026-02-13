/**
 * AlternativesScreen - Smart Swaps feature
 * Shows healthier product alternatives strictly within the same category.
 * Beverages only get Beverage alternatives, Supplements only get Supplement alternatives, etc.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, getScoreColor } from '../theme';
import { getAlternativesForCategory } from '../services/aiService';

// Filter options
const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'budget', label: 'Budget' },
  { id: 'best', label: 'Best Score' },
  { id: 'nearby', label: 'Near Me' },
];

// Alternative Card Component
const AlternativeCard = ({ item, originalScore, onPress }) => {
  const scoreColor = getScoreColor(item.score);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.scoreBox, { backgroundColor: scoreColor + '20' }]}>
          <Text style={[styles.scoreText, { color: scoreColor }]}>{item.score}</Text>
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.productName}>{item.name}</Text>
            {item.budgetPick && (
              <View style={styles.budgetBadge}>
                <Text style={styles.budgetBadgeText}>Budget Pick</Text>
              </View>
            )}
          </View>
          <Text style={styles.brandName}>{item.brand} {item.price}</Text>
          <View style={styles.improvementRow}>
            <Text style={styles.improvementText}>
              +{item.improvement} points better
            </Text>
          </View>
        </View>
      </View>

      {/* Highlights */}
      <View style={styles.highlightsContainer}>
        {item.highlights.map((highlight, index) => (
          <View key={index} style={styles.highlightTag}>
            <Text style={styles.highlightText}>{highlight}</Text>
          </View>
        ))}
      </View>

      {/* Stores */}
      <View style={styles.storesContainer}>
        <Text style={styles.storesLabel}>Available at:</Text>
        <Text style={styles.storesList}>{item.stores.join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function AlternativesScreen({ route, navigation }) {
  const { product } = route.params || {};
  const [activeFilter, setActiveFilter] = useState('all');

  const originalScore = product?.overallScore || 28;
  const productName = product?.name || 'Product';
  const productCategory = product?.category || 'Other';

  // Get category-aware alternatives
  const categoryAlternatives = useMemo(() => {
    return getAlternativesForCategory(productCategory, originalScore);
  }, [productCategory, originalScore]);

  // Filter alternatives based on selection
  const filteredAlternatives = useMemo(() => {
    let filtered = [...categoryAlternatives];

    if (activeFilter === 'budget') {
      filtered = filtered.filter(item => item.budgetPick || item.priceLevel === 'budget');
    } else if (activeFilter === 'best') {
      filtered = filtered.filter(item => item.score >= 70);
      filtered.sort((a, b) => b.score - a.score);
    }

    return filtered;
  }, [categoryAlternatives, activeFilter]);

  // Find best score among alternatives
  const bestScore = categoryAlternatives.length > 0
    ? Math.max(...categoryAlternatives.map(a => a.score))
    : originalScore;

  const handleClose = () => {
    navigation.goBack();
  };

  const handleAlternativePress = (item) => {
    console.log('Alternative pressed:', item.name);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Smart Swaps</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          Healthier {productCategory} alternatives for {productName}
        </Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            Category: {productCategory}
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_OPTIONS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text style={[
                styles.filterButtonText,
                activeFilter === filter.id && styles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Comparison Bar */}
      <View style={styles.comparisonBar}>
        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonLabel}>Original</Text>
          <View style={[styles.comparisonScore, { backgroundColor: getScoreColor(originalScore) + '20' }]}>
            <Text style={[styles.comparisonScoreText, { color: getScoreColor(originalScore) }]}>
              {originalScore}
            </Text>
          </View>
        </View>
        <View style={styles.comparisonArrow}>
          <Text style={styles.comparisonArrowText}>-></Text>
        </View>
        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonLabel}>Best Option</Text>
          <View style={[styles.comparisonScore, { backgroundColor: getScoreColor(bestScore) + '20' }]}>
            <Text style={[styles.comparisonScoreText, { color: getScoreColor(bestScore) }]}>
              {bestScore}
            </Text>
          </View>
        </View>
      </View>

      {/* Alternatives List */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredAlternatives.map((item) => (
          <AlternativeCard
            key={item.id}
            item={item}
            originalScore={originalScore}
            onPress={() => handleAlternativePress(item)}
          />
        ))}

        {/* No Results Message */}
        {filteredAlternatives.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>
              {categoryAlternatives.length === 0 ? '!' : '?'}
            </Text>
            <Text style={styles.emptyText}>
              {categoryAlternatives.length === 0
                ? `This product already scores well! No significantly better ${productCategory} alternatives found.`
                : 'No alternatives found with this filter.'}
            </Text>
            {categoryAlternatives.length > 0 && (
              <TouchableOpacity onPress={() => setActiveFilter('all')}>
                <Text style={styles.emptyAction}>View all alternatives</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Prices and availability may vary by location. Alternatives are
            strictly within the "{productCategory}" category.
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

  // Header
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 16,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  // Filters
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterScroll: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceElevated,
    marginRight: theme.spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },

  // Comparison Bar
  comparisonBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceElevated,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  comparisonScore: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
  },
  comparisonScoreText: {
    fontSize: 20,
    fontWeight: '700',
  },
  comparisonArrow: {
    marginHorizontal: theme.spacing.xl,
  },
  comparisonArrowText: {
    fontSize: 20,
    color: theme.colors.highlight,
    fontWeight: '700',
  },

  // List
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },

  // Cards
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  scoreBox: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  budgetBadge: {
    backgroundColor: theme.colors.highlight + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  budgetBadgeText: {
    fontSize: 10,
    color: theme.colors.highlight,
    fontWeight: '600',
  },
  brandName: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  improvementRow: {
    marginTop: 4,
  },
  improvementText: {
    fontSize: 13,
    color: theme.colors.highlight,
    fontWeight: '500',
  },

  // Highlights
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  highlightTag: {
    backgroundColor: theme.colors.scoreExcellent + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  highlightText: {
    fontSize: 12,
    color: theme.colors.scoreExcellent,
    fontWeight: '500',
  },

  // Stores
  storesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storesLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginRight: 4,
  },
  storesList: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
    color: theme.colors.textMuted,
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  emptyAction: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: '500',
  },

  // Disclaimer
  disclaimer: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
  },
});
