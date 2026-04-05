import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import CalculatorScreen from './src/screens/calculator/CalculatorScreen';
import TheoryScreen from './src/screens/learn/TheoryScreen';
import TutorScreen from './src/screens/exercises/TutorScreen';
import { theme } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
          height: Platform.OS === 'ios' ? 90 : 75,
          position: 'absolute', // Glassmorphism effect
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.3,
          shadowRadius: 15,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.muted,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Calculadora') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'Teoría') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Aprender') {
            iconName = focused ? 'school' : 'school-outline';
          }
          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: -5,
        },
      })}
    >
      <Tab.Screen name="Calculadora" component={CalculatorScreen} />
      <Tab.Screen name="Teoría" component={TheoryScreen} />
      <Tab.Screen name="Aprender" component={TutorScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer theme={{
        dark: true,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text.primary,
          border: theme.colors.border,
          notification: theme.colors.secondary,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        }
      }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
