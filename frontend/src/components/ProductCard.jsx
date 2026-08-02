import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';

const ProductCard = ({ product, onInquire, hasActiveInquiry }) => {
  const navigate = useNavigate();
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [inquiryData, setInquiryData] = useState(() => {
    const session = localStorage.getItem('user_session');
    const user = session ? JSON.parse(session) : null;
    return {
      name: user ? user.name : '',
      email: user ? user.email : '',
      quantity: product.minOrder || 10,
      message: `Hello, I am interested in wholesale pricing for "${product.name}". Please share the pricing sheet.`
    };
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Generate stable mock rating based on name characters
  const getRating = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const score = 4.0 + (Math.abs(hash % 10) / 10); // Between 4.0 and 4.9
    const count = Math.abs((hash >> 4) % 45) + 5; // Between 5 and 50 reviews
    return { score: score.toFixed(1), count };
  };
  const rating = getRating(product.name);

  const categoryImages = {
    'Handloom': [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=600&auto=format&fit=crop'
    ],
    'Copperware': [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601647998804-d758c56c278e?q=80&w=600&auto=format&fit=crop'
    ],
    'Woodcraft': [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1456428746267-a1756408f782?q=80&w=600&auto=format&fit=crop'
    ],
    'Aipan Art': [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop'
    ]
  };
  
  const presets = categoryImages[product.category] || categoryImages['Handloom'];
  const allImages = [
    product.image || presets[0],
    presets[1],
    presets[2]
  ];

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
      
      const session = localStorage.getItem('user_session');
      const user = session ? JSON.parse(session) : null;
      setInquiryData({
        name: user ? user.name : '',
        email: user ? user.email : '',
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
        <div 
          onClick={() => setShowDetailsModal(true)}
          className="relative aspect-square overflow-hidden bg-warm-100 dark:bg-secondary-900 transition-theme cursor-pointer group-hover:opacity-95"
        >
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
            <h3 
              onClick={() => setShowDetailsModal(true)}
              className="font-serif text-xl font-bold text-secondary-800 dark:text-warm-100 line-clamp-1 group-hover:text-primary-500 transition-colors duration-300 transition-theme cursor-pointer"
            >
              {product.name}
            </h3>

            {/* Description */}
            <p 
              onClick={() => setShowDetailsModal(true)}
              className="text-sm text-secondary-600/80 dark:text-warm-200/80 line-clamp-2 leading-relaxed transition-theme cursor-pointer hover:text-secondary-800 dark:hover:text-warm-100"
            >
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

            {hasActiveInquiry ? (
              <Button
                disabled
                variant="outline"
                className="w-full flex gap-2 bg-warm-100/60 dark:bg-secondary-900/20 text-secondary-500/80 dark:text-warm-400/80 border-warm-200/60 dark:border-secondary-750/60 cursor-not-allowed opacity-75"
              >
                📋 Inquiry Pending Review
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const session = localStorage.getItem('user_session');
                  if (!session) {
                    navigate('/login');
                  } else {
                    setShowInquiryModal(true);
                  }
                }}
                variant="secondary"
                className="w-full flex gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Submit Inquiry
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        title={product.name}
        subtitle="Wholesale Quote Request"
      >
        {isSubmitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto text-primary-500 dark:text-primary-400 animate-bounce">
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
            <Input
              label="Your Name"
              type="text"
              value={inquiryData.name}
              onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
              placeholder="e.g., Jane Smith"
              required
            />

            <Input
              label="Business Email"
              type="email"
              value={inquiryData.email}
              onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
              placeholder="e.g., buyer@company.com"
              required
            />

            <Input
              label="Inquiry Quantity (Units)"
              type="number"
              min={product.minOrder}
              value={inquiryData.quantity}
              onChange={(e) => setInquiryData({ ...inquiryData, quantity: parseInt(e.target.value) || product.minOrder })}
              required
            />

            <Input
              label="Message"
              textarea
              rows={3}
              value={inquiryData.message}
              onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
              required
            />

            <Button
              type="submit"
              className="w-full mt-2"
            >
              Submit Inquire Form
            </Button>
          </form>
        )}
      </Modal>

      {/* PRODUCT DETAILS PREVIEW MODAL */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={product.name}
        subtitle="Heritage Craft Product Details"
        className="max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Horizontal Snap Image Gallery */}
          <div className="space-y-4">
            <div className="relative group/slider">
              <div 
                id={`slider-${product._id}`}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 scroll-smooth"
              >
                {allImages.map((img, i) => (
                  <div 
                    key={i} 
                    className="min-w-full snap-start aspect-[4/3] rounded-2xl overflow-hidden bg-warm-100 dark:bg-secondary-900 border border-warm-200 dark:border-secondary-750 shadow-inner relative"
                  >
                    <img
                      src={img}
                      alt={`${product.name} View ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop";
                      }}
                    />
                    <span className="absolute bottom-4 right-4 bg-secondary-900/80 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      {i + 1} / {allImages.length}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Left/Right Action Arrows for easy desktops navigation */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById(`slider-${product._id}`);
                  if (el) el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' });
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-secondary-800/80 hover:bg-white dark:hover:bg-secondary-700 flex items-center justify-center text-secondary-800 dark:text-warm-100 shadow-md backdrop-blur-sm cursor-pointer border border-warm-200/50 dark:border-secondary-700/50"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById(`slider-${product._id}`);
                  if (el) el.scrollBy({ left: el.clientWidth, behavior: 'smooth' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-secondary-800/80 hover:bg-white dark:hover:bg-secondary-700 flex items-center justify-center text-secondary-800 dark:text-warm-100 shadow-md backdrop-blur-sm cursor-pointer border border-warm-200/50 dark:border-secondary-700/50"
                aria-label="Next image"
              >
                →
              </button>
            </div>
            
            {/* Scroll Navigation Indicators */}
            <div className="flex justify-center gap-1.5">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(`slider-${product._id}`);
                    if (el) {
                      el.scrollTo({
                        left: el.clientWidth * i,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="w-2.5 h-2.5 rounded-full bg-warm-300 dark:bg-secondary-700 hover:bg-primary-500 dark:hover:bg-primary-500 transition-colors cursor-pointer"
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Details Content */}
          <div className="space-y-5">
            {/* Meta badges */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="bg-primary-50 dark:bg-secondary-850 text-primary-600 dark:text-primary-400 text-xs font-bold px-3 py-1 rounded-full border border-primary-200 dark:border-secondary-700">
                🏷️ {product.category}
              </span>
              <span className="bg-secondary-800 text-white text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full">
                👤 By {product.artisan}
              </span>
            </div>

            {/* Dynamic Premium Rating Display */}
            <div className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-warm-50 dark:bg-secondary-900/40 border border-warm-200 dark:border-secondary-750/50 w-fit">
              <div className="flex text-amber-500 text-base">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(parseFloat(rating.score)) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-xs font-bold text-secondary-800 dark:text-warm-100">{rating.score} / 5.0</span>
              <span className="text-[10px] text-secondary-500 dark:text-warm-300">({rating.count} verified reviews)</span>
            </div>

            {/* Product description */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-secondary-800 dark:text-warm-100 text-lg">Product Description</h4>
              <p className="text-sm text-secondary-700 dark:text-warm-200 leading-relaxed font-serif bg-warm-50/40 dark:bg-secondary-900/10 p-4 rounded-2xl border border-warm-100 dark:border-secondary-800/40 max-h-48 overflow-y-auto">
                {product.description}
              </p>
            </div>

            {/* Sourcing Summary Card */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-warm-100/50 dark:bg-secondary-900 border border-warm-200 dark:border-secondary-750">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-secondary-500 font-semibold block">Wholesale Price</span>
                <span className="text-base font-extrabold text-secondary-800 dark:text-warm-100">{product.price}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-secondary-500 font-semibold block">Min. Order Limit</span>
                <span className="text-base font-extrabold text-secondary-800 dark:text-warm-100">{product.minOrder} Units</span>
              </div>
            </div>

            {/* Quick Sourcing Action */}
            <div className="pt-2 flex gap-3">
              <Button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                variant="outline"
                className="flex-1"
              >
                Close Preview
              </Button>
              {hasActiveInquiry ? (
                <Button
                  disabled
                  variant="outline"
                  className="flex-1 bg-warm-100/60 dark:bg-secondary-900/20 text-secondary-500/80 dark:text-warm-400/80 border-warm-200/60 dark:border-secondary-750/60 cursor-not-allowed opacity-75"
                >
                  📋 Inquiry Active
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setShowDetailsModal(false);
                    const session = localStorage.getItem('user_session');
                    if (!session) {
                      navigate('/login');
                    } else {
                      setShowInquiryModal(true);
                    }
                  }}
                  className="flex-1"
                >
                  Place Inquiry
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductCard;
