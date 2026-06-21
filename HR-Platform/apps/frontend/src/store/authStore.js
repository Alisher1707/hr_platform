import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';

/**
 * Auth Store (Zustand)
 * Global state management for authentication
 */

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Login action
       */
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await authService.login(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      /**
       * Register action
       */
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await authService.register(data);
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      /**
       * Logout action
       */
      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({ user: null, isAuthenticated: false, error: null });
        }
      },

      /**
       * Load current user
       */
      loadUser: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          localStorage.removeItem('accessToken');
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      /**
       * Clear error
       */
      clearError: () => set({ error: null }),

      /**
       * Check if user has role
       */
      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      /**
       * Check if user has any of roles
       */
      hasAnyRole: (roles) => {
        const { user } = get();
        return roles.includes(user?.role);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
