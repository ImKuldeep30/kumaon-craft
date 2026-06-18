import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-800 text-warm-100 border-t-4 border-primary-500">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-wide text-white">
                  Kumaon Craft
                </span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-primary-200 font-bold -mt-1">
                  Connect
                </span>
              </div>
            </Link>
            <p className="text-sm text-warm-300 leading-relaxed font-light">
              Empowering traditional Himalayan artisans by bridging the gap between local heritage and global buyers. Preserving Kumaon's craft culture through direct digital trade.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white tracking-wide border-b border-primary-500/20 pb-2">
              Explore Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-warm-300 hover:text-primary-200 transition-colors duration-300">
                  Home Catalog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-warm-300 hover:text-primary-200 transition-colors duration-300">
                  About Kumaon Culture
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-warm-300 hover:text-primary-200 transition-colors duration-300">
                  Artisan Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-warm-300 hover:text-primary-200 transition-colors duration-300 font-semibold text-primary-200">
                  Artisan Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Craft Categories */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white tracking-wide border-b border-primary-500/20 pb-2">
              Traditional Crafts
            </h3>
            <ul className="space-y-2.5 text-sm text-warm-300">
              <li className="hover:text-primary-200 cursor-pointer transition-colors duration-300">
                Panchachuli Woolen Handlooms
              </li>
              <li className="hover:text-primary-200 cursor-pointer transition-colors duration-300">
                Likhai Wood Carvings
              </li>
              <li className="hover:text-primary-200 cursor-pointer transition-colors duration-300">
                Traditional Aipan Artworks
              </li>
              <li className="hover:text-primary-200 cursor-pointer transition-colors duration-300">
                Almora Copperware (Tamta Craft)
              </li>
            </ul>
          </div>

          {/* Contact & Wholesale Inquiries */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-white tracking-wide border-b border-primary-500/20 pb-2">
              Wholesale Support
            </h3>
            <ul className="space-y-3 text-sm text-warm-300">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Almora District, Uttarakhand, India</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>wholesale@kumaoncraft.org</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 5962 230055</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="bg-secondary-900 border-t border-secondary-700/50 py-6 text-center text-xs text-warm-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {currentYear} Kumaon Craft Connect. All rights reserved. Created in support of Himalayan Artisan Guilds.</p>
          <div className="flex space-x-6 text-sm">
            <span className="hover:text-primary-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-primary-200 cursor-pointer">Artisan Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
