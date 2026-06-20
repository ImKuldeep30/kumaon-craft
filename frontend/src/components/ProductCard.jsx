import React, { useState } from 'react';

const ProductCard = ({ product, onInquire }) => {
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    quantity: product.minOrder || 10,
    message: `Hello, I am interested in wholesale pricing for "${product.name}". Please share the pricing sheet.`
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.email) {
      alert("Please fill out your Name and Email.");
      return;
    }
    // Simulate inquiry submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setShowInquiryModal(false);
      setInquiryData({
        name: '',
        email: '',
        quantity: product.minOrder || 10,
        message: `Hello, I am interested in wholesale pricing for "${product.name}". Please share the pricing sheet.`
      });
      if (onInquire) {
        onInquire(product, inquiryData);
      }
    }, 2000);
  };

  return (
    <>
      {/* Product Card Container */}
      <div className="bg-white dark:bg-secondary-800/80 rounded-2xl overflow-hidden border border-warm-200 dark:border-secondary-700/60 shadow-sm dark:shadow-secondary-950/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group transition-theme">
        {/* Product Image & Category Badge */}
        <div className="relative aspect-square overflow-hidden bg-warm-100 dark:bg-secondary-900 transition-theme">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              // Fallback image using a styled placeholder if Unsplash fails
              e.target.src = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop";
            }}
          />
          {/* Category Tag */}
          <span className="absolute top-4 left-4 bg-secondary-700/95 text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
            {product.category}
          </span>
        </div>

        {/* Product Details */}
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div className="space-y-2">
            {/* Artisan Details */}
            <div className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider transition-theme">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>By {product.artisan}</span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-xl font-bold text-secondary-800 dark:text-warm-100 line-clamp-1 group-hover:text-primary-500 transition-colors duration-300 transition-theme">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-secondary-600/80 dark:text-warm-200/80 line-clamp-2 leading-relaxed transition-theme">
              {product.description}
            </p>
          </div>

          {/* Pricing and Action */}
          <div className="mt-6 pt-4 border-t border-warm-100 dark:border-secondary-700/60 flex flex-col gap-4 transition-theme">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 dark:text-warm-300/60 font-semibold block transition-theme">Wholesale Price</span>
                <span className="text-lg font-bold text-secondary-800 dark:text-warm-50 transition-theme">{product.price}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 dark:text-warm-300/60 font-semibold block transition-theme">Min. Order</span>
                <span className="text-sm font-semibold text-secondary-700 dark:text-warm-100 transition-theme">{product.minOrder} Units</span>
              </div>
            </div>

            <button
              onClick={() => setShowInquiryModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-secondary-700 hover:bg-primary-500 dark:bg-secondary-600 dark:hover:bg-primary-500 text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Submit Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-800/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-warm-50 dark:bg-secondary-900 rounded-2xl max-w-md w-full shadow-2xl border border-warm-200 dark:border-secondary-800 overflow-hidden transform transition-all duration-300 scale-100 transition-theme">
            {/* Modal Header */}
            <div className="bg-secondary-700 dark:bg-secondary-800 text-white p-6 flex justify-between items-center transition-theme">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-primary-200 dark:text-primary-300 font-bold block mb-1 transition-theme">Wholesale Quote Request</span>
                <h3 className="font-serif text-xl font-bold">{product.name}</h3>
              </div>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors duration-300 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {isSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto text-primary-500 animate-bounce">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-secondary-800 dark:text-warm-100 transition-theme">Inquiry Sent!</h4>
                  <p className="text-sm text-secondary-600 dark:text-warm-300 transition-theme">
                    Your wholesale catalog request was submitted to <strong>{product.artisan}</strong>. You will receive an email response soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-secondary-700 dark:text-warm-200 uppercase tracking-wider mb-1 transition-theme">Your Name</label>
                    <input
                      type="text"
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                      placeholder="e.g., Jane Smith"
                      className="w-full px-4 py-2.5 rounded-xl border border-warm-300 dark:border-secondary-750 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-warm-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all transition-theme"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary-700 dark:text-warm-200 uppercase tracking-wider mb-1 transition-theme">Business Email</label>
                    <input
                      type="email"
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                      placeholder="e.g., buyer@company.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-warm-300 dark:border-secondary-750 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-warm-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all transition-theme"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary-700 dark:text-warm-200 uppercase tracking-wider mb-1 transition-theme">Inquiry Quantity (Units)</label>
                    <input
                      type="number"
                      min={product.minOrder}
                      value={inquiryData.quantity}
                      onChange={(e) => setInquiryData({ ...inquiryData, quantity: parseInt(e.target.value) || product.minOrder })}
                      className="w-full px-4 py-2.5 rounded-xl border border-warm-300 dark:border-secondary-750 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-warm-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all transition-theme"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary-700 dark:text-warm-200 uppercase tracking-wider mb-1 transition-theme">Message</label>
                    <textarea
                      rows={3}
                      value={inquiryData.message}
                      onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-warm-300 dark:border-secondary-750 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-warm-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none transition-theme"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-md"
                  >
                    Submit Inquire Form
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
