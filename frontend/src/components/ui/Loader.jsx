import React from 'react';

/**
 * Loader Component
 * 
 * @param {Object} props - The component props.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the spinner loader.
 * @param {string} [props.className=''] - Extra CSS classes to apply to the loader.
 * @param {'primary' | 'white' | 'secondary'} [props.color='primary'] - The visual color scheme of the spinner.
 */
const Loader = ({
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  color = 'primary' // 'primary' | 'white' | 'secondary'
}) => {
  const sizeStyle = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };
  
  const colorStyle = {
    primary: 'border-primary-500/20 border-t-primary-500',
    white: 'border-white/20 border-t-white',
    secondary: 'border-secondary-750/20 border-t-secondary-700 dark:border-warm-100/20 dark:border-t-warm-100'
  };
  
  return (
    <div 
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full animate-spin ${sizeStyle[size]} ${colorStyle[color]} ${className}`}
    />
  );
};

export default Loader;
