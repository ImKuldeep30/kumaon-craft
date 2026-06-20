import React from 'react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  inputClassName = '',
  required = false,
  textarea = false,
  select = false,
  rows = 3,
  error,
  children,
  ...props
}) => {
  const inputStyle = `w-full px-4 py-2.5 rounded-xl border border-warm-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-warm-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all transition-theme ${inputClassName}`;
  
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-secondary-700 dark:text-warm-200 uppercase tracking-wider transition-theme">
          {label}
        </label>
      )}
      
      {select ? (
        <select
          value={value}
          onChange={onChange}
          required={required}
          className={inputStyle}
          {...props}
        >
          {children}
        </select>
      ) : textarea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${inputStyle} resize-none`}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputStyle}
          {...props}
        />
      )}
      
      {error && (
        <span className="text-xs text-red-500 font-semibold">{error}</span>
      )}
    </div>
  );
};

export default Input;
