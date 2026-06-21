import { create } from 'zustand';

/**
 * Toast Store (Zustand)
 * Global state management for application notifications
 */
export const useToastStore = create((set) => ({
  toasts: [],

  /**
   * Add a new toast message
   * @param {string} message - Message content
   * @param {'success' | 'error' | 'warning' | 'info'} type - Toast variant
   * @param {number} duration - Auto-dismiss duration in ms
   */
  addToast: (message, type = 'info', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    // Auto dismiss
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  /**
   * Remove a toast by ID manually
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

export default useToastStore;
