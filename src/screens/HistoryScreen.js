/**
 * HistoryScreen - View all past product scans
 * Grouped by date with quick access to rescan or view details
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme, getScoreColor } from '../theme';
import { useSettings } from '../context/SettingsContext';

// Group scans into date sections
function groupByDate(scans) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups = { Today: [], Yesterday: [], 'This Week': [], Earlier: [] };

  scans.forEach((scan) => {
    const date = new Date(scan.scannedAt);
    if (date >= today) {
      groups.Today.push(scan);
    } else if (date >= yesterday) {
      groups.Yesterday.push(scan);
    } else if (date >= weekAgo) {
      groups['This Week'].push(scan);
    } else {
      groups.Earlier.push(scan);
    }
  });

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([title, data]) => ({ title, data }));
}

// Scan Item Component
const ScanItem = ({ item, onPress }) => {
  const scoreColor = getScoreColor(item.overallScore);

  return (
    <TouchableOpacity
      style={styles.scanItem}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.scoreBox, { backgroundColor: scoreColor + '20' }]}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>{item.overallScore}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemBrand}>{item.brand || ''}</Text>
      </View>
      <View style={styles.itemMeta}>
        <Text style={styles.itemTime}>
          {item.scannedAt ? new Date(item.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </Text>
        <Text style={styles.itemArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

// Section Header Component
const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

export default function HistoryScreen({ navigation }) {
  const { scanHistory, clearHistory } = useSettings();

  const handleScanPress = (item) => {
    navigation.navigate('Home', {
      screen: 'Results',
      params: { product: item },
    });
  };

  const handleClearHistory = () => {
    clearHistory();
  };

  const sections = groupByDate(scanHistory);
  const totalScans = scanHistory.length;
  const goodChoices = scanHistory.filter((s) => s.overallScore >= 60).length;
  const avoided = scanHistory.filter((s) => s.overallScore < 30).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        {totalScans > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalScans}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.colors.scoreExcellent }]}>{goodChoices}</Text>
          <Text style={styles.statLabel}>Good Choices</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.colors.scoreBad }]}>{avoided}</Text>
          <Text style={styles.statLabel}>Avoided</Text>
        </View>
      </View>

      {/* Empty State or History List */}
      {sections.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📋</Text>
          <Text style={styles.emptyStateTitle}>No scan history</Text>
          <Text style={styles.emptyStateText}>
            Products you scan will appear here so you can easily find them again
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => navigation.navigate('Scan')}
          >
            <Text style={styles.emptyStateButtonText}>Scan Your First Product</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={({ item }) => (
            <ScanItem item={item} onPress={handleScanPress} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader title={title} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },
  clearButton: {
    fontSize: 14,
    color: theme.colors.danger,
    fontWeight: '500',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 4,
  },

  // List
  listContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Scan Item
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scoreBox: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  itemBrand: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  itemMeta: {
    alignItems: 'flex-end',
  },
  itemTime: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 4,
  },
  itemArrow: {
    fontSize: 18,
    color: theme.colors.textMuted,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: 15,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
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
