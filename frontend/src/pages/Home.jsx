import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';
import ChatbotWidget from '../components/ChatbotWidget';
import { API_BASE_URL } from '../config';

const Home = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [inquiriesCount, setInquiriesCount] = useState(0);
    const [notification, setNotification] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [inquiries, setInquiries] = useState([]);
    const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'history'

    const categories = ['All', 'Handloom', 'Copperware', 'Woodcraft', 'Aipan Art'];

    useEffect(() => {
        const session = localStorage.getItem('user_session');
        const loggedIn = !!session;
        setIsLoggedIn(loggedIn);

        if (loggedIn) {
            const parsedSession = JSON.parse(session);
            setUserRole(parsedSession.role);

            if (parsedSession.role === 'artisan') {
                navigate('/dashboard');
                return;
            }

            const fetchInquiries = async () => {
                try {
                    const token = parsedSession.token;
                    const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const result = await response.json();
                    if (result.success) {
                        setInquiries(result.data);
                    }
                } catch (err) {
                    console.error("Error loading inquiries history", err);
                }
            };
            fetchInquiries();
        }
    }, [navigate]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const session = localStorage.getItem('user_session');
            const token = session ? JSON.parse(session).token : '';

            const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const result = await response.json();
            if (result.success) {
                setInquiries(inquiries.map((inq) => inq._id === id ? { ...inq, ...result.data } : inq));
                setNotification(`Order transaction updated successfully!`);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (err) {
            alert('Error updating status.');
        }
        setTimeout(() => setNotification(''), 3000);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                let url = `${API_BASE_URL}/api/products`;
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
            const session = localStorage.getItem('user_session');
            const token = session ? JSON.parse(session).token : '';

            const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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
                setInquiries((prev) => [result.data, ...prev]);
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

            {/* Hero Section - Only shown when user is not logged in */}
            {!isLoggedIn && (
                <>
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
                </>
            )}

            {/* Digital Catalog Section */}
            {userRole !== 'artisan' && (
                <section id="catalog" className={`${isLoggedIn ? 'pt-10 pb-24' : 'py-24'} bg-warm-50 dark:bg-secondary-900/30 flex-grow transition-theme`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    
                    {/* Buyer Navigation Tab Bar */}
                    {isLoggedIn && (
                        <div className="flex gap-4 border-b border-warm-200 dark:border-secondary-800 pb-4 justify-center sm:justify-start">
                            <button
                                onClick={() => setActiveTab('catalog')}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                                    activeTab === 'catalog'
                                        ? 'bg-primary-500 text-white shadow-md animate-fade-in'
                                        : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-secondary-750'
                                }`}
                            >
                                🛍️ Explore Crafts Catalog
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                                    activeTab === 'history'
                                        ? 'bg-primary-500 text-white shadow-md animate-fade-in'
                                        : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-secondary-750'
                                }`}
                            >
                                📋 My Sourcing History ({inquiries.filter(i => i.buyerEmail === JSON.parse(localStorage.getItem('user_session'))?.email).length})
                            </button>
                        </div>
                    )}

                    {(!isLoggedIn || activeTab === 'catalog') ? (
                        <>
                            {/* Header */}
                            <div className="text-center space-y-4 max-w-2xl mx-auto">
                                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-800 dark:text-warm-50 transition-theme">
                                    Wholesale Digital Catalog
                                </h2>
                                <p className="text-sm text-secondary-700 dark:text-warm-200 transition-theme">
                                    Browse our available catalog. Click 'Submit Inquiry' to get tailored shipping estimates, custom bulk prices, or customization options.
                                </p>
                            </div>
                            
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
                            </div>

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
                                    {products.map((product) => {
                                        const hasActive = inquiries.some(
                                            (inq) => 
                                                inq.productName === product.name && 
                                                ['Pending Review', 'Quote Sent', 'In Discussion'].includes(inq.status)
                                        );
                                        return (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                                hasActiveInquiry={hasActive}
                                                onInquire={handleInquirySubmit}
                                            />
                                        );
                                    })}
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
                        </>
                    ) : (
                        /* Sourcing History Table */
                        <div className="bg-white dark:bg-secondary-800/80 rounded-3xl border border-warm-200 dark:border-secondary-700/60 shadow-sm overflow-hidden transition-theme animate-fade-in">
                            <div className="px-6 py-5 border-b border-warm-200 dark:border-secondary-700/60 flex justify-between items-center transition-theme">
                                <h3 className="font-serif text-xl font-bold text-secondary-800 dark:text-warm-100">
                                    Your Submitted Inquiries
                                </h3>
                                <span className="px-2.5 py-1 bg-warm-100 dark:bg-secondary-900 text-secondary-700 dark:text-warm-200 text-xs font-bold rounded-full">
                                    {inquiries.filter(i => i.buyerEmail === JSON.parse(localStorage.getItem('user_session'))?.email).length} requests
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-warm-100/60 dark:bg-secondary-900/60 text-secondary-700 dark:text-warm-200 text-xs font-bold uppercase tracking-wider border-b border-warm-200 dark:border-secondary-700/60 transition-theme">
                                            <th className="px-6 py-4">Craft product</th>
                                            <th className="px-6 py-4 text-center">Quantity</th>
                                            <th className="px-6 py-4">Date submitted</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-warm-100 dark:divide-secondary-800 text-sm text-secondary-800 dark:text-warm-100 transition-theme">
                                        {inquiries
                                            .filter(i => i.buyerEmail === JSON.parse(localStorage.getItem('user_session'))?.email)
                                            .map((inq) => (
                                                <tr key={inq._id} className="hover:bg-warm-50/50 dark:hover:bg-secondary-900/30 transition-colors duration-200">
                                                    <td className="px-6 py-4 font-serif font-semibold">
                                                        <div>{inq.productName}</div>
                                                        {inq.priceQuote > 0 && (
                                                            <div className="text-[11px] font-sans font-normal text-secondary-500 dark:text-warm-300 mt-1 space-y-0.5 transition-theme">
                                                                <div className="text-secondary-800 dark:text-warm-100 font-bold">
                                                                    💰 Wholesale Quote: ₹{inq.priceQuote.toLocaleString()}
                                                                </div>
                                                                <div>⏱️ Est. Lead Time: {inq.leadTime}</div>
                                                                <div>🚚 Cargo Shipping: ₹{inq.shippingCost}</div>
                                                                {inq.artisanNotes && <div className="italic font-light">Remarks: "{inq.artisanNotes}"</div>}
                                                            </div>
                                                        )}
                                                        {inq.trackingCode && (
                                                            <div className="text-[11px] font-sans font-normal text-primary-600 dark:text-primary-400 mt-1 transition-theme">
                                                                📦 Freight Cargo ID: <code className="bg-warm-100 dark:bg-secondary-900 px-1 py-0.5 rounded font-mono text-[10px]">{inq.trackingCode}</code>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-bold">{inq.quantity} units</td>
                                                    <td className="px-6 py-4 text-secondary-600/80 dark:text-warm-300/80">
                                                        {new Date(inq.createdAt || Date.now()).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                                            inq.status === 'Pending Review'
                                                                ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50'
                                                                : inq.status === 'Quote Sent'
                                                                ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50'
                                                                : inq.status === 'In Discussion'
                                                                ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50'
                                                                : inq.status === 'Approved'
                                                                ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50'
                                                                : inq.status === 'Shipped'
                                                                ? 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900/50'
                                                                : 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/50'
                                                        }`}>
                                                            {inq.status || 'Pending Review'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        {(inq.status === 'Quote Sent' || inq.status === 'In Discussion') && (
                                                            <Button
                                                                onClick={() => handleUpdateStatus(inq._id, 'Approved')}
                                                                size="sm"
                                                                className="!bg-green-600 hover:!bg-green-700 text-white inline-block"
                                                            >
                                                                ✔️ Approve & Pay
                                                            </Button>
                                                        )}
                                                        {inq.status === 'Approved' && (
                                                            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold italic">In Production...</span>
                                                        )}
                                                        {inq.status === 'Shipped' && (
                                                            <Button
                                                                onClick={() => handleUpdateStatus(inq._id, 'Completed')}
                                                                size="sm"
                                                                className="!bg-green-500 hover:!bg-green-600 text-white inline-block"
                                                            >
                                                                🤝 Confirm Delivery
                                                            </Button>
                                                        )}
                                                        {inq.status === 'Completed' && (
                                                            <span className="text-xs text-green-600 dark:text-green-400 font-bold">Completed ✓</span>
                                                        )}
                                                        {inq.status === 'Pending Review' && (
                                                            <span className="text-xs text-secondary-400 italic">Awaiting Quote</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        {inquiries.filter(i => i.buyerEmail === JSON.parse(localStorage.getItem('user_session'))?.email).length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-secondary-500">
                                                    No wholesale inquiries submitted yet. Explore our catalog above to make requests!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    </div>
                </section>
            )}

            {/* Inquiry Count Floating Indicator */}
            {inquiriesCount > 0 && (
                <div className="fixed bottom-6 left-6 z-50 bg-white dark:bg-secondary-850 border border-warm-200 dark:border-secondary-700 px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2.5 text-xs font-bold text-secondary-800 dark:text-warm-100 transition-theme">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                    <span>{inquiriesCount} Inquiry Session Submitted</span>
                </div>
            )}

            <ChatbotWidget />
            <Footer />
        </div>
    );
};

export default Home;
