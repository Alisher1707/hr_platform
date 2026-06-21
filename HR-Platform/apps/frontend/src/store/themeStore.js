import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Theme Store (Zustand)
 * Global state management for theme (light/dark)
 */

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // 'light' or 'dark'

      /**
       * Toggle theme
       */
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.setAttribute('data-theme', newTheme);
      },

      /**
       * Set theme
       */
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },

      /**
       * Initialize theme
       */
      initTheme: () => {
        const { theme } = get();
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
