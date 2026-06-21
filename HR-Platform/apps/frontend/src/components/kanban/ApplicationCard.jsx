import React from 'react';
import { useDraggable } from '@dnd-kit/core';

/**
 * ApplicationCard Component
 * Draggable card representing a candidate application on the Kanban board
 */
export function ApplicationCard({ application, onClick }) {
  const { id, firstName, lastName, position, phone, createdAt } = application;
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: {
      application
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 999 : undefined,
  } : undefined;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isDragging ? 'dragging' : ''}`}
      onClick={() => onClick(application)}
      {...attributes}
      {...listeners}
    >
      <div className="kanban-card-name">
        {firstName} {lastName}
      </div>
      <div className="kanban-card-position">
        {position || 'Lavozim kiritilmagan'}
      </div>
      <div className="kanban-card-footer">
        <div className="kanban-card-phone">
          📞 {phone || 'Noma\'lum'}
        </div>
        <div className="kanban-card-date">
          📅 {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
}

export default ApplicationCard;
