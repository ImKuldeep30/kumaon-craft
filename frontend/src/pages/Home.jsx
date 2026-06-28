import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [inquiriesCount, setInquiriesCount] = useState(0);
    const [notification, setNotification] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = ['All', 'Handloom', 'Copperware', 'Woodcraft', 'Aipan Art'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                let url = 'http://localhost:5000/api/products';
                const params = [];
                if (selectedCategory && selectedCategory !== 'All') {
                    params.push(`category=${selectedCategory}`);
                }
                if (searchQuery) {
                    params.push(`search=${encodeURIComponent(searchQuery)}`);
                }
                if (params.length > 0) {
                    url += `?${params.join('&')}`;
                }
                const response = await fetch(url);
                const result = await response.json();
                if (result.success) {
                    setProducts(result.data);
                    setError(null);
                } else {
                    setError(result.message || 'Failed to fetch products');
                }
            } catch (err) {
                setError('Could not connect to the database server');
            } finally {
                setIsLoading(false);
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [selectedCategory, searchQuery]);

    const handleInquirySubmit = async (product, details) => {
        try {
            const response = await fetch('http://localhost:5000/api/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    buyerName: details.name,
                    buyerEmail: details.email,
                    productName: product.name,
                    quantity: details.quantity,
                }),
            });
            const result = await response.json();
            if (result.success) {
                setInquiriesCount((prev) => prev + 1);
                setNotification(`Wholesale inquiry submitted for ${product.name}!`);
            } else {
                setNotification(`Error: ${result.message}`);
            }
        } catch (err) {
            setNotification('Error submitting inquiry. Check server status.');
        }
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
                                <Button
                                    href="#catalog"
                                    size="lg"
                                >
                                    Explore Digital Catalog
                                </Button>
                                <Button
                                    href="#why-kumaon"
                                    variant="outline"
                                    size="lg"
                                >
                                    Our Heritage Mission
                                </Button>
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
                    <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl border border-warm-200 dark:border-secondary-700/60 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center transition-theme">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    variant={selectedCategory === category ? 'primary' : 'ghost'}
                                    className={`px-5 py-2.5 rounded-full text-xs uppercase ${selectedCategory === category
                                            ? 'bg-secondary-800 dark:bg-primary-500 text-white shadow-md'
                                            : 'bg-warm-100 dark:bg-secondary-900 text-secondary-600 dark:text-warm-300 hover:bg-warm-200/60 dark:hover:bg-secondary-800'
                                        }`}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-80">
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products or artisans..."
                                className="w-full"
                                inputClassName="pl-10 rounded-full"
                            />
                            <svg className="absolute left-3.5 top-4 w-4 h-4 text-secondary-500 dark:text-warm-300 transition-theme" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>      </div>

                    <Toast
                        message={notification}
                        onClose={() => setNotification('')}
                    />

                    {/* Product Grid */}
                    {isLoading ? (
                        <div className="flex justify-center py-20 w-full col-span-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500 font-semibold bg-white dark:bg-secondary-800/80 rounded-2xl border border-warm-200 dark:border-secondary-700/60 transition-theme w-full col-span-full">
                            {error}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onInquire={handleInquirySubmit}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-secondary-800/80 rounded-2xl border border-warm-200 dark:border-secondary-700/60 space-y-3 transition-theme w-full col-span-full">
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
