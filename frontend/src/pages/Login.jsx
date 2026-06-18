import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  const [role, setRole] = useState('artisan'); // 'artisan' or 'buyer'
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleToggleRole = (selectedRole) => {
    setRole(selectedRole);
    setCredentials({ email: '', password: '' });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setError('Please fill in both fields.');
      return;
    }

    setIsLoading(true);

    // Simulate standard authentication delay
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      
      // Save session info
      localStorage.setItem('user_session', JSON.stringify({ email: credentials.email, role }));

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-warm-50">
      <Navbar />

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        
        {/* Larger Simple Login Card */}
        <div className="w-full max-w-lg bg-white border border-warm-200 rounded-2xl shadow-md p-10 sm:p-12 space-y-8">
          
          {/* Header */}
          <div className="space-y-3 text-center">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-800">
              Sign In
            </h1>
            <p className="text-base text-secondary-600 font-light">
              Choose your account type to access the platform.
            </p>
          </div>

          {/* Simple Tab Role Selector */}
          <div className="flex border-b border-warm-200">
            <button
              type="button"
              onClick={() => handleToggleRole('artisan')}
              className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                role === 'artisan'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-secondary-800'
              }`}
            >
              Artisan / Admin
            </button>
            <button
              type="button"
              onClick={() => handleToggleRole('buyer')}
              className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                role === 'buyer'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-secondary-800'
              }`}
            >
              Wholesale Buyer
            </button>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="bg-red-50 border-l-2 border-red-500 p-3 rounded-lg text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-2 border-green-500 p-3 rounded-lg text-sm font-semibold text-green-700 text-center animate-pulse">
              Signing in... Redirecting to your dashboard.
            </div>
          )}

          {/* Login Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-secondary-700 uppercase tracking-wider mb-2">
                  {role === 'artisan' ? 'Artisan Email Address' : 'Business Email Address'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder={role === 'artisan' ? 'artisan@kumaon.org' : 'buyer@kumaon.org'}
                  className="w-full px-4 py-3 rounded-lg border border-warm-300 bg-white text-secondary-800 text-base focus:outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-secondary-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-primary-600 hover:underline cursor-pointer">Forgot password?</span>
                </div>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-warm-300 bg-white text-secondary-800 text-base focus:outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white rounded-lg text-base font-bold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <span>Checking...</span>
                ) : (
                  <span>Log In</span>
                )}
              </button>
            </form>
          )}

          {/* Simple Mock Credentials Helper */}
          <div className="bg-warm-100/60 p-5 rounded-xl border border-warm-200 text-xs sm:text-sm space-y-2">
            <span className="font-bold text-secondary-800 block">Demonstration Login Details:</span>
            <p className="text-secondary-600 leading-relaxed">
              <strong>Role:</strong> {role === 'artisan' ? 'Artisan Account' : 'Wholesale Buyer Account'} <br />
              <strong>Email:</strong> {role === 'artisan' ? 'artisan@kumaon.org' : 'buyer@kumaon.org'} <br />
              <strong>Password:</strong> <code className="bg-warm-200/80 px-1.5 py-0.5 rounded text-[11px] font-mono">password123</code>
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
