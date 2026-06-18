import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MOCK_INQUIRIES = [
  {
    id: 101,
    buyerName: 'FabIndia Sourcing Dept',
    buyerEmail: 'procurement@fabindia.com',
    productName: 'Panchachuli Handspun Tweed Woolen Fabric',
    quantity: 60,
    date: '2026-06-15',
    status: 'Pending Review'
  },
  {
    id: 102,
    buyerName: 'Organic Weaves Mumbai',
    buyerEmail: 'hello@organicweaves.in',
    productName: 'Wild Himalayan Giant Nettle Scarf',
    quantity: 45,
    date: '2026-06-12',
    status: 'Quote Sent'
  },
  {
    id: 103,
    buyerName: 'Craft & Heritage Boutique NYC',
    buyerEmail: 'imports@craftheritage.org',
    productName: 'Likhai Hand-Carved Wooden Wall Panel',
    quantity: 8,
    date: '2026-06-10',
    status: 'In Discussion'
  }
];

const MOCK_ARTISAN_PRODUCTS = [
  { id: 1, name: 'Panchachuli Handspun Tweed Woolen Fabric', category: 'Handloom', price: '₹2,400 / Meter', minOrder: 15 },
  { id: 5, name: 'Wild Himalayan Giant Nettle (Kandali) Scarf', category: 'Handloom', price: '₹1,850 / Unit', minOrder: 15 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: 'artisan@kumaon.org', role: 'artisan' });
  const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);
  const [products, setProducts] = useState(MOCK_ARTISAN_PRODUCTS);
  
  // New product form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Handloom', price: '', minOrder: 10 });
  const [notification, setNotification] = useState('');

  useEffect(() => {
    // Load session if exists
    const session = localStorage.getItem('user_session');
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    navigate('/login');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert("Please fill in the Product Name and Price.");
      return;
    }
    const createdProduct = {
      id: Date.now(),
      ...newProduct,
      minOrder: parseInt(newProduct.minOrder) || 10
    };
    setProducts([createdProduct, ...products]);
    setShowAddForm(false);
    setNewProduct({ name: '', category: 'Handloom', price: '', minOrder: 10 });
    setNotification('New craft product added successfully!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to remove this product listing?")) {
      setProducts(products.filter((p) => p.id !== id));
      setNotification('Product listing removed.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    setInquiries(inquiries.map((inq) => inq.id === id ? { ...inq, status: newStatus } : inq));
    setNotification(`Inquiry status updated to "${newStatus}"`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      {/* Main Dashboard Panel */}
      <div className="flex-grow bg-warm-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header Banner */}
          <div className="bg-secondary-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl border-b-4 border-primary-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-500 blur-xl" />
            </div>
            
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-200 bg-white/10 px-3 py-1.5 rounded-full">
                {user.role === 'artisan' ? 'Artisan / Guild Admin Panel' : 'Wholesale Buyer Portal'}
              </span>
              <h1 className="font-serif text-3xl font-bold">
                {user.role === 'artisan' ? 'Almora Weavers Guild' : 'Institutional Buyer Dashboard'}
              </h1>
              <p className="text-sm text-warm-200">
                Logged in as: <span className="font-semibold">{user.email}</span>
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/60 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 relative z-10"
            >
              Sign Out
            </button>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className="bg-secondary-800 text-white px-6 py-4 rounded-xl shadow-xl border-l-4 border-primary-500 animate-fade-in flex items-center gap-3">
              <span className="text-primary-500 text-base">✓</span>
              <p className="text-xs sm:text-sm font-semibold">{notification}</p>
            </div>
          )}

          {/* METRIC CARDS */}
          {user.role === 'artisan' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 font-bold block">Listed Products</span>
                <span className="text-3xl font-bold text-secondary-800 font-serif">{products.length} Items</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 font-bold block">Pending Inquiries</span>
                <span className="text-3xl font-bold text-primary-500 font-serif">
                  {inquiries.filter((i) => i.status === 'Pending Review').length} requests
                </span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 font-bold block">Total Items Requested</span>
                <span className="text-3xl font-bold text-secondary-800 font-serif">
                  {inquiries.reduce((acc, inq) => acc + inq.quantity, 0)} units
                </span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 font-bold block">Estimated Guild Value</span>
                <span className="text-3xl font-bold text-secondary-800 font-serif">₹2.8L+</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 font-bold block">Submitted Inquiries</span>
                <span className="text-3xl font-bold text-secondary-800 font-serif">4 Requests</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 font-bold block">Active Quotes Received</span>
                <span className="text-3xl font-bold text-primary-500 font-serif">2 Offers</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-sm space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 font-bold block">Drafted Contracts</span>
                <span className="text-3xl font-bold text-secondary-800 font-serif">1 Pending</span>
              </div>
            </div>
          )}

          {/* MAIN TABLES AND CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* INQUIRIES MANAGEMENT TABLE */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-warm-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-warm-200 flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold text-secondary-800">
                  {user.role === 'artisan' ? 'Wholesale Inquiry Management' : 'Your Sourcing Inquiries'}
                </h2>
                <span className="px-2.5 py-1 bg-warm-100 text-secondary-700 text-xs font-bold rounded-full">
                  {inquiries.length} requests
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-warm-100/60 text-secondary-700 text-xs font-bold uppercase tracking-wider border-b border-warm-200">
                      <th className="px-6 py-4">Buyer details</th>
                      <th className="px-6 py-4">Craft product</th>
                      <th className="px-6 py-4 text-center">Quantity</th>
                      <th className="px-6 py-4">Status</th>
                      {user.role === 'artisan' && <th className="px-6 py-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-100 text-sm text-secondary-800">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-warm-50/50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="font-bold">{inq.buyerName}</div>
                          <div className="text-xs text-secondary-600/80">{inq.buyerEmail}</div>
                        </td>
                        <td className="px-6 py-4 font-serif font-semibold">{inq.productName}</td>
                        <td className="px-6 py-4 text-center font-bold">{inq.quantity} units</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            inq.status === 'Pending Review'
                              ? 'bg-orange-50 text-orange-600 border border-orange-200'
                              : inq.status === 'Quote Sent'
                              ? 'bg-blue-50 text-blue-600 border border-blue-200'
                              : 'bg-green-50 text-green-600 border border-green-200'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        {user.role === 'artisan' && (
                          <td className="px-6 py-4 text-right space-x-2">
                            {inq.status === 'Pending Review' && (
                              <button
                                onClick={() => handleUpdateStatus(inq.id, 'Quote Sent')}
                                className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-xs font-bold transition-all"
                              >
                                Send Quote
                              </button>
                            )}
                            {inq.status === 'Quote Sent' && (
                              <button
                                onClick={() => handleUpdateStatus(inq.id, 'In Discussion')}
                                className="px-3 py-1.5 bg-secondary-700 hover:bg-secondary-800 text-white rounded-lg text-xs font-bold transition-all"
                              >
                                Discuss
                              </button>
                            )}
                            {inq.status === 'In Discussion' && (
                              <span className="text-xs text-secondary-600/60 font-semibold italic">Negotiating...</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ARTISAN PRODUCTS LIST OR BUYER RESOURCES */}
            <div className="lg:col-span-4 space-y-6">
              {user.role === 'artisan' ? (
                <div className="bg-white rounded-3xl border border-warm-200 shadow-sm overflow-hidden p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-lg font-bold text-secondary-800">Your Listed Crafts</h3>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="w-8 h-8 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-md hover:scale-105 transition-all"
                    >
                      +
                    </button>
                  </div>

                  <div className="space-y-4">
                    {products.map((p) => (
                      <div key={p.id} className="p-4 rounded-2xl border border-warm-200 bg-warm-50/40 flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-primary-600 font-bold">{p.category}</span>
                          <h4 className="font-serif font-bold text-secondary-800 text-sm line-clamp-1">{p.name}</h4>
                          <div className="text-xs text-secondary-600 font-semibold">{p.price}</div>
                        </div>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-warm-200 shadow-sm p-6 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-secondary-800">Sourcing Guidelines</h3>
                  <div className="text-xs text-secondary-700 leading-relaxed space-y-3">
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-800/60 backdrop-blur-sm">
              <div className="bg-warm-50 rounded-2xl max-w-md w-full shadow-2xl border border-warm-200 overflow-hidden">
                <div className="bg-secondary-700 text-white p-6 flex justify-between items-center">
                  <h3 className="font-serif text-xl font-bold">List New Heritage Craft</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1">Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g., Handpainted Aipan Puja Box"
                      className="w-full px-4 py-2.5 rounded-xl border border-warm-300 bg-white text-secondary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-warm-300 bg-white text-secondary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    >
                      <option value="Handloom">Handloom</option>
                      <option value="Copperware">Copperware</option>
                      <option value="Woodcraft">Woodcraft</option>
                      <option value="Aipan Art">Aipan Art</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1">Wholesale Pricing</label>
                    <input
                      type="text"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="e.g., ₹2,200 / Unit"
                      className="w-full px-4 py-2.5 rounded-xl border border-warm-300 bg-white text-secondary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary-700 uppercase tracking-wider mb-1">Minimum Order Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={newProduct.minOrder}
                      onChange={(e) => setNewProduct({ ...newProduct, minOrder: parseInt(e.target.value) || 10 })}
                      className="w-full px-4 py-2.5 rounded-xl border border-warm-300 bg-white text-secondary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-md"
                  >
                    Publish Listing
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
