/**
 * ScanScreen - Camera interface for scanning product labels
 * Uses AI Vision APIs (OpenAI, Gemini, Claude) for ingredient analysis
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { analyzeWithPreferred, isAIConfigured, getConfiguredProviders } from '../services/aiService';
import { ingredientDatabase } from '../data/ingredientDatabase';
import { useSettings } from '../context/SettingsContext';

const { width } = Dimensions.get('window');
const SCAN_FRAME_WIDTH = width * 0.85;
const SCAN_FRAME_HEIGHT = 200;

// Scan modes
const SCAN_MODES = [
  { id: 'food', label: 'Food', icon: '🍎' },
  { id: 'beauty', label: 'Beauty', icon: '💄' },
  { id: 'home', label: 'Home', icon: '🏠' },
];

// Helper to get ingredient from database (for demo)
const getIngredientData = (id) => {
  const dbIngredient = ingredientDatabase[id];
  if (dbIngredient) {
    return {
      id: dbIngredient.id,
      name: dbIngredient.name,
      score: dbIngredient.score,
      category: dbIngredient.category,
      concern: dbIngredient.concern,
    };
  }
  return { id, name: id, score: 50, category: 'Unknown', concern: 'moderate' };
};

// Demo scan result for when API keys aren't configured
const demoScanResult = {
  id: 'demo-product',
  name: 'Classic Hot Dogs',
  brand: 'Oscar Mayer',
  category: 'Processed Meat',
  overallScore: 28,
  rawText: `MECHANICALLY SEPARATED CHICKEN, WATER, CORN SYRUP, SALT, POTASSIUM LACTATE, SODIUM PHOSPHATE, SODIUM DIACETATE, SODIUM ASCORBATE, SODIUM NITRITE, FLAVORING.`,
  ingredients: [
    getIngredientData('sodium-nitrite'),
    getIngredientData('high-fructose-corn-syrup'),
    getIngredientData('sodium-benzoate'),
    getIngredientData('bha'),
    getIngredientData('red-40'),
    getIngredientData('citric-acid'),
  ],
  concerns: {
    sugar: { count: 2, names: ['Corn Syrup', 'Corn Syrup Solids'] },
    preservatives: { count: 3, names: ['Sodium Nitrite', 'Sodium Benzoate', 'BHA'] },
    artificial: { count: 2, names: ['Red 40', 'Yellow 5'] },
  },
  profileAlerts: [
    { profile: '👧 Kids', message: 'Contains nitrites and artificial dyes linked to hyperactivity' },
    { profile: '❤️ Heart Health', message: 'High sodium content (480mg per serving)' },
  ],
};

// Corner Marker Component
const CornerMarker = ({ position }) => {
  const getCornerStyle = () => {
    const base = {
      position: 'absolute',
      width: 24,
      height: 24,
      borderColor: theme.colors.highlight,
    };

    switch (position) {
      case 'top-left':
        return { ...base, top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 };
      case 'top-right':
        return { ...base, top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 };
      case 'bottom-left':
        return { ...base, bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 };
      case 'bottom-right':
        return { ...base, bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 };
      default:
        return base;
    }
  };

  return <View style={getCornerStyle()} />;
};

export default function ScanScreen({ navigation }) {
  const { settings, addScan } = useSettings();
  const [scanMode, setScanMode] = useState('food');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  // Handle permission request
  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (!result.granted && !result.canAskAgain) {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access in your device settings to scan ingredient labels.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  // Real scan with AI
  const handleScan = useCallback(async () => {
    if (isScanning || !cameraRef.current) return;

    // Check if AI is configured
    if (!isAIConfigured()) {
      Alert.alert(
        '🔑 API Keys Required',
        'To enable real scanning, add your API key to:\n\nsrc/config/apiKeys.js\n\nSupported: OpenAI, Gemini, or Claude',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'View Demo Instead', 
            onPress: () => navigation.navigate('Results', { product: demoScanResult })
          },
        ]
      );
      return;
    }

    setIsScanning(true);
    setScanStatus('Capturing image...');

    try {
      // Take photo
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo.base64) {
        throw new Error('Failed to capture image');
      }

      // Get user's preferred AI provider from context
      const preferredProvider = settings.aiProvider || 'auto';
      
      // Analyze with AI (uses preferred provider if configured)
      setScanStatus('Analyzing ingredients...');
      
      const aiResult = await analyzeWithPreferred(photo.base64, preferredProvider);
      
      // Format result for Results screen
      const product = {
        id: `scan-${Date.now()}`,
        name: aiResult.productName || 'Scanned Product',
        brand: aiResult.brand || 'Unknown Brand',
        category: aiResult.productCategory || 'Other',
        overallScore: aiResult.overallScore || 50,
        rawText: aiResult.rawText || '',
        ingredients: aiResult.ingredients || [],
        concerns: aiResult.concerns || { sugar: { count: 0, names: [] }, preservatives: { count: 0, names: [] }, artificial: { count: 0, names: [] }},
        profileAlerts: [],
        supplementInfo: aiResult.supplementInfo || null,
        scannedAt: new Date().toISOString(),
        aiProvider: aiResult.provider,
      };
      
      // Save to history and navigate to review screen
      addScan(product);
      setIsScanning(false);
      setScanStatus('');
      navigation.navigate('ReviewScan', { product });

    } catch (error) {
      console.error('Scan error:', error);
      setIsScanning(false);
      setScanStatus('');
      
      Alert.alert(
        'Scan Failed',
        error.message || 'Unable to analyze the image. Please try again.',
        [
          { text: 'Try Again', style: 'cancel' },
          { 
            text: 'View Demo', 
            onPress: () => navigation.navigate('Results', { product: demoScanResult })
          },
        ]
      );
    }
  }, [isScanning, navigation]);

  // Render camera permission request
  const renderPermissionRequest = () => (
    <View style={styles.permissionContainer}>
      <Text style={styles.permissionIcon}>📷</Text>
      <Text style={styles.permissionTitle}>Camera Access Needed</Text>
      <Text style={styles.permissionText}>
        To scan ingredient labels, we need access to your camera
      </Text>
      <TouchableOpacity
        style={styles.permissionButton}
        onPress={handleRequestPermission}
      >
        <Text style={styles.permissionButtonText}>Enable Camera</Text>
      </TouchableOpacity>
    </View>
  );

  // Render camera view
  const renderCamera = () => (
    <CameraView
      ref={cameraRef}
      style={StyleSheet.absoluteFill}
      facing="back"
    />
  );

  // Get AI status message
  const getStatusMessage = () => {
    if (!permission?.granted) {
      return 'Enable camera to start scanning';
    }
    if (isScanning) {
      return scanStatus || 'Analyzing...';
    }
    if (isAIConfigured()) {
      const providers = getConfiguredProviders();
      return `Ready • Using ${providers[0].charAt(0).toUpperCase() + providers[0].slice(1)}`;
    }
    return 'Position ingredient list in frame';
  };

  return (
    <View style={styles.container}>
      {/* Camera or Permission Request */}
      <View style={styles.cameraContainer}>
        {permission?.granted ? renderCamera() : <View style={styles.cameraPlaceholder} />}

        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Back Button */}
          <SafeAreaView edges={['top']}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </SafeAreaView>

          {/* Mode Toggle */}
          <View style={styles.modeToggle}>
            {SCAN_MODES.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeButton,
                  scanMode === mode.id && styles.modeButtonActive,
                ]}
                onPress={() => setScanMode(mode.id)}
              >
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                <Text style={[
                  styles.modeLabel,
                  scanMode === mode.id && styles.modeLabelActive,
                ]}>
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* AI Status Badge */}
          {permission?.granted && (
            <View style={styles.aiStatusContainer}>
              <View style={[
                styles.aiStatusBadge,
                isAIConfigured() ? styles.aiStatusActive : styles.aiStatusInactive
              ]}>
                <Text style={styles.aiStatusText}>
                  {isAIConfigured() ? `🤖 AI: ${getConfiguredProviders().join(', ')}` : '⚠️ No API Key'}
                </Text>
              </View>
            </View>
          )}

          {/* Scan Frame or Permission Request */}
          <View style={styles.scanFrameContainer}>
            {!permission?.granted ? (
              renderPermissionRequest()
            ) : (
              <View style={[styles.scanFrame, isScanning && styles.scanFrameActive]}>
                <CornerMarker position="top-left" />
                <CornerMarker position="top-right" />
                <CornerMarker position="bottom-left" />
                <CornerMarker position="bottom-right" />
                {isScanning && (
                  <View style={styles.scanningOverlay}>
                    <ActivityIndicator color={theme.colors.highlight} size="large" />
                    <Text style={styles.scanningText}>{scanStatus}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>{getStatusMessage()}</Text>
          </View>

          {/* Scan Button */}
          <SafeAreaView edges={['bottom']} style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.scanButton,
                isScanning && styles.scanButtonScanning,
                !permission?.granted && styles.scanButtonDisabled,
              ]}
              onPress={handleScan}
              disabled={isScanning || !permission?.granted}
              activeOpacity={0.8}
            >
              {isScanning ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.scanButtonIcon}>📷</Text>
              )}
            </TouchableOpacity>
            
            {/* Hint */}
            {permission?.granted && !isScanning && (
              <Text style={styles.demoHint}>
                {isAIConfigured() ? 'Tap to scan' : 'Tap for demo'}
              </Text>
            )}
          </SafeAreaView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  modeToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    marginHorizontal: 4,
  },
  modeButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  modeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  modeLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '400',
  },
  modeLabelActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // AI Status
  aiStatusContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  aiStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  aiStatusActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
  },
  aiStatusInactive: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
  },
  aiStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  
  scanFrameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: SCAN_FRAME_WIDTH,
    height: SCAN_FRAME_HEIGHT,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'transparent',
  },
  scanFrameActive: {
    borderColor: theme.colors.highlight,
  },
  scanningOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: theme.borderRadius.lg - 2,
  },
  scanningText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 14,
  },
  
  // Permission UI
  permissionContainer: {
    backgroundColor: 'rgba(30,30,50,0.95)',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    maxWidth: 320,
  },
  permissionIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  permissionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  permissionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  instructions: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  instructionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
  },
  scanButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scanButtonScanning: {
    backgroundColor: theme.colors.highlight,
    borderColor: theme.colors.highlight,
  },
  scanButtonDisabled: {
    opacity: 0.5,
  },
  scanButtonIcon: {
    fontSize: 28,
  },
  demoHint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: theme.spacing.sm,
  },
});