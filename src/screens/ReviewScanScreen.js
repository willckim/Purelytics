/**
 * ReviewScanScreen - Confirmation screen between scan and results
 * Shows AI's detected product name, brand, and category.
 * User can confirm or edit before proceeding to full results.
 * Optionally runs Brave Search verification in the background.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, getScoreColor, getScoreLabel } from '../theme';
import {
  PRODUCT_CATEGORIES,
  verifyProductWithSearch,
  isBraveConfigured,
} from '../services/aiService';

export default function ReviewScanScreen({ route, navigation }) {
  const { product } = route.params || {};

  const [productName, setProductName] = useState(product?.name || 'Unknown Product');
  const [brand, setBrand] = useState(product?.brand || 'Unknown Brand');
  const [selectedCategory, setSelectedCategory] = useState(product?.category || 'Other');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Run Brave Search verification in background on mount
  useEffect(() => {
    if (isBraveConfigured() && product?.name) {
      setIsVerifying(true);
      verifyProductWithSearch(product.name, product.brand, product.category)
        .then(result => {
          setVerificationResult(result);
          setIsVerifying(false);
        })
        .catch(() => setIsVerifying(false));
    }
  }, []);

  const handleConfirm = () => {
    // Build the final product with user's edits
    const confirmedProduct = {
      ...product,
      name: productName,
      brand: brand,
      category: selectedCategory,
      userConfirmed: true,
      searchVerification: verificationResult,
    };

    navigation.replace('Results', { product: confirmedProduct });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const scoreColor = getScoreColor(product?.overallScore || 50);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Review Scan</Text>
          <Text style={styles.subtitle}>
            Confirm the detected product details before viewing results
          </Text>
        </View>

        {/* Quick Score Preview */}
        <View style={[styles.scorePreview, { backgroundColor: scoreColor + '15' }]}>
          <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '25' }]}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>
              {product?.overallScore || '?'}
            </Text>
            <Text style={[styles.scoreLabel, { color: scoreColor }]}>
              {getScoreLabel(product?.overallScore || 50)}
            </Text>
          </View>
          <Text style={styles.scoreHint}>
            {product?.ingredients?.length || 0} ingredients detected
          </Text>
        </View>

        {/* Product Name */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>Product Name</Text>
          <TextInput
            style={styles.textInput}
            value={productName}
            onChangeText={setProductName}
            placeholder="Product name"
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        {/* Brand */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>Brand</Text>
          <TextInput
            style={styles.textInput}
            value={brand}
            onChangeText={setBrand}
            placeholder="Brand name"
            placeholderTextColor={theme.colors.textMuted}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.fieldSection}>
          <Text style={styles.fieldLabel}>Category</Text>
          <Text style={styles.fieldHint}>
            This determines what alternatives are shown
          </Text>
          <View style={styles.categoryGrid}>
            {PRODUCT_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat && styles.categoryChipSelected,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextSelected,
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Web Search Verification */}
        {isBraveConfigured() && (
          <View style={styles.verificationSection}>
            <Text style={styles.fieldLabel}>Web Verification</Text>
            {isVerifying ? (
              <View style={styles.verifyingRow}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.verifyingText}>Searching for product info...</Text>
              </View>
            ) : verificationResult ? (
              <View style={[
                styles.verificationCard,
                verificationResult.verified
                  ? styles.verificationSuccess
                  : styles.verificationWarning,
              ]}>
                <Text style={styles.verificationIcon}>
                  {verificationResult.verified ? '✓' : '?'}
                </Text>
                <View style={styles.verificationInfo}>
                  <Text style={styles.verificationTitle}>
                    {verificationResult.verified
                      ? 'Product Found Online'
                      : 'Product Not Verified'}
                  </Text>
                  {verificationResult.topResult && (
                    <Text style={styles.verificationDesc} numberOfLines={2}>
                      {verificationResult.topResult.description}
                    </Text>
                  )}
                </View>
              </View>
            ) : (
              <Text style={styles.verificationSkipped}>
                No search results available
              </Text>
            )}
          </View>
        )}

        {/* Raw Text Preview */}
        {product?.rawText && (
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Detected Label Text</Text>
            <View style={styles.rawTextCard}>
              <Text style={styles.rawText} numberOfLines={5}>
                {product.rawText}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Confirm Button */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Confirm & View Results</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.replace('Results', { product })}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Skip Review</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
    paddingBottom: 140,
  },

  // Header
  header: {
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    marginBottom: theme.spacing.md,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  // Score Preview
  scorePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  scoreBadge: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  scoreHint: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },

  // Fields
  fieldSection: {
    marginBottom: theme.spacing.lg,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  fieldHint: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
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

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },

  // Verification
  verificationSection: {
    marginBottom: theme.spacing.lg,
  },
  verifyingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.md,
  },
  verifyingText: {
    marginLeft: theme.spacing.sm,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  verificationSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  verificationWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  verificationIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.highlight,
    marginRight: theme.spacing.sm,
    marginTop: 1,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  verificationDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
  verificationSkipped: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
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
    lineHeight: 17,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    padding: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    padding: theme.spacing.xs,
  },
  skipButtonText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
});
