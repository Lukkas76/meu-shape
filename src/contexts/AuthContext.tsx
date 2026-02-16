import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import { UserProfile, AuthState, OnboardingAnswers } from '../types';

// ============================================================
// TIPOS DO CONTEXTO
// ============================================================

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  completeOnboarding: (answers: OnboardingAnswers) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// PROVIDER
// ============================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // ── Observa mudanças de auth ─────────────────────────────
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await UserService.getProfile(firebaseUser.uid);
          setState({
            user: profile,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } catch {
          // Usuário autenticado mas sem perfil (registro incompleto)
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        }
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    });

    return unsubscribe;
  }, []);

  // ── Login ─────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await AuthService.login(email, password);
      // O observer cuida do resto
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  }, []);

  // ── Registro ──────────────────────────────────────────────
  const register = useCallback(
    async (email: string, password: string, displayName?: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const user = await AuthService.register(email, password, displayName);
        return user;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
        throw error;
      }
    },
    []
  );

  // ── Completar onboarding (salva perfil no Firestore) ─────
  const completeOnboarding = useCallback(
    async (answers: OnboardingAnswers) => {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('Usuário não autenticado');

      const profile = await UserService.createProfile(
        currentUser.uid,
        currentUser.email || '',
        answers,
        currentUser.displayName || undefined
      );

      setState((prev) => ({
        ...prev,
        user: profile,
        isLoading: false,
      }));
    },
    []
  );

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await AuthService.logout();
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, []);

  // ── Reset de senha ────────────────────────────────────────
  const resetPassword = useCallback(async (email: string) => {
    try {
      await AuthService.resetPassword(email);
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message }));
      throw error;
    }
  }, []);

  // ── Atualizar perfil ─────────────────────────────────────
  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!state.user) throw new Error('Usuário não autenticado');

      await UserService.updateProfile(state.user.uid, data);

      setState((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
      }));
    },
    [state.user]
  );

  // ── Refresh do perfil ────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) return;

    const profile = await UserService.getProfile(currentUser.uid);
    if (profile) {
      setState((prev) => ({ ...prev, user: profile }));
    }
  }, []);

  // ── Limpar erro ──────────────────────────────────────────
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        resetPassword,
        completeOnboarding,
        updateProfile,
        refreshProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return context;
}
