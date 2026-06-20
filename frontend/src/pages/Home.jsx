import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

// Realistic product list representing the Himalayan heritage crafts
const CRAFT_PRODUCTS = [
    {
        id: 1,
        name: 'Panchachuli Handspun Tweed Woolen Fabric',
        category: 'Handloom',
        price: '₹2,400 / Meter',
        minOrder: 15,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
        artisan: 'Bhagwati Devi, Munsyari',
        description: 'Traditionally spun and hand-woven pure sheep wool fabric, colored with organic wild herb dyes. Ideal for premium winter coats and jackets.'
    },
    {
        id: 2,
        name: 'Traditional Almora Tamta Copper Water Jug',
        category: 'Copperware',
        price: '₹1,950 / Unit',
        minOrder: 20,
        image: 'https://images.unsplash.com/photo-1576016770956-debb63d900bb?q=80&w=600&auto=format&fit=crop',
        artisan: 'Ram Chandra Tamta, Almora',
        description: 'Exquisitely hand-hammered pure copper water container using traditional beating techniques passed down through generations of Tamta coppersmiths.'
    },
    {
        id: 3,
        name: 'Ringaal Bamboo Handwoven Basket Set',
        category: 'Woodcraft',
        price: '₹750 / Set',
        minOrder: 30,
        image: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=600&auto=format&fit=crop',
        artisan: 'Dhyan Singh, Bageshwar',
        description: 'Eco-friendly and durable nesting storage baskets woven intricately from wild hill bamboo (Ringaal). Lightweight and biodegradable.'
    },
    {
        id: 4,
        name: 'Decorative Handpainted Aipan Wood Chowki',
        category: 'Aipan Art',
        price: '₹1,500 / Piece',
        minOrder: 10,
        image: 'https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=600&auto=format&fit=crop',
        artisan: 'Kavita Pandey, Nainital',
        description: 'Traditional ritual floor drawing art (Aipan) handpainted on a premium wooden base using authentic brick-red (Geru) and white rice paste colors.'
    },
    {
        id: 5,
        name: 'Wild Himalayan Giant Nettle (Kandali) Scarf',
        category: 'Handloom',
        price: '₹1,850 / Unit',
        minOrder: 15,
        image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=600&auto=format&fit=crop',
        artisan: 'Sunita Bisht, Dharchula',
        description: 'Organic, ethically harvested wild nettle fibers blended with soft organic cotton, woven on traditional Himalayan frame looms.'
    },
    {
        id: 6,
        name: 'Likhai Hand-Carved Wooden Wall Panel',
        category: 'Woodcraft',
        price: '₹8,500 / Piece',
        minOrder: 5,
        image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=600&auto=format&fit=crop',
        artisan: 'Harish Ram, Jageshwar',
        description: 'Intricately hand-carved cedar wood block displaying traditional Himalayan "Likhai" architectural motifs, perfect for high-end boutique interiors.'
    }
];

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [inquiriesCount, setInquiriesCount] = useState(0);
    const [notification, setNotification] = useState('');

    const categories = ['All', 'Handloom', 'Copperware', 'Woodcraft', 'Aipan Art'];

    // Filter products based on category and search query
    const filteredProducts = useMemo(() => {
        return CRAFT_PRODUCTS.filter((product) => {
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.artisan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const handleInquirySubmit = (product, details) => {
        setInquiriesCount((prev) => prev + 1);
        setNotification(`Wholesale inquiry submitted for ${product.name}!`);
        setTimeout(() => setNotification(''), 4000);
    };

    return (
        <div className="min-h-screen flex flex-col justify-between">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-warm-100 via-white to-primary-50 dark:from-secondary-900 dark:via-secondary-850 dark:to-primary-950/20 py-24 md:py-32 border-b border-warm-200 dark:border-secondary-800 transition-theme">
                {/* <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-200/50 blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-secondary-100 blur-3xl" />
        </div> */}

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Hero Text */}
                        <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fade-in-up">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-secondary-800 border border-primary-200 dark:border-secondary-700 shadow-sm transition-theme">
                                <span className="w-2 h-2 rounded-full bg-primary-500" />
                                Preserving Himalayan Legacy
                            </span>

                            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-secondary-800 dark:text-warm-100 leading-tight transition-theme">
                                Authentic Craftsmanship from the <span className="text-primary-500">Kumaon Hills</span>
                            </h1>

                            <p className="text-lg text-secondary-700 dark:text-warm-200 leading-relaxed max-w-2xl transition-theme">
                                Direct trade portal connecting authentic Himalayan handloom weavers, copper beaters, wood artisans, and Aipan artists directly with conscious retail partners and institutional bulk buyers.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                <a
                                    href="#catalog"
                                    className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-base font-bold tracking-wide shadow-lg hover:shadow-primary-500/20 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center cursor-pointer"
                                >
                                    Explore Digital Catalog
                                </a>
                                <a
                                    href="#why-kumaon"
                                    className="px-8 py-4 border border-secondary-600/30 dark:border-warm-300/30 text-secondary-800 dark:text-warm-100 hover:bg-secondary-50 dark:hover:bg-secondary-800 hover:border-secondary-800 dark:hover:border-warm-200 rounded-xl text-base font-bold tracking-wide transition-all duration-300 flex items-center justify-center cursor-pointer"
                                >
                                    Our Heritage Mission
                                </a>
                            </div>
                        </div>

                        {/* Hero Decorative Image Panel */}
                        <div className="lg:col-span-5 relative flex justify-center">
                            <div className="relative w-80 h-96 sm:w-96 sm:h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-secondary-850 rotate-2 hover:rotate-0 transition-all duration-500 bg-warm-200 dark:bg-secondary-800 transition-theme">
                                <img
                                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop"
                                    alt="Kumaon Craft Showcase"
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay Card */}
                                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/90 dark:bg-secondary-900/90 backdrop-blur-md border border-warm-100 dark:border-secondary-800 shadow-xl space-y-2 transition-theme">
                                    <div className="flex items-center gap-1.5 text-primary-500 dark:text-primary-400 font-bold text-xs uppercase tracking-wider transition-theme">
                                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>100% Direct Fair Trade</span>
                                    </div>
                                    <h4 className="font-serif text-lg font-bold text-secondary-800 dark:text-warm-100 transition-theme">Support Rural Livelihoods</h4>
                                    <p className="text-xs text-secondary-600 dark:text-warm-300 transition-theme">Proceeds flow directly back to home-based artisan guilds in Uttarakhand.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats Section */}
            <section id="why-kumaon" className="py-16 bg-white dark:bg-secondary-800/40 border-b border-warm-200 dark:border-secondary-800 transition-theme">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div className="space-y-1">
                            <div className="text-3xl sm:text-4xl font-extrabold text-primary-500 dark:text-primary-400 font-serif transition-theme">50+</div>
                            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary-600 dark:text-warm-300 transition-theme">Home Artisans</div>
                        </div>
                        <div className="space-y-1 border-l border-warm-200 dark:border-secondary-800 transition-theme">
                            <div className="text-3xl sm:text-4xl font-extrabold text-primary-500 dark:text-primary-400 font-serif transition-theme">4 Categories</div>
                            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary-600 dark:text-warm-300 transition-theme">Heritage Crafts</div>
                        </div>
                        <div className="space-y-1 border-l border-warm-200 dark:border-secondary-800 transition-theme">
                            <div className="text-3xl sm:text-4xl font-extrabold text-primary-500 dark:text-primary-400 font-serif transition-theme">0%</div>
                            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary-600 dark:text-warm-300 transition-theme">Middlemen Cuts</div>
                        </div>
                        <div className="space-y-1 border-l border-warm-200 dark:border-secondary-800 transition-theme">
                            <div className="text-3xl sm:text-4xl font-extrabold text-primary-500 dark:text-primary-400 font-serif transition-theme">100%</div>
                            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-secondary-600 dark:text-warm-300 transition-theme">Handmade Guarantee</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Digital Catalog Section */}
            <section id="catalog" className="py-24 bg-warm-50 dark:bg-secondary-900/30 flex-grow transition-theme">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-800 dark:text-warm-50 transition-theme">
                            Wholesale Digital Catalog
                        </h2>
                        <p className="text-sm text-secondary-700 dark:text-warm-200 transition-theme">
                            Browse our available catalog. Click 'Submit Inquiry' to get tailored shipping estimates, custom bulk prices, or customization options.
                        </p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl border border-warm-200 dark:border-secondary-700/60 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center transition-theme">
                        {/* Category Filter Tabs */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer transition-theme ${selectedCategory === category
                                            ? 'bg-secondary-800 dark:bg-primary-500 text-white shadow-md'
                                            : 'bg-warm-100 dark:bg-secondary-900 text-secondary-600 dark:text-warm-300 hover:bg-warm-200/60 dark:hover:bg-secondary-800'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products or artisans..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-warm-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-warm-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all transition-theme"
                            />
                            <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-secondary-500 dark:text-warm-300 transition-theme" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Notification Toast */}
                    {notification && (
                        <div className="fixed bottom-6 right-6 z-50 bg-secondary-800 text-white px-6 py-4 rounded-xl shadow-2xl border-l-4 border-primary-500 animate-slide-in flex items-center gap-3">
                            <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                            <p className="text-sm font-semibold">{notification}</p>
                        </div>
                    )}

                    {/* Product Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onInquire={handleInquirySubmit}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-secondary-800/80 rounded-2xl border border-warm-200 dark:border-secondary-700/60 space-y-3 transition-theme">
                            <div className="text-4xl">🍂</div>
                            <h3 className="font-serif text-xl font-bold text-secondary-800 dark:text-warm-100 transition-theme">No products found</h3>
                            <p className="text-sm text-secondary-600 dark:text-warm-300 max-w-md mx-auto transition-theme">
                                No crafts match your filter selection or search query. Try choosing another category or keyword.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Inquiry Count Floating Indicator */}
            {inquiriesCount > 0 && (
                <div className="fixed bottom-6 left-6 z-50 bg-white dark:bg-secondary-850 border border-warm-200 dark:border-secondary-700 px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2.5 text-xs font-bold text-secondary-800 dark:text-warm-100 transition-theme">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                    <span>{inquiriesCount} Inquiry Session Submitted</span>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Home;
