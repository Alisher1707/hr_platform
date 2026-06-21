import React from 'react';

/**
 * LoadingSpinner Component
 * Displays animated spinner, supports inline or full screen loading state
 */
export function LoadingSpinner({
  size = 'md', // 'sm', 'md', 'lg'
  fullScreen = false,
  text = 'Yuklanmoqda...',
}) {
  const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : '';

  if (fullScreen) {
    return (
      <div className="loading-screen animate-fade-in">
        <div className={`spinner ${sizeClass}`.trim()} />
        {text && <div className="loading-text">{text}</div>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <div className={`spinner ${sizeClass}`.trim()} />
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
}

export default LoadingSpinner;
