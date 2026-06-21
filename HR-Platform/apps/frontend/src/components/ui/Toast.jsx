import React from 'react';
import { useToastStore } from '../../store/toastStore';

/**
 * Individual Toast Component
 */
export function Toast({ id, message, type }) {
  const removeToast = useToastStore((state) => state.removeToast);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast toast-${type} animate-slide-right`}>
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{message}</span>
      <button 
        className="toast-close" 
        onClick={() => removeToast(id)}
        aria-label="Yopish"
      >
        &times;
      </button>
    </div>
  );
}

/**
 * Global Toast Container Component
 * Mount this at the root of the app (e.g. in App.jsx)
 */
export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast 
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
