/**
 * Navigation Configuration
 * Main app navigation structure using React Navigation
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { theme } from '../theme';

// Import Screens
import {
  HomeScreen,
  ScanScreen,
  ResultsScreen,
  IngredientDetailScreen,
  HistoryScreen,
  ProfilesScreen,
  AlternativesScreen,
} from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Icon Component
const TabIcon = ({ icon, focused }) => (
  <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
    <Text style={styles.tabIcon}>{icon}</Text>
  </View>
);

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="IngredientDetail" component={IngredientDetailScreen} />
      <Stack.Screen 
        name="Alternatives" 
        component={AlternativesScreen}
        options={{ 
          animation: 'slide_from_bottom',
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
}

// Scan Stack Navigator
function ScanStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ScanMain" component={ScanScreen} />
      <Stack.Screen 
        name="Results" 
        component={ResultsScreen}
        options={{ contentStyle: { backgroundColor: theme.colors.background } }}
      />
      <Stack.Screen 
        name="IngredientDetail" 
        component={IngredientDetailScreen}
        options={{ contentStyle: { backgroundColor: theme.colors.background } }}
      />
      <Stack.Screen 
        name="Alternatives" 
        component={AlternativesScreen}
        options={{ 
          animation: 'slide_from_bottom',
          presentation: 'modal',
          contentStyle: { backgroundColor: theme.colors.background }
        }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
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
          tabBarIcon: ({ focused }) => <TabIcon icon="👨‍👩‍👧" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Root Navigator
export default function RootNavigator() {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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