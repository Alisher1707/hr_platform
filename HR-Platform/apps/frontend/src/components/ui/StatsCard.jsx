import React from 'react';

/**
 * StatsCard Component
 * Displays key metrics with a gradient icon and slide up animation
 */
export function StatsCard({
  label,
  value,
  icon,
  iconColor = 'indigo', // 'indigo', 'emerald', 'amber', 'blue', 'rose'
  className = '',
}) {
  return (
    <div className={`stats-card ${className}`.trim()}>
      <div className={`stats-icon ${iconColor}`}>
        {icon}
      </div>
      <div className="stats-info">
        <div className="stats-label">{label}</div>
        <div className="stats-value">{value}</div>
      </div>
    </div>
  );
}

export default StatsCard;
