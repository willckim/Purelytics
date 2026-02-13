# Purelytics

**Scan ingredient labels. Understand what's inside. Find healthier alternatives.**

Purelytics is a React Native mobile app that uses AI vision APIs to analyze product ingredient labels and provide health scores, plain-English explanations, and category-aware alternative suggestions.

---

## Features

- **AI-Powered Label Scanning** - Point your camera at any ingredient label for instant analysis using OpenAI GPT-4o, Google Gemini, or Anthropic Claude
- **Health Scores (0-100)** - Color-coded scoring for each ingredient and the overall product
- **Strict Category Anchor** - AI identifies the product category (Beverage, Dairy, Snack, Meat, Supplement, etc.) and locks all analysis and alternatives to that category
- **Smart Swaps** - Category-locked healthier alternatives with pricing and store availability
- **Supplement Analysis** - Specialized scoring for supplements including bioavailability, DV percentages, ingredient interactions, and megadose warnings
- **Web Search Verification** - Optional Brave Search integration to verify product identity before analysis
- **Review Screen** - Confirm or edit AI-detected product name, brand, and category before viewing results
- **Household Profiles** - Create profiles for family members with health-specific filters
- **Scan History** - Browse and revisit previous scans
- **Local Auth** - Login/signup with on-device storage (no backend required)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Navigation | React Navigation 6 (Native Stack + Bottom Tabs) |
| State | React Context + AsyncStorage |
| Auth Storage | expo-secure-store |
| AI Vision | OpenAI GPT-4o, Google Gemini 2.0 Flash, Anthropic Claude Sonnet 4 |
| Web Search | Brave Search API (optional) |
| Camera | expo-camera |

## Getting Started

### Prerequisites

- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`)
- At least one AI API key (Gemini is free)

### Installation

```bash
git clone https://github.com/yourusername/purelytics.git
cd purelytics

npm install --legacy-peer-deps
```

### API Keys Setup

Create `src/config/apiKeys.js` (this file is gitignored):

```javascript
export const API_KEYS = {
  // Google Gemini (FREE) - https://aistudio.google.com/apikey
  gemini: '',

  // OpenAI GPT-4 Vision - https://platform.openai.com/api-keys
  openai: '',

  // Anthropic Claude - https://console.anthropic.com
  anthropic: '',

  // Brave Search (optional) - https://brave.com/search/api/
  brave: '',
};
```

You only need **one** AI key to start scanning. Gemini is recommended since it's free.

### Running

```bash
npx expo start --tunnel --clear
```

Scan the QR code with Expo Go on your phone, or press `a` for Android emulator / `i` for iOS simulator.

## Project Structure

```
purelytics/
├── App.js                          # Root - auth-gated navigation
├── index.js                        # Entry point
├── src/
│   ├── config/
│   │   └── apiKeys.js              # API keys (gitignored)
│   ├── context/
│   │   └── SettingsContext.js       # Global state + auth
│   ├── data/
│   │   └── ingredientDatabase.js   # Local ingredient reference data
│   ├── screens/
│   │   ├── AuthScreen.js           # Login / Signup
│   │   ├── HomeScreen.js           # Dashboard
│   │   ├── ScanScreen.js           # Camera + AI analysis
│   │   ├── ReviewScanScreen.js     # Confirm detected product info
│   │   ├── ResultsScreen.js        # Score + ingredient breakdown
│   │   ├── IngredientDetailScreen.js
│   │   ├── AlternativesScreen.js   # Category-locked smart swaps
│   │   ├── HistoryScreen.js        # Past scans
│   │   ├── ProfilesScreen.js       # Family health profiles
│   │   └── SettingsScreen.js       # App settings + logout
│   ├── services/
│   │   ├── aiService.js            # Multi-provider AI + Brave Search
│   │   └── storageService.js       # SecureStore + AsyncStorage
│   └── theme/
│       └── index.js                # Design system + score utilities
├── package.json
└── babel.config.js
```

## Navigation Flow

```
AuthScreen (login/signup)
    │
    ▼
MainTabs
├── Home ─── Results ─── IngredientDetail
│                    └── Alternatives
├── Scan ─── ReviewScan ─── Results ─── IngredientDetail
│                                   └── Alternatives
├── History
├── Profiles
└── Settings
```

## AI Analysis Pipeline

1. Camera captures label image (base64)
2. Image sent to preferred AI provider (Claude > Gemini > OpenAI fallback)
3. AI identifies product category from 12 options (Strict Category Anchor)
4. If **Supplement** detected, a second pass runs with specialized DV%/interaction prompts
5. User reviews detected product name, brand, category on ReviewScanScreen
6. If Brave Search is configured, product is verified against web results in background
7. Results displayed with ingredient scores, concerns, and supplement-specific analysis
8. Smart Swaps shows alternatives strictly within the same category

## Product Categories

Beverage, Dairy, Snack, Meat, Grain, Condiment, Supplement, Baby Food, Frozen, Bakery, Candy, Other

## Score Ranges

| Score | Rating | Color |
|-------|--------|-------|
| 80-100 | Excellent | Green |
| 60-79 | Good | Lime |
| 40-59 | Fair | Yellow |
| 20-39 | Poor | Orange |
| 0-19 | Avoid | Red |

## License

MIT
