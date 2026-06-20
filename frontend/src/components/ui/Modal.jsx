import React, { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className = ''
}) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-800/60 backdrop-blur-sm animate-fade-in">
      <div className={`bg-warm-50 dark:bg-secondary-900 rounded-2xl max-w-md w-full shadow-2xl border border-warm-200 dark:border-secondary-800 overflow-hidden transform transition-all duration-300 scale-100 transition-theme ${className}`}>
        {/* Modal Header */}
        <div className="bg-secondary-700 dark:bg-secondary-800 text-white p-6 flex justify-between items-center transition-theme">
          <div>
            {subtitle && (
              <span className="text-[10px] uppercase tracking-widest text-primary-200 dark:text-primary-300 font-bold block mb-1 transition-theme">
                {subtitle}
              </span>
            )}
            <h3 className="font-serif text-xl font-bold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors duration-300 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
