// ============================================================
// TIPOS DO USUÁRIO
// ============================================================

export type Gender = 'male' | 'female' | 'other';
export type Goal = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'health';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55+';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  gender: Gender;
  goal: Goal;
  activityLevel: ActivityLevel;
  ageRange: AgeRange;
  height: number; // cm
  weight: number; // kg
  notifications: boolean;
  privacyMode: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

// ============================================================
// TIPOS DAS MEDIÇÕES
// ============================================================

export interface BodyMeasurements {
  chest: number;
  waist: number;
  hip: number;
  arm: number;
  leg: number;
  bodyFat: number;
  height: number;
}

export interface MeasurementEntry extends BodyMeasurements {
  id: string;
  uid: string;
  date: string; // ISO date
  photos: {
    front: string; // Storage URL
    side: string;  // Storage URL
  };
  createdAt: string;
}

// ============================================================
// TIPOS DE AUTENTICAÇÃO
// ============================================================

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  displayName?: string;
}

export interface OnboardingAnswers {
  gender: Gender;
  goal: Goal;
  activityLevel: ActivityLevel;
  ageRange: AgeRange;
  height: number;
  weight: number;
}

// ============================================================
// NAVIGATION (atualizado para incluir Auth)
// ============================================================

export type RootStackParamList = {
  // Auth
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  // Onboarding
  Questions: undefined;
  Onboarding: undefined;
  // App
  Home: undefined;
  Camera: { photoType: 'front' | 'side' };
  Analysis: { photos: { front: string; side: string } };
  Results: { measurements: BodyMeasurements };
  Evolution: undefined;
  Profile: undefined;
};
