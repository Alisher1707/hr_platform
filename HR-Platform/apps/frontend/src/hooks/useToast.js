import { useToastStore } from '../store/toastStore';

/**
 * useToast Hook
 * Provides helper functions for triggering toast notifications
 */
export function useToast() {
  const { addToast, removeToast } = useToastStore();

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
  };

  return { toast, removeToast };
}

export default useToast;
