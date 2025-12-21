import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

// Screens
import QuestionsScreen from './src/screens/QuestionsScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import EvolutionScreen from './src/screens/EvolutionScreen';
import ProfileScreen from './src/screens/ProfileScreen';

export type RootStackParamList = {
  Questions: undefined;
  Onboarding: undefined;
  Home: undefined;
  Camera: { photoType: 'front' | 'side' };
  Analysis: { photos: { front: string; side: string } };
  Results: { measurements: any };
  Evolution: undefined;
  Profile: undefined;
  WaterReminder: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    checkInitialRoute();
    setupNavigationBar();
  }, []);

  const setupNavigationBar = async () => {
    if (Platform.OS === 'android') {
      await NavigationBar.setVisibilityAsync('hidden');
      await NavigationBar.setBehaviorAsync('overlay-swipe');
      await NavigationBar.setBackgroundColorAsync('#00000000');
    }
  };

  const checkInitialRoute = async () => {
    try {
      const questionsCompleted = await AsyncStorage.getItem('questionsCompleted');
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');

      if (!questionsCompleted) {
        // Primeira vez - vai para Questions
        setInitialRoute('Questions');
      } else if (hasLaunched === null) {
        // Questions completo mas nunca viu onboarding
        setInitialRoute('Onboarding');
        await AsyncStorage.setItem('hasLaunched', 'true');
      } else {
        // Usuário já passou por tudo
        setInitialRoute('Home');
      }
    } catch (error) {
      console.error('Erro ao verificar rota inicial:', error);
      setInitialRoute('Questions');
    }
  };

  if (initialRoute === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A1828' },
          animation: 'slide_from_right',
        }}
      >
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}