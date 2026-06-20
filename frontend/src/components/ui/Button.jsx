import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  to,
  href,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg hover:shadow-primary-500/20 disabled:bg-primary-300 disabled:scale-100 disabled:cursor-not-allowed',
    secondary: 'bg-secondary-700 hover:bg-primary-500 dark:bg-secondary-650 dark:hover:bg-primary-500 text-white shadow-md hover:shadow-lg',
    outline: 'border border-secondary-600/30 dark:border-warm-300/30 text-secondary-800 dark:text-warm-100 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:border-secondary-800 dark:hover:border-warm-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md',
    ghost: 'bg-transparent text-secondary-600 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-secondary-800 hover:text-primary-500 dark:hover:text-primary-400'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base'
  };
  
  const classes = `${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
