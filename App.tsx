import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Firebase
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Screens - Auth
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

// Screens - App
import QuestionsScreen from './src/screens/QuestionsScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import EvolutionScreen from './src/screens/EvolutionScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// ────────────────────────────────────────────────────────────
// TELA DE LOADING
// ────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#7B2CBF', '#5A67D8', '#3B82F6', '#06B6D4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#FFFFFF" />
      </LinearGradient>
    </View>
  );
}

// ────────────────────────────────────────────────────────────
// NAVEGAÇÃO BASEADA EM ESTADO DE AUTH
// ────────────────────────────────────────────────────────────

function RootNavigator() {
  const { isLoading, isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
      NavigationBar.setBackgroundColorAsync('#00000000');
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A1828' },
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          // ── Stack de Auth (não logado) ────────────────────
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ animation: 'fade' }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        ) : !user ? (
          // ── Stack de Onboarding (logado, sem perfil) ─────
          <>
            <Stack.Screen
              name="Questions"
              component={QuestionsScreen}
              options={{ animation: 'fade' }}
            />
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ animation: 'fade' }}
            />
          </>
        ) : (
          // ── Stack Principal (logado, com perfil) ─────────
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ animation: 'fade' }}
            />
            <Stack.Screen
              name="Camera"
              component={CameraScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="Analysis"
              component={AnalysisScreen}
              options={{ animation: 'fade' }}
            />
            <Stack.Screen
              name="Results"
              component={ResultsScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="Evolution"
              component={EvolutionScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ────────────────────────────────────────────────────────────
// APP ROOT
// ────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
