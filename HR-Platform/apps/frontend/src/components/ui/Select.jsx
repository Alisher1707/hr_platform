import React from 'react';

/**
 * Select Component
 * Reusable dropdown select using premium CSS classes from globals.css
 */
export function Select({
  label,
  name,
  value,
  onChange,
  options = [], // [{ value: '...', label: '...' }]
  error,
  required = false,
  disabled = false,
  className = '',
  placeholder = "Tanlang...",
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
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`form-select ${error ? 'error' : ''}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      
      {error && (
        <span className="form-error">{error}</span>
      )}
    </div>
  );
}

export default Select;
