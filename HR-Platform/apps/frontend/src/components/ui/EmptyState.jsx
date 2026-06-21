import React from 'react';

/**
 * EmptyState Component
 * Displays placeholder when no items/data is present, with optional action button
 */
export function EmptyState({
  title = "Ma'lumot topilmadi",
  text = "Hozircha hech qanday ma'lumot mavjud emas.",
  icon = "📂",
  action = null, // React element (e.g. Button)
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
