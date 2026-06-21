import React, { useEffect } from 'react';

/**
 * Toast Component
 * 
 * @param {Object} props - The component props.
 * @param {string} props.message - The message text to display.
 * @param {function} [props.onClose] - Close handler callback after toast expires.
 * @param {number} [props.duration=4000] - Duration in milliseconds to show the toast before calling onClose.
 * @param {'success' | 'error'} [props.type='success'] - The visual style type of the toast.
 * @param {boolean} [props.fixed=true] - Whether the toast is fixed to bottom-right or rendered inline.
 * @param {string} [props.className=''] - Extra classes for the toast wrapper div.
 */
const Toast = ({
  message,
  onClose,
  duration = 4000,
  type = 'success', // 'success' | 'error'
  fixed = true,
  className = ''
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const positionStyle = fixed ? 'fixed bottom-6 right-6 z-50' : 'w-full';

  return (
    <div className={`${positionStyle} bg-secondary-800 text-white px-6 py-4 rounded-xl shadow-2xl border-l-4 border-primary-500 animate-slide-in flex items-center gap-3 transition-theme ${className}`}>
      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
        {type === 'success' ? '✓' : '✕'}
      </div>
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
};

export default Toast;
