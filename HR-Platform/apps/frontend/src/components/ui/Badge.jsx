import React from 'react';

/**
 * Badge Component
 * Status badge with dot indicator support, utilizing design system classes
 */
export function Badge({
  children,
  variant = 'info', // 'keldi', 'qoshildi', 'shartnoma', 'success', 'error', 'warning', 'info'
  showDot = false,
  className = '',
  ...props
}) {
  // Normalize badge variants that could map to status variants
  const getBadgeClass = (v) => {
    const val = v.toLowerCase();
    if (val === 'keldi') return 'badge-keldi';
    if (val === 'qoshildi') return 'badge-qoshildi';
    if (val === 'shartnoma') return 'badge-shartnoma';
    return `badge-${val}`;
  };

  const badgeClass = getBadgeClass(variant);

  return (
    <span className={`badge ${badgeClass} ${className}`.trim()} {...props}>
      {showDot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

export default Badge;
