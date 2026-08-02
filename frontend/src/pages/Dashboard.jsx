import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import ChatbotWidget from '../components/ChatbotWidget';
import { API_BASE_URL } from '../config';


const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: 'artisan@kumaon.org', role: 'artisan' });
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New product form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Handloom', price: '', minOrder: 10, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop' });
  const [notification, setNotification] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editProduct, setEditProduct] = useState({ _id: '', name: '', category: 'Handloom', price: '', minOrder: 10, image: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Buyer marketplace dashboard states
  const [buyerTab, setBuyerTab] = useState('catalog'); // 'catalog' | 'inquiries'
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('All');
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inquiryQty, setInquiryQty] = useState(10);

  // B2B transaction workflow states
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({ priceQuote: '', leadTime: '3 Weeks', shippingCost: '', artisanNotes: '' });
  const [showShipModal, setShowShipModal] = useState(false);
  const [shipData, setShipData] = useState({ trackingCode: '' });

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const session = localStorage.getItem('user_session');
      let token = '';
      if (session) {
        token = JSON.parse(session).token;
      }
      
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const resInq = await fetch(`${API_BASE_URL}/api/inquiries`, { headers });
      const dataInq = await resInq.json();
      if (dataInq.success) {
        setInquiries(dataInq.data);
      }

      const resProd = await fetch(`${API_BASE_URL}/api/products`, { headers });
      const dataProd = await resProd.json();
      if (dataProd.success) {
        setProducts(dataProd.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (!session) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(session);
    setUser(parsedUser);

    if (parsedUser.role === 'buyer') {
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    navigate('/login');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      setNotification("Validation Error: Please fill in Name, Price, and Upload an Image.");
      setTimeout(() => setNotification(''), 4000);
      return;
    }
    try {
      const session = localStorage.getItem('user_session');
      const token = session ? JSON.parse(session).token : '';
      
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProduct.name,
          category: newProduct.category,
          price: newProduct.price,
          minOrder: parseInt(newProduct.minOrder) || 10,
          artisan: artisanName,
          image: newProduct.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
          description: `Handcrafted ${newProduct.category} product listing published via dashboard panel.`
        }),
      });
      const result = await response.json();
      if (result.success) {
        setProducts([result.data, ...products]);
        setShowAddForm(false);
        setNewProduct({ name: '', category: 'Handloom', price: '', minOrder: 10, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop' });
        setNotification('New craft product added successfully!');
      } else {
        setNotification(`Error: ${result.message}`);
      }
    } catch (err) {
      setNotification('Error connecting to backend.');
    }
    setTimeout(() => setNotification(''), 4000);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setNotification("Error: Image size exceeds 2MB limit.");
        setTimeout(() => setNotification(''), 4000);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setNotification("Error: Image size exceeds 2MB limit.");
        setTimeout(() => setNotification(''), 4000);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProduct(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await executeDeleteProduct(productToDelete);
      setShowConfirmModal(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setProductToDelete(null);
  };

  const executeDeleteProduct = async (id) => {
    try {
      const session = localStorage.getItem('user_session');
      const token = session ? JSON.parse(session).token : '';
      
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setProducts(products.filter((p) => p._id !== id));
        setNotification('Product listing removed.');
      } else {
        setNotification(`Error: ${result.message}`);
      }
    } catch (err) {
      setNotification('Error removing product.');
    }
    setTimeout(() => setNotification(''), 4000);
  };

  const handleEditClick = (product) => {
    setEditProduct({
      _id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      minOrder: product.minOrder,
      image: product.image || ''
    });
    setShowEditForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProduct.name || !editProduct.price || !editProduct.image) {
      setNotification("Validation Error: Please fill in Name, Price, and Upload an Image.");
      setTimeout(() => setNotification(''), 4000);
      return;
    }
    try {
      const session = localStorage.getItem('user_session');
      const token = session ? JSON.parse(session).token : '';
      
      const response = await fetch(`${API_BASE_URL}/api/products/${editProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editProduct.name,
          category: editProduct.category,
          price: editProduct.price,
          minOrder: parseInt(editProduct.minOrder) || 10,
          image: editProduct.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
        }),
      });
      const result = await response.json();
      if (result.success) {
        setProducts(products.map((p) => p._id === editProduct._id ? result.data : p));
        setShowEditForm(false);
        setNotification('Craft product updated successfully!');
      } else {
        setNotification(`Error: ${result.message}`);
      }
    } catch (err) {
      setNotification('Error connecting to backend.');
    }
    setTimeout(() => setNotification(''), 4000);
  };

  const handleUpdateStatus = async (id, newStatus, extraData = {}) => {
    try {
      const session = localStorage.getItem('user_session');
      const token = session ? JSON.parse(session).token : '';
      
      const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, ...extraData }),
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

  const handleOpenQuoteModal = (inq) => {
    setSelectedInquiry(inq);
    const prod = products.find((p) => p.name === inq.productName);
    let defaultPrice = 0;
    if (prod) {
      const priceNum = parseInt(prod.price.replace(/[^0-9]/g, '')) || 0;
      defaultPrice = priceNum * inq.quantity;
    }
    setQuoteData({
      priceQuote: defaultPrice,
      leadTime: '3 Weeks',
      shippingCost: '1500',
      artisanNotes: ''
    });
    setShowQuoteModal(true);
  };

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    handleUpdateStatus(selectedInquiry._id, 'Quote Sent', {
      priceQuote: parseInt(quoteData.priceQuote) || 0,
      leadTime: quoteData.leadTime,
      shippingCost: parseInt(quoteData.shippingCost) || 0,
      artisanNotes: quoteData.artisanNotes
    });
    setShowQuoteModal(false);
  };

  const handleOpenShipModal = (inq) => {
    setSelectedInquiry(inq);
    setShipData({ trackingCode: '' });
    setShowShipModal(true);
  };

  const handleSubmitShip = (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    handleUpdateStatus(selectedInquiry._id, 'Shipped', {
      trackingCode: shipData.trackingCode
    });
    setShowShipModal(false);
  };

  // Helper to determine the artisan name
  const getArtisanName = () => {
    if (user.email === 'artisan@kumaon.org') {
      return 'Almora Weavers Guild';
    }
    return user.name || 'Himalayan Artisans';
  };
  
  const artisanName = getArtisanName();

  // Filter products by logged-in artisan name
  const myProducts = user.role === 'artisan'
    ? products.filter((p) => p.artisan && p.artisan.toLowerCase() === artisanName.toLowerCase())
    : [];

  // Filter inquiries related to products listed by the logged-in artisan
  const myInquiries = user.role === 'artisan'
    ? inquiries.filter((inq) => {
        const prod = products.find((p) => p.name === inq.productName);
        return prod && prod.artisan && prod.artisan.toLowerCase() === artisanName.toLowerCase();
      })
    : [];

  // Filter inquiries so buyers see only their own, while artisans see only their own products' inquiries.
  const displayedInquiries = user.role === 'artisan'
    ? myInquiries
    : inquiries.filter((inq) => inq.buyerEmail === user.email);

  // Dynamic estimate of total value for the artisan guild
  const calculateGuildValue = () => {
    let total = 0;
    displayedInquiries.forEach((inq) => {
      const prod = products.find((p) => p.name === inq.productName);
      if (prod) {
        const priceNum = parseInt(prod.price.replace(/[^0-9]/g, '')) || 0;
        total += priceNum * inq.quantity;
      }
    });
    return total > 0 ? (total >= 100000 ? `₹${(total / 100000).toFixed(1)}L` : `₹${(total / 1000).toFixed(0)}K`) : '₹0';
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      const session = localStorage.getItem('user_session');
      const token = session ? JSON.parse(session).token : '';
      
      const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          buyerName: user.name || 'Registered Buyer',
          buyerEmail: user.email,
          productName: selectedProduct.name,
          quantity: parseInt(inquiryQty) || selectedProduct.minOrder || 10,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setInquiries([result.data, ...inquiries]);
        setNotification(`Wholesale inquiry for "${selectedProduct.name}" submitted successfully!`);
        setShowInquiryModal(false);
      } else {
        setNotification(`Error: ${result.message}`);
      }
    } catch (err) {
      setNotification('Error submitting inquiry.');
    }
    setTimeout(() => setNotification(''), 4000);
  };

  const filteredCatalog = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                          p.artisan.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCategory = catalogCategory === 'All' || p.category === catalogCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      {/* Main Dashboard Panel */}
      <div className="flex-grow bg-warm-50 dark:bg-secondary-900/30 py-12 px-4 sm:px-6 lg:px-8 transition-theme">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header Banner */}
          <div className="bg-secondary-800 dark:bg-secondary-800/80 text-white rounded-3xl p-8 sm:p-10 shadow-xl border-b-4 border-primary-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden transition-theme">
            <div className="absolute inset-0 z-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-500 blur-xl" />
            </div>
            
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-200 dark:text-primary-300 bg-white/10 dark:bg-secondary-900/60 px-3 py-1.5 rounded-full transition-theme">
                {user.role === 'artisan' ? 'Artisan / Guild Admin Panel' : 'Wholesale Buyer Portal'}
              </span>
              <h1 className="font-serif text-3xl font-bold">
                {user.role === 'artisan' ? artisanName : 'Institutional Buyer Dashboard'}
              </h1>
              <p className="text-sm text-warm-200">
                Logged in as: <span className="font-semibold">{user.email}</span>
              </p>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/60 relative z-10"
            >
              Sign Out
            </Button>
          </div>

          {/* Toast Notification */}
          <Toast
            message={notification}
            onClose={() => setNotification('')}
            fixed={true}
            className="animate-fade-in"
          />

          {/* METRIC CARDS */}
          {user.role === 'artisan' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl border border-warm-200 dark:border-secondary-700/60 shadow-sm space-y-2 transition-theme">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 dark:text-warm-300/60 font-bold block transition-theme">Listed Products</span>
                <span className="text-3xl font-bold text-secondary-800 dark:text-warm-100 font-serif transition-theme">{myProducts.length} Items</span>
              </div>
              <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl border border-warm-200 dark:border-secondary-700/60 shadow-sm space-y-2 transition-theme">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 dark:text-warm-300/60 font-bold block transition-theme">Pending Inquiries</span>
                <span className="text-3xl font-bold text-primary-500 dark:text-primary-400 font-serif transition-theme">
                  {displayedInquiries.filter((i) => i.status === 'Pending Review').length} requests
                </span>
              </div>
              <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl border border-warm-200 dark:border-secondary-700/60 shadow-sm space-y-2 transition-theme">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 dark:text-warm-300/60 font-bold block transition-theme">Total Items Requested</span>
                <span className="text-3xl font-bold text-secondary-800 dark:text-warm-100 font-serif transition-theme">
                  {displayedInquiries.reduce((acc, inq) => acc + inq.quantity, 0)} units
                </span>
              </div>
              <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl border border-warm-200 dark:border-secondary-700/60 shadow-sm space-y-2 transition-theme">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 dark:text-warm-300/60 font-bold block transition-theme">Estimated Guild Value</span>
                <span className="text-3xl font-bold text-secondary-800 dark:text-warm-100 font-serif transition-theme">{calculateGuildValue()}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl border border-warm-200 dark:border-secondary-700/60 shadow-sm space-y-2 transition-theme">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 dark:text-warm-300/60 font-bold block transition-theme">Submitted Inquiries</span>
                <span className="text-3xl font-bold text-secondary-800 dark:text-warm-100 font-serif transition-theme">{displayedInquiries.length} Requests</span>
              </div>
              <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl border border-warm-200 dark:border-secondary-700/60 shadow-sm space-y-2 transition-theme">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 dark:text-warm-300/60 font-bold block transition-theme">Active Quotes Received</span>
                <span className="text-3xl font-bold text-primary-500 dark:text-primary-400 font-serif transition-theme">
                  {displayedInquiries.filter((i) => i.status === 'Quote Sent').length} Offers
                </span>
              </div>
              <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl border border-warm-200 dark:border-secondary-700/60 shadow-sm space-y-2 transition-theme">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 dark:text-warm-300/60 font-bold block transition-theme">Drafted Contracts</span>
                <span className="text-3xl font-bold text-secondary-800 dark:text-warm-100 font-serif transition-theme">
                  {displayedInquiries.filter((i) => i.status === 'In Discussion').length} Pending
                </span>
              </div>
            </div>
          )}

          {/* BUYER TAB SWITCHER */}
          {user.role === 'buyer' && (
            <div className="flex gap-4 border-b border-warm-200 dark:border-secondary-800 pb-4 mb-6">
              <button
                onClick={() => setBuyerTab('catalog')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  buyerTab === 'catalog'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-secondary-700/60'
                }`}
              >
                🛍️ Browse Available Catalog
              </button>
              <button
                onClick={() => setBuyerTab('inquiries')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  buyerTab === 'inquiries'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-warm-200 hover:bg-warm-100 dark:hover:bg-secondary-700/60'
                }`}
              >
                📋 Track Sourcing Inquiries ({displayedInquiries.length})
              </button>
            </div>
          )}

          {/* MAIN TABLES AND CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* INQUIRIES MANAGEMENT TABLE OR BUYER BROWSE MARKETPLACE */}
            <div className="lg:col-span-8">
              {user.role === 'buyer' && buyerTab === 'catalog' ? (
                <div className="space-y-6">
                  {/* SEARCH AND FILTERS */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-secondary-800/80 p-5 rounded-3xl border border-warm-200 dark:border-secondary-700/60 shadow-sm transition-theme">
                    <div className="w-full sm:w-72">
                      <Input
                        type="text"
                        placeholder="Search products or artisans..."
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        className="!py-2"
                      />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
                      {['All', 'Handloom', 'Copperware', 'Woodcraft', 'Aipan Art'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCatalogCategory(cat)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            catalogCategory === cat
                              ? 'bg-secondary-800 dark:bg-primary-500 text-white shadow-sm'
                              : 'bg-warm-100 dark:bg-secondary-900 text-secondary-600 dark:text-warm-300 hover:bg-warm-200/50 dark:hover:bg-secondary-750'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PRODUCTS GRID */}
                  {filteredCatalog.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredCatalog.map((prod) => (
                        <div key={prod._id} className="bg-white dark:bg-secondary-800/80 rounded-3xl border border-warm-200 dark:border-secondary-700/60 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                          <div className="relative aspect-video w-full overflow-hidden bg-warm-100 dark:bg-secondary-900">
                            <img
                              src={prod.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop'}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-4 left-4 bg-secondary-900/85 dark:bg-primary-500/90 text-white text-[9px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full shadow-sm">
                              {prod.category}
                            </span>
                          </div>
                          
                          <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase tracking-wider text-primary-600 dark:text-primary-400 font-extrabold">
                                By {prod.artisan}
                              </span>
                              <h4 className="font-serif font-bold text-secondary-800 dark:text-warm-100 text-base line-clamp-1">
                                {prod.name}
                              </h4>
                              <p className="text-xs text-secondary-500 dark:text-warm-300 line-clamp-2 leading-relaxed">
                                {prod.description || 'Premium heritage product handcrafted in the Kumaon region.'}
                              </p>
                            </div>
                            
                            <div className="pt-2 flex justify-between items-center border-t border-warm-100 dark:border-secondary-750">
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-secondary-400 font-semibold block">Wholesale Price</span>
                                <span className="text-sm font-bold text-secondary-800 dark:text-warm-100">{prod.price}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] uppercase tracking-wider text-secondary-400 font-semibold block">Min. Order</span>
                                <span className="text-sm font-bold text-secondary-800 dark:text-warm-100">{prod.minOrder} Units</span>
                              </div>
                            </div>
                            
                            <Button
                              onClick={() => {
                                setSelectedProduct(prod);
                                setInquiryQty(prod.minOrder || 10);
                                setShowInquiryModal(true);
                              }}
                              className="w-full mt-2"
                            >
                              Source & Send Inquiry
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-secondary-800/80 rounded-3xl border border-warm-200 dark:border-secondary-700/60 p-12 text-center space-y-3 shadow-sm transition-theme">
                      <span className="text-4xl block">🔍</span>
                      <h4 className="font-serif text-lg font-bold text-secondary-800 dark:text-warm-100">No matching crafts found</h4>
                      <p className="text-xs text-secondary-600 dark:text-warm-300 max-w-xs mx-auto leading-relaxed">
                        Try searching for a different item name or selecting another category.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-secondary-800/80 rounded-3xl border border-warm-200 dark:border-secondary-700/60 shadow-sm overflow-hidden transition-theme">
                  <div className="px-6 py-5 border-b border-warm-200 dark:border-secondary-700/60 flex justify-between items-center transition-theme">
                    <h2 className="font-serif text-xl font-bold text-secondary-800 dark:text-warm-100 transition-theme">
                      {user.role === 'artisan' ? 'Wholesale Inquiry Management' : 'Your Sourcing Inquiries'}
                    </h2>
                    <span className="px-2.5 py-1 bg-warm-100 dark:bg-secondary-900 text-secondary-700 dark:text-warm-200 text-xs font-bold rounded-full transition-theme">
                      {displayedInquiries.length} requests
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-warm-100/60 dark:bg-secondary-900/60 text-secondary-700 dark:text-warm-200 text-xs font-bold uppercase tracking-wider border-b border-warm-200 dark:border-secondary-700/60 transition-theme">
                          <th className="px-6 py-4">Buyer details</th>
                          <th className="px-6 py-4 font-semibold">Craft product</th>
                          <th className="px-6 py-4 text-center">Quantity</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-100 dark:divide-secondary-800 text-sm text-secondary-800 dark:text-warm-100 transition-theme">
                        {displayedInquiries.map((inq) => (
                          <tr key={inq._id} className="hover:bg-warm-50/50 dark:hover:bg-secondary-900/30 transition-colors duration-200">
                            <td className="px-6 py-4">
                              <div className="font-bold">{inq.buyerName}</div>
                              <div className="text-xs text-secondary-600/80 dark:text-warm-300/85">{inq.buyerEmail}</div>
                            </td>
                            <td className="px-6 py-4 font-serif font-semibold">
                              <div>{inq.productName}</div>
                              {inq.priceQuote > 0 && (
                                <div className="text-[11px] font-sans font-normal text-secondary-500 dark:text-warm-300 mt-1 space-y-0.5 transition-theme">
                                  <div className="text-secondary-800 dark:text-warm-100 font-bold">
                                    💰 Wholesale Quote: ₹{inq.priceQuote.toLocaleString()}
                                  </div>
                                  <div>⏱️ Est. Lead Time: {inq.leadTime}</div>
                                  <div>🚚 Cargo Shipping: ₹{inq.shippingCost}</div>
                                  {inq.artisanNotes && <div className="italic">📝 Remarks: "{inq.artisanNotes}"</div>}
                                </div>
                              )}
                              {inq.trackingCode && (
                                <div className="text-[11px] font-sans font-normal text-primary-600 dark:text-primary-400 mt-1 transition-theme">
                                  📦 Freight Cargo ID: <code className="bg-warm-100 dark:bg-secondary-900 px-1 py-0.5 rounded font-mono text-[10px]">{inq.trackingCode}</code>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center font-bold">{inq.quantity} units</td>
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
                                {inq.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              {user.role === 'artisan' ? (
                                <>
                                  {inq.status === 'Pending Review' && (
                                    <Button
                                      onClick={() => handleOpenQuoteModal(inq)}
                                      size="sm"
                                    >
                                      Send Quote
                                    </Button>
                                  )}
                                  {(inq.status === 'Quote Sent' || inq.status === 'In Discussion') && (
                                    <div className="flex flex-col items-end gap-1.5">
                                      {inq.status === 'Quote Sent' && (
                                        <Button
                                          onClick={() => handleUpdateStatus(inq._id, 'In Discussion')}
                                          variant="secondary"
                                          size="xs"
                                        >
                                          Discuss
                                        </Button>
                                      )}
                                      <Button
                                        onClick={() => handleOpenQuoteModal(inq)}
                                        variant="outline"
                                        size="xs"
                                        className="text-[10px] px-2 py-1"
                                      >
                                        ✏️ Edit Quote
                                      </Button>
                                    </div>
                                  )}
                                  {inq.status === 'Approved' && (
                                    <Button
                                      onClick={() => handleOpenShipModal(inq)}
                                      size="sm"
                                      className="!bg-indigo-600 hover:!bg-indigo-750 text-white"
                                    >
                                      🚀 Ship Order
                                    </Button>
                                  )}
                                  {inq.status === 'Shipped' && (
                                    <span className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold italic">Shipped</span>
                                  )}
                                  {inq.status === 'Completed' && (
                                    <span className="text-xs text-green-600 dark:text-green-400 font-bold">Completed ✓</span>
                                  )}
                                </>
                              ) : (
                                <>
                                  {(inq.status === 'Quote Sent' || inq.status === 'In Discussion') && (
                                    <Button
                                      onClick={() => handleUpdateStatus(inq._id, 'Approved')}
                                      size="sm"
                                      className="!bg-green-600 hover:!bg-green-700 text-white"
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
                                      className="!bg-green-500 hover:!bg-green-600 text-white"
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
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* ARTISAN PRODUCTS LIST OR BUYER RESOURCES */}
            <div className="lg:col-span-4 space-y-6">
              {user.role === 'artisan' ? (
                <div className="bg-white dark:bg-secondary-800/80 rounded-3xl border border-warm-200 dark:border-secondary-700/60 shadow-sm overflow-hidden p-6 space-y-6 transition-theme">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-lg font-bold text-secondary-800 dark:text-warm-100 transition-theme">Your Listed Crafts</h3>
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-lg p-0"
                    >
                      +
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {myProducts.map((p) => (
                      <div key={p._id} className="p-4 rounded-2xl border border-warm-200 dark:border-secondary-700 bg-warm-50/40 dark:bg-secondary-900/50 flex justify-between items-start gap-4 transition-theme">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-primary-600 dark:text-primary-400 font-bold transition-theme">{p.category}</span>
                          <h4 className="font-serif font-bold text-secondary-800 dark:text-warm-100 text-sm line-clamp-1 transition-theme">{p.name}</h4>
                          <div className="text-xs text-secondary-600 dark:text-warm-200 font-semibold transition-theme">{p.price}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditClick(p)}
                            variant="ghost"
                            className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 dark:hover:bg-secondary-800 rounded-lg cursor-pointer"
                          >
                            ✏️
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(p._id)}
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 dark:hover:bg-secondary-800 rounded-lg cursor-pointer"
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    ))}
                    {myProducts.length === 0 && (
                      <div className="text-center py-8 bg-warm-50/50 dark:bg-secondary-900/30 rounded-2xl border border-dashed border-warm-300 dark:border-secondary-750 p-4 transition-theme">
                        <span className="text-3xl block mb-2">🪵</span>
                        <h5 className="font-serif font-bold text-xs text-secondary-800 dark:text-warm-100">No crafts listed yet</h5>
                        <p className="text-[10px] text-secondary-500 dark:text-warm-300 leading-normal max-w-xs mx-auto mt-1">
                          Click the "+" button above to add your first handcrafted product to Kumaon Craft Connect.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-secondary-800/80 rounded-3xl border border-warm-200 dark:border-secondary-700/60 shadow-sm p-6 space-y-4 transition-theme">
                  <h3 className="font-serif text-lg font-bold text-secondary-800 dark:text-warm-100 transition-theme">Sourcing Guidelines</h3>
                  <div className="text-xs text-secondary-700 dark:text-warm-200 leading-relaxed space-y-3 transition-theme">
                    <p><strong>Lead Times:</strong> Traditional handlooms require 4-6 weeks for delivery depending on the bulk order yards requested.</p>
                    <p><strong>Custom Designs:</strong> Custom coloring and tribal borders can be weave-designed directly by contacting the guild leads.</p>
                    <p><strong>Quality Assurance:</strong> All items bear the certified "Craftmark India" emblem for handwoven/handmade authenticity.</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ADD PRODUCT MODAL / DIALOG */}
          {showAddForm && (
        <Modal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="List New Heritage Craft"
          subtitle="Artisan / Guild Admin Panel"
        >
          <form onSubmit={handleAddProduct} className="space-y-4">
            <Input
              label="Product Name"
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="e.g., Handpainted Aipan Puja Box"
              required
            />

            <Input
              label="Category"
              select
              value={newProduct.category}
              onChange={(e) => {
                const cat = e.target.value;
                let defaultImg = 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop';
                if (cat === 'Copperware') defaultImg = 'https://images.unsplash.com/photo-1576016770956-debb63d900bb?q=80&w=600&auto=format&fit=crop';
                if (cat === 'Woodcraft') defaultImg = 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=600&auto=format&fit=crop';
                if (cat === 'Aipan Art') defaultImg = 'https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=600&auto=format&fit=crop';
                setNewProduct({ ...newProduct, category: cat, image: defaultImg });
              }}
            >
              <option value="Handloom">Handloom</option>
              <option value="Copperware">Copperware</option>
              <option value="Woodcraft">Woodcraft</option>
              <option value="Aipan Art">Aipan Art</option>
            </Input>

            <div className="space-y-2">
              <span className="block text-xs uppercase tracking-wider text-secondary-600 dark:text-warm-300 font-bold transition-theme">
                Product Image
              </span>
              <div className="flex gap-4 items-center">
                {newProduct.image && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-warm-100 border border-warm-200 dark:border-secondary-750 shrink-0">
                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-grow">
                  <label 
                    htmlFor="image-upload-new" 
                    className="flex justify-center items-center px-4 py-3 border border-dashed border-warm-300 dark:border-secondary-700 rounded-xl cursor-pointer hover:bg-warm-100/40 dark:hover:bg-secondary-800 text-xs font-bold text-secondary-600 dark:text-warm-300 transition-colors w-full"
                  >
                    📁 Upload Local Photo (Max 2MB)
                  </label>
                  <input 
                    type="file" 
                    id="image-upload-new" 
                    accept="image/*" 
                    onChange={handleImageFileChange} 
                    className="hidden" 
                    required={!newProduct.image}
                  />
                </div>
              </div>
            </div>

            <Input
              label="Wholesale Pricing"
              type="text"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder="e.g., ₹2,200 / Unit"
              required
            />

            <Input
              label="Minimum Order Qty"
              type="number"
              min={1}
              value={newProduct.minOrder}
              onChange={(e) => setNewProduct({ ...newProduct, minOrder: parseInt(e.target.value) || 10 })}
              required
            />

            <Button
              type="submit"
              className="w-full mt-2"
            >
              Publish Listing
            </Button>
          </form>
        </Modal>
          )}

          {/* EDIT PRODUCT MODAL / DIALOG */}
          {showEditForm && (
            <Modal
              isOpen={showEditForm}
              onClose={() => setShowEditForm(false)}
              title="Edit Heritage Craft"
              subtitle="Artisan / Guild Admin Panel"
            >
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <Input
                  label="Product Name"
                  type="text"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  placeholder="e.g., Handpainted Aipan Puja Box"
                  required
                />

                <Input
                  label="Category"
                  select
                  value={editProduct.category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    let defaultImg = 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop';
                    if (cat === 'Copperware') defaultImg = 'https://images.unsplash.com/photo-1576016770956-debb63d900bb?q=80&w=600&auto=format&fit=crop';
                    if (cat === 'Woodcraft') defaultImg = 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=600&auto=format&fit=crop';
                    if (cat === 'Aipan Art') defaultImg = 'https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=600&auto=format&fit=crop';
                    setEditProduct({ ...editProduct, category: cat, image: defaultImg });
                  }}
                >
                  <option value="Handloom">Handloom</option>
                  <option value="Copperware">Copperware</option>
                  <option value="Woodcraft">Woodcraft</option>
                  <option value="Aipan Art">Aipan Art</option>
                </Input>

                <div className="space-y-2">
                  <span className="block text-xs uppercase tracking-wider text-secondary-600 dark:text-warm-300 font-bold transition-theme">
                    Product Image
                  </span>
                  <div className="flex gap-4 items-center">
                    {editProduct.image && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-warm-100 border border-warm-200 dark:border-secondary-750 shrink-0">
                        <img src={editProduct.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <label 
                        htmlFor="image-upload-edit" 
                        className="flex justify-center items-center px-4 py-3 border border-dashed border-warm-300 dark:border-secondary-700 rounded-xl cursor-pointer hover:bg-warm-100/40 dark:hover:bg-secondary-800 text-xs font-bold text-secondary-600 dark:text-warm-300 transition-colors w-full"
                      >
                        📁 Upload Local Photo (Max 2MB)
                      </label>
                      <input 
                        type="file" 
                        id="image-upload-edit" 
                        accept="image/*" 
                        onChange={handleEditImageFileChange} 
                        className="hidden" 
                        required={!editProduct.image}
                      />
                    </div>
                  </div>
                </div>

                <Input
                  label="Wholesale Pricing"
                  type="text"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                  placeholder="e.g., ₹2,200 / Unit"
                  required
                />

                <Input
                  label="Minimum Order Qty"
                  type="number"
                  min={1}
                  value={editProduct.minOrder}
                  onChange={(e) => setEditProduct({ ...editProduct, minOrder: parseInt(e.target.value) || 10 })}
                  required
                />

                <Button
                  type="submit"
                  className="w-full mt-2"
                >
                  Update Listing
                </Button>
              </form>
            </Modal>
          )}

          {/* CUSTOM CONFIRM DELETE MODAL */}
          {showConfirmModal && (
            <Modal
              isOpen={showConfirmModal}
              onClose={handleCancelDelete}
              title="Confirm Listing Removal"
              subtitle="Artisan / Guild Admin Panel"
            >
              <div className="space-y-6 text-center py-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl font-bold shadow-sm animate-pulse">
                  ⚠️
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-secondary-800 dark:text-warm-100">
                    Are you absolutely sure?
                  </h3>
                  <p className="text-xs text-secondary-600 dark:text-warm-300 max-w-sm mx-auto leading-relaxed">
                    This action will permanently delete this heritage craft listing from the public wholesale catalog. This process cannot be undone.
                  </p>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button
                    onClick={handleCancelDelete}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmDelete}
                    className="flex-1 !bg-red-500 hover:!bg-red-600 hover:shadow-lg transition-all duration-300 text-white"
                  >
                    Yes, Delete
                  </Button>
                </div>
              </div>
            </Modal>
          )}

          {/* BUYER SEND INQUIRY MODAL */}
          {showInquiryModal && selectedProduct && (
            <Modal
              isOpen={showInquiryModal}
              onClose={() => setShowInquiryModal(false)}
              title="Send Wholesale Inquiry"
              subtitle={`Product: ${selectedProduct.name}`}
            >
              <form onSubmit={handleSendInquiry} className="space-y-5">
                <div className="flex gap-4 items-center p-3 rounded-2xl bg-warm-50/40 dark:bg-secondary-900/60 border border-warm-200 dark:border-secondary-750">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-16 h-16 rounded-xl object-cover shadow-sm"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-secondary-800 dark:text-warm-100 leading-snug">{selectedProduct.name}</h4>
                    <span className="text-[10px] text-primary-500 font-bold uppercase tracking-wider block mt-0.5">Min. Order: {selectedProduct.minOrder} Units</span>
                  </div>
                </div>

                <Input
                  label="Wholesale Buyer Email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-warm-100/50 dark:bg-secondary-850 opacity-80 cursor-not-allowed"
                />

                <Input
                  label="Target Purchase Quantity (Units)"
                  type="number"
                  min={selectedProduct.minOrder || 1}
                  value={inquiryQty}
                  onChange={(e) => setInquiryQty(parseInt(e.target.value) || selectedProduct.minOrder)}
                  required
                />

                <div className="pt-2 flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Submit Sourcing Request
                  </Button>
                </div>
              </form>
            </Modal>
          )}

          {/* ARTISAN SEND/EDIT QUOTE MODAL */}
          {showQuoteModal && selectedInquiry && (
            <Modal
              isOpen={showQuoteModal}
              onClose={() => setShowQuoteModal(false)}
              title="Formulate Wholesale Quote"
              subtitle={`Product: ${selectedInquiry.productName}`}
            >
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <Input
                  label="Proposed Price Quote (₹ Total Value)"
                  type="number"
                  min={1}
                  value={quoteData.priceQuote}
                  onChange={(e) => setQuoteData({ ...quoteData, priceQuote: e.target.value })}
                  required
                />
                <Input
                  label="Estimated Production & Delivery Lead Time"
                  type="text"
                  value={quoteData.leadTime}
                  onChange={(e) => setQuoteData({ ...quoteData, leadTime: e.target.value })}
                  placeholder="e.g., 3 Weeks, 45 Days"
                  required
                />
                <Input
                  label="Est. Shipping & Freight Cost (₹)"
                  type="number"
                  min={0}
                  value={quoteData.shippingCost}
                  onChange={(e) => setQuoteData({ ...quoteData, shippingCost: e.target.value })}
                  required
                />
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-secondary-700 dark:text-warm-200 uppercase tracking-wider transition-theme">
                    Special Remarks / Note to Buyer
                  </label>
                  <textarea
                    value={quoteData.artisanNotes}
                    onChange={(e) => setQuoteData({ ...quoteData, artisanNotes: e.target.value })}
                    placeholder="Provide details on customization options, material certifications, or freight details..."
                    className="w-full min-h-[80px] p-3 text-sm rounded-xl border border-warm-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-warm-50 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setShowQuoteModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Submit Quote
                  </Button>
                </div>
              </form>
            </Modal>
          )}

          {/* ARTISAN SHIP CARGO MODAL */}
          {showShipModal && selectedInquiry && (
            <Modal
              isOpen={showShipModal}
              onClose={() => setShowShipModal(false)}
              title="Dispatch & Ship Wholesale Cargo"
              subtitle={`Product: ${selectedInquiry.productName}`}
            >
              <form onSubmit={handleSubmitShip} className="space-y-4">
                <Input
                  label="Freight / Cargo Tracking ID"
                  type="text"
                  value={shipData.trackingCode}
                  onChange={(e) => setShipData({ ...shipData, trackingCode: e.target.value })}
                  placeholder="e.g., Delhivery Cargo ID #98231, IndiaPost RR823192"
                  required
                />
                <div className="pt-2 flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setShowShipModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 !bg-indigo-600 hover:!bg-indigo-750 text-white"
                  >
                    Confirm Dispatch
                  </Button>
                </div>
              </form>
            </Modal>
          )}

        </div>
      </div>

      <ChatbotWidget />
      <Footer />
    </div>
  );
};

export default Dashboard;
