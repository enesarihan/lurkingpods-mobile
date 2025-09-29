import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/api';

interface User {
  id: string;
  email: string;
  language_preference: 'en' | 'tr';
  trial_start_date: Date;
  trial_end_date: Date;
  subscription_status: 'trial' | 'active' | 'expired' | 'cancelled';
  notification_enabled: boolean;
  notification_time: string;
  favorite_categories: string[];
  theme_preference: 'light' | 'dark' | 'system';
}

interface Subscription {
  is_subscribed: boolean;
  subscription_type: 'monthly' | 'yearly' | null;
  end_date: Date | null;
  is_expired: boolean;
}

interface AuthState {
  user: User | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, language: 'en' | 'tr') => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updateSubscription: (subscription: Subscription) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      subscription: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const data = await ApiService.login(email, password);
          
          set({
            user: data.user,
            subscription: data.trial_info,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      register: async (email: string, password: string, language: 'en' | 'tr') => {
        set({ isLoading: true, error: null });
        
        try {
          const data = await ApiService.register(email, password, language);
          
          set({
            user: data.user,
            subscription: data.trial_info,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          subscription: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      updateSubscription: (subscription: Subscription) => {
        set({ subscription });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        subscription: state.subscription,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
