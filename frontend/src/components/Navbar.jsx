import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './ui/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            if (stored) return stored;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Dashboard', path: '/dashboard' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-warm-50/85 dark:bg-secondary-900/80 border-b border-warm-200/50 dark:border-secondary-800/50 transition-all duration-300 transition-theme">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                {/* Traditional motif design SVG */}
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif text-lg md:text-xl font-bold tracking-wide text-secondary-800 dark:text-warm-100 group-hover:text-primary-500 transition-colors duration-300 transition-theme">
                                    Kumaon Craft
                                </span>
                                <span className="text-[10px] tracking-[0.2em] uppercase text-primary-600 dark:text-primary-400 font-bold -mt-1 transition-theme">
                                    Connect
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-semibold tracking-wide transition-all duration-300 relative py-2 transition-theme ${isActive(link.path)
                                        ? 'text-primary-500 dark:text-primary-400 font-bold'
                                        : 'text-secondary-600 dark:text-warm-300 hover:text-primary-500 dark:hover:text-primary-400'
                                    }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 dark:bg-primary-400 rounded-full animate-pulse" />
                                )}
                            </Link>
                        ))}

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="p-2.5 rounded-full bg-warm-100 hover:bg-warm-200 text-secondary-600 dark:bg-secondary-800 dark:hover:bg-secondary-700 dark:text-warm-100 transition-all duration-300 hover:scale-105 active:scale-95 border border-warm-200/40 dark:border-secondary-700/50 mr-2 flex items-center justify-center cursor-pointer"
                        >
                            {theme === 'light' ? (
                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="w-4.5 h-4.5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                                </svg>
                            )}
                        </button>

                        <Button
                            to="/login"
                            className="rounded-full"
                        >
                            Login
                        </Button>
                    </div>

                    {/* Mobile controls */}
                    <div className="md:hidden flex items-center gap-2">
                        {/* Theme Toggle Button Mobile */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="p-2 rounded-full bg-warm-100 text-secondary-600 dark:bg-secondary-800 dark:text-warm-100 transition-all duration-300 border border-warm-200/40 dark:border-secondary-700/50 flex items-center justify-center cursor-pointer"
                        >
                            {theme === 'light' ? (
                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="w-4.5 h-4.5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-lg text-secondary-600 dark:text-warm-200 hover:text-primary-500 hover:bg-warm-100 dark:hover:bg-secondary-800 transition-all duration-300 focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`} id="mobile-menu">
                <div className="px-4 pt-2 pb-6 space-y-2 bg-warm-100/90 dark:bg-secondary-900/95 backdrop-blur-md border-t border-warm-200/50 dark:border-secondary-800/50 transition-theme">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-3 rounded-xl text-base font-semibold tracking-wide transition-all duration-300 transition-theme ${isActive(link.path)
                                    ? 'bg-primary-50 dark:bg-secondary-800 text-primary-500 dark:text-primary-400 font-bold'
                                    : 'text-secondary-600 dark:text-warm-200 hover:bg-warm-200/50 dark:hover:bg-secondary-800/60 hover:text-primary-500 dark:hover:text-primary-400'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-warm-200/60 dark:border-secondary-800/60">
                        <Button
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className="w-full text-center py-3 text-base"
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
