import React from 'react';

/**
 * Input Component
 * Reusable input field with label and error using premium CSS classes from globals.css
 */
export function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon = null,
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
      
      {icon ? (
        <div className="form-input-icon">
          <span className="input-icon">{icon}</span>
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`form-input ${error ? 'error' : ''}`}
            {...props}
          />
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`form-input ${error ? 'error' : ''}`}
          {...props}
        />
      )}
      
      {error && (
        <span className="form-error">{error}</span>
      )}
    </div>
  );
}

export default Input;
