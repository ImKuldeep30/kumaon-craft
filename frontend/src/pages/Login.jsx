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
    <div className="min-h-screen flex flex-col justify-between bg-warm-50 dark:bg-secondary-900/30 transition-theme">
      <Navbar />

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        
        {/* Larger Simple Login Card */}
        <div className="w-full max-w-lg bg-white dark:bg-secondary-800/80 border border-warm-200 dark:border-secondary-700/60 rounded-2xl shadow-md p-10 sm:p-12 space-y-8 transition-theme">
          
          {/* Header */}
          <div className="space-y-3 text-center">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-800 dark:text-warm-100 transition-theme">
              Sign In
            </h1>
            <p className="text-base text-secondary-600 dark:text-warm-200 font-light transition-theme">
              Choose your account type to access the platform.
            </p>
          </div>

          {/* Simple Tab Role Selector */}
          <div className="flex border-b border-warm-200 dark:border-secondary-700 transition-theme">
            <button
              type="button"
              onClick={() => handleToggleRole('artisan')}
              className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer transition-theme ${
                role === 'artisan'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-600 dark:text-warm-300 hover:text-secondary-800 dark:hover:text-warm-100'
              }`}
            >
              Artisan / Admin
            </button>
            <button
              type="button"
              onClick={() => handleToggleRole('buyer')}
              className={`flex-1 pb-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer transition-theme ${
                role === 'buyer'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-600 dark:text-warm-300 hover:text-secondary-800 dark:hover:text-warm-100'
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
                <label className="block text-xs font-semibold text-secondary-700 dark:text-warm-200 uppercase tracking-wider mb-2 transition-theme">
                  {role === 'artisan' ? 'Artisan Email Address' : 'Business Email Address'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder={role === 'artisan' ? 'artisan@kumaon.org' : 'buyer@kumaon.org'}
                  className="w-full px-4 py-3 rounded-lg border border-warm-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-warm-50 text-base focus:outline-none focus:border-primary-500 transition-colors transition-theme"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-secondary-700 dark:text-warm-200 uppercase tracking-wider transition-theme">
                    Password
                  </label>
                  <span className="text-xs text-primary-600 dark:text-primary-400 hover:underline cursor-pointer transition-theme">Forgot password?</span>
                </div>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-warm-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-warm-50 text-base focus:outline-none focus:border-primary-500 transition-colors transition-theme"
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
          <div className="bg-warm-100/60 dark:bg-secondary-900/60 p-5 rounded-xl border border-warm-200 dark:border-secondary-800 text-xs sm:text-sm space-y-2 transition-theme">
            <span className="font-bold text-secondary-800 dark:text-warm-100 block transition-theme">Demonstration Login Details:</span>
            <p className="text-secondary-600 dark:text-warm-300 leading-relaxed transition-theme">
              <strong>Role:</strong> {role === 'artisan' ? 'Artisan Account' : 'Wholesale Buyer Account'} <br />
              <strong>Email:</strong> {role === 'artisan' ? 'artisan@kumaon.org' : 'buyer@kumaon.org'} <br />
              <strong>Password:</strong> <code className="bg-warm-200/80 dark:bg-secondary-700 px-1.5 py-0.5 rounded text-[11px] font-mono text-secondary-800 dark:text-warm-100">password123</code>
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
