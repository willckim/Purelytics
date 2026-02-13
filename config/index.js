/**
 * Purelytics App Configuration
 * Environment-specific settings and constants
 */

const config = {
  // App Info
  app: {
    name: 'Purelytics',
    displayName: 'Purelytics',
    version: '1.0.0',
    buildNumber: 1,
    bundleId: {
      ios: 'com.purelytics.app',
      android: 'com.purelytics.app',
    },
  },

  // API Endpoints
  api: {
    baseUrl: __DEV__ 
      ? 'https://api-dev.purelytics.com' 
      : 'https://api.purelytics.com',
    timeout: 30000,
    version: 'v1',
  },

  // Firebase Configuration
  firebase: {
    // These should be loaded from environment variables in production
    apiKey: process.env.FIREBASE_API_KEY || 'your-api-key',
    authDomain: 'purelytics.firebaseapp.com',
    projectId: 'purelytics',
    storageBucket: 'purelytics.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc123',
  },

  // OCR Configuration
  ocr: {
    provider: 'google-vision', // 'google-vision' | 'apple-vision'
    confidenceThreshold: 0.8,
    maxImageSize: 4096,
    supportedFormats: ['jpg', 'jpeg', 'png', 'heic'],
  },

  // AI Configuration
  ai: {
    provider: 'gemini', // 'gemini' | 'openai'
    model: 'gemini-1.5-flash',
    maxTokens: 1000,
    temperature: 0.3,
  },

  // Feature Flags
  features: {
    beautyMode: true,
    homeMode: true,
    barcodeScanning: false, // Coming soon
    offlineMode: false, // Coming soon
    socialSharing: true,
    pushNotifications: true,
  },

  // Scoring Configuration
  scoring: {
    weights: {
      regulatory: 0.30,
      scientific: 0.40,
      healthOrg: 0.20,
      processing: 0.10,
    },
    thresholds: {
      excellent: 80,
      good: 60,
      fair: 40,
      poor: 20,
    },
  },

  // Cache Configuration
  cache: {
    ingredientTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
    scanHistoryLimit: 500,
    maxStorageSize: 50 * 1024 * 1024, // 50MB
  },

  // Analytics
  analytics: {
    enabled: !__DEV__,
    debugMode: __DEV__,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  },

  // Rate Limiting
  rateLimit: {
    scansPerHour: 100,
    alternativesPerDay: 50,
  },
};

export default config;