import React from 'react';

/**
 * Card Component
 * Container component supporting glassmorphism and gradient variants
 */
export function Card({ 
  children, 
  variant = 'default', // 'default', 'glass', 'gradient'
  className = '',
  ...props 
}) {
  const variantClass = variant === 'glass' 
    ? 'card-glass' 
    : variant === 'gradient' 
      ? 'card-gradient' 
      : 'card';

  return (
    <div className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export default Card;
