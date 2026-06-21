import { useThemeStore } from '../store/themeStore';

/**
 * useTheme Hook
 * Simple wrapper hook around theme global store
 */
export function useTheme() {
  const { theme, toggleTheme, setTheme, initTheme } = useThemeStore();

  return {
    theme,
    toggleTheme,
    setTheme,
    initTheme,
    isDark: theme === 'dark',
  };
}

export default useTheme;
