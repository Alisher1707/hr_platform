import React from 'react';

/**
 * Textarea Component
 * Reusable textarea with label and error states utilizing globals.css classes
 */
export function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`form-textarea ${error ? 'error' : ''}`}
        {...props}
      />
      
      {error && (
        <span className="form-error">{error}</span>
      )}
    </div>
  );
}

export default Textarea;
