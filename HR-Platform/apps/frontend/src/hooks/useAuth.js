import { useAuthStore } from '../store/authStore';

/**
 * useAuth Hook
 * Simple wrapper hook around auth global store
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    loadUser,
    clearError,
    hasRole,
    hasAnyRole,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    loadUser,
    clearError,
    hasRole,
    hasAnyRole,
  };
}

export default useAuth;
