import React from 'react';

/**
 * Button Component
 * Reusable premium button utilizing vanilla CSS classes from globals.css
 */
export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  fullWidth = false,
  loading = false,
  icon = null,
  className = '',
  ...props
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = `btn-${variant}`;
  const fullWidthClass = fullWidth ? 'btn-full' : '';
  
  const combinedClassName = `btn ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClassName}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner animate-spin" style={{ width: '16px', height: '16px', borderWidth: '2px', marginRight: '8px', borderStyle: 'solid', borderColor: 'currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block' }}></span>
          Yuklanmoqda...
        </>
      ) : (
        <>
          {icon && <span className="btn-icon-wrapper" style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;
