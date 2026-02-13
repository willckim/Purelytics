/**
 * Purelytics - The Universal Ingredient Decoder
 * Main App Component for Expo
 *
 * Navigation architecture:
 * - Single NavigationContainer (avoids PlatformConstants errors)
 * - Auth state drives which screens are mounted via conditional screen lists
 * - While authLoading, show a splash/loading screen
 * - Once resolved, show either Auth flow or Main tabs
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar, StyleSheet, View, Text, ActivityIndicator } from 'react-native';

// Context
import { SettingsProvider, useSettings } from './src/context/SettingsContext';

// Screens
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import IngredientDetailScreen from './src/screens/IngredientDetailScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfilesScreen from './src/screens/ProfilesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AlternativesScreen from './src/screens/AlternativesScreen';
import ReviewScanScreen from './src/screens/ReviewScanScreen';

// Theme
import { theme } from './src/theme';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const HomeStackNav = createNativeStackNavigator();
const ScanStackNav = createNativeStackNavigator();

// Tab Icons Component
const TabIcon = ({ icon, focused }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
    <Text style={styles.tabIcon}>{icon}</Text>
  </View>
);

// Home Stack Navigator
function HomeStack() {
  return (
    <HomeStackNav.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <HomeStackNav.Screen name="HomeMain" component={HomeScreen} />
      <HomeStackNav.Screen
        name="ReviewScan"
        component={ReviewScanScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <HomeStackNav.Screen
        name="Results"
        component={ResultsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <HomeStackNav.Screen
        name="IngredientDetail"
        component={IngredientDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <HomeStackNav.Screen
        name="Alternatives"
        component={AlternativesScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </HomeStackNav.Navigator>
  );
}

// Scan Stack Navigator
function ScanStack() {
  return (
    <ScanStackNav.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000' },
      }}
    >
      <ScanStackNav.Screen name="ScanMain" component={ScanScreen} />
      <ScanStackNav.Screen
        name="ReviewScan"
        component={ReviewScanScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <ScanStackNav.Screen
        name="Results"
        component={ResultsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <ScanStackNav.Screen
        name="IngredientDetail"
        component={IngredientDetailScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <ScanStackNav.Screen
        name="Alternatives"
        component={AlternativesScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </ScanStackNav.Navigator>
  );
}

// Main Tab Navigator (authenticated)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanStack}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📷" focused={focused} />,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📋" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profiles"
        component={ProfilesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👨‍👩‍👧" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Loading screen shown during initial auth check
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingLogo}>Purelytics</Text>
      <ActivityIndicator
        color={theme.colors.primary}
        size="large"
        style={{ marginTop: 24 }}
      />
    </View>
  );
}

/**
 * RootNavigator — conditionally renders Auth or Main screens.
 *
 * IMPORTANT: We use a single NavigationContainer and swap screen definitions
 * inside it rather than conditionally rendering separate NavigationContainers.
 * This prevents the PlatformConstants re-render crash.
 */
function RootNavigator() {
  const { isAuthenticated, authLoading } = useSettings();

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={MainTabs} />
      ) : (
        <RootStack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ animationTypeForReplace: 'pop' }}
        />
      )}
    </RootStack.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SettingsProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={theme.colors.background}
          />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingLogo: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: -0.5,
  },
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    height: 85,
    paddingTop: 8,
    paddingBottom: 25,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 32,
  },
  tabIconFocused: {
    transform: [{ scale: 1.15 }],
  },
  tabIcon: {
    fontSize: 24,
  },
});
