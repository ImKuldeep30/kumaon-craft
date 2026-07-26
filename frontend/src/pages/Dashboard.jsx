import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import ChatbotWidget from '../components/ChatbotWidget';


const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: 'artisan@kumaon.org', role: 'artisan' });
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New product form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Handloom', price: '', minOrder: 10 });
  const [notification, setNotification] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editProduct, setEditProduct] = useState({ _id: '', name: '', category: 'Handloom', price: '', minOrder: 10 });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const session = localStorage.getItem('user_session');
      let token = '';
      if (session) {
        token = JSON.parse(session).token;
      }
      
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const resInq = await fetch('http://localhost:5000/api/inquiries', { headers });
      const dataInq = await resInq.json();
      if (dataInq.success) {
        setInquiries(dataInq.data);
      }

      const resProd = await fetch('http://localhost:5000/api/products', { headers });
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
    if (session) {
      setUser(JSON.parse(session));
    }
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    navigate('/login');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      setNotification("Validation Error: Please fill in the Product Name and Price.");
      setTimeout(() => setNotification(''), 4000);
      return;
    }
    try {
      const session = localStorage.getItem('user_session');
      const token = session ? JSON.parse(session).token : '';
      
      const response = await fetch('http://localhost:5000/api/products', {
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
          artisan: user.email === 'artisan@kumaon.org' ? 'Almora Weavers Guild' : 'Himalayan Artisans',
          image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
          description: `Handcrafted ${newProduct.category} product listing published via dashboard panel.`
        }),
      });
      const result = await response.json();
      if (result.success) {
        setProducts([result.data, ...products]);
        setShowAddForm(false);
        setNewProduct({ name: '', category: 'Handloom', price: '', minOrder: 10 });
        setNotification('New craft product added successfully!');
      } else {
        setNotification(`Error: ${result.message}`);
      }
    } catch (err) {
      setNotification('Error connecting to backend.');
    }
    setTimeout(() => setNotification(''), 4000);
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
      
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
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
      minOrder: product.minOrder
    });
    setShowEditForm(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProduct.name || !editProduct.price) {
      setNotification("Validation Error: Please fill in the Product Name and Price.");
      setTimeout(() => setNotification(''), 4000);
      return;
    }
    try {
      const session = localStorage.getItem('user_session');
      const token = session ? JSON.parse(session).token : '';
      
      const response = await fetch(`http://localhost:5000/api/products/${editProduct._id}`, {
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

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const session = localStorage.getItem('user_session');
      const token = session ? JSON.parse(session).token : '';
      
      const response = await fetch(`http://localhost:5000/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (result.success) {
        setInquiries(inquiries.map((inq) => inq._id === id ? { ...inq, status: newStatus } : inq));
        setNotification(`Inquiry status updated to "${newStatus}"`);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      alert('Error updating status.');
    }
    setTimeout(() => setNotification(''), 3000);
  };

  // Filter inquiries so buyers see only their own, while artisans see all.
  const displayedInquiries = user.role === 'artisan'
    ? inquiries
    : inquiries.filter((inq) => inq.buyerEmail === user.email);

  // Dynamic estimate of total value for the artisan guild
  const calculateGuildValue = () => {
    let total = 0;
    inquiries.forEach((inq) => {
      const prod = products.find((p) => p.name === inq.productName);
      if (prod) {
        const priceNum = parseInt(prod.price.replace(/[^0-9]/g, '')) || 0;
        total += priceNum * inq.quantity;
      }
    });
    return total > 0 ? (total >= 100000 ? `₹${(total / 100000).toFixed(1)}L` : `₹${(total / 1000).toFixed(0)}K`) : '₹2.8L+';
  };

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
                {user.role === 'artisan' ? 'Almora Weavers Guild' : 'Institutional Buyer Dashboard'}
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
                <span className="text-3xl font-bold text-secondary-800 dark:text-warm-100 font-serif transition-theme">{products.length} Items</span>
              </div>
              <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl border border-warm-200 dark:border-secondary-700/60 shadow-sm space-y-2 transition-theme">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 dark:text-warm-300/60 font-bold block transition-theme">Pending Inquiries</span>
                <span className="text-3xl font-bold text-primary-500 dark:text-primary-400 font-serif transition-theme">
                  {inquiries.filter((i) => i.status === 'Pending Review').length} requests
                </span>
              </div>
              <div className="bg-white dark:bg-secondary-800/80 p-6 rounded-2xl border border-warm-200 dark:border-secondary-700/60 shadow-sm space-y-2 transition-theme">
                <span className="text-[10px] uppercase tracking-wider text-secondary-600/60 dark:text-warm-300/60 font-bold block transition-theme">Total Items Requested</span>
                <span className="text-3xl font-bold text-secondary-800 dark:text-warm-100 font-serif transition-theme">
                  {inquiries.reduce((acc, inq) => acc + inq.quantity, 0)} units
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

          {/* MAIN TABLES AND CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* INQUIRIES MANAGEMENT TABLE */}
            <div className="lg:col-span-8 bg-white dark:bg-secondary-800/80 rounded-3xl border border-warm-200 dark:border-secondary-700/60 shadow-sm overflow-hidden transition-theme">
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
                      <th className="px-6 py-4">Craft product</th>
                      <th className="px-6 py-4 text-center">Quantity</th>
                      <th className="px-6 py-4">Status</th>
                      {user.role === 'artisan' && <th className="px-6 py-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-100 dark:divide-secondary-800 text-sm text-secondary-800 dark:text-warm-100 transition-theme">
                    {displayedInquiries.map((inq) => (
                      <tr key={inq._id} className="hover:bg-warm-50/50 dark:hover:bg-secondary-900/30 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="font-bold">{inq.buyerName}</div>
                          <div className="text-xs text-secondary-600/80 dark:text-warm-300/85">{inq.buyerEmail}</div>
                        </td>
                        <td className="px-6 py-4 font-serif font-semibold">{inq.productName}</td>
                        <td className="px-6 py-4 text-center font-bold">{inq.quantity} units</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            inq.status === 'Pending Review'
                              ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50'
                              : inq.status === 'Quote Sent'
                              ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50'
                              : 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/50'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        {user.role === 'artisan' && (
                          <td className="px-6 py-4 text-right space-x-2">
                            {inq.status === 'Pending Review' && (
                              <Button
                                onClick={() => handleUpdateStatus(inq._id, 'Quote Sent')}
                                size="sm"
                              >
                                Send Quote
                              </Button>
                            )}
                            {inq.status === 'Quote Sent' && (
                              <Button
                                onClick={() => handleUpdateStatus(inq._id, 'In Discussion')}
                                variant="secondary"
                                size="sm"
                              >
                                Discuss
                              </Button>
                            )}
                            {inq.status === 'In Discussion' && (
                              <span className="text-xs text-secondary-600/60 dark:text-warm-300/40 font-semibold italic transition-theme">Negotiating...</span>
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
                    {products.map((p) => (
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
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            >
              <option value="Handloom">Handloom</option>
              <option value="Copperware">Copperware</option>
              <option value="Woodcraft">Woodcraft</option>
              <option value="Aipan Art">Aipan Art</option>
            </Input>

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
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                >
                  <option value="Handloom">Handloom</option>
                  <option value="Copperware">Copperware</option>
                  <option value="Woodcraft">Woodcraft</option>
                  <option value="Aipan Art">Aipan Art</option>
                </Input>

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

        </div>
      </div>

      <ChatbotWidget />
      <Footer />
    </div>
  );
};

export default Dashboard;
