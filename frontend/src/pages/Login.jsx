import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import { API_BASE_URL } from '../config';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'buyer';
  const [role, setRole] = useState(initialRole);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setError('Please fill in both fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          role,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        // Save session info
        localStorage.setItem(
          'user_session',
          JSON.stringify({
            email: result.data.email,
            name: result.data.name,
            role: result.data.role,
            token: result.data.token,
          })
        );
        setTimeout(() => {
          if (result.data.role === 'buyer') {
            navigate('/');
          } else {
            navigate('/dashboard');
          }
        }, 1000);
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Failed to connect to the authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google?role=${role}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-warm-50 dark:bg-secondary-900/30 transition-theme">
      <Navbar />

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center py-12 md:py-16 px-4">
        
        {/* Larger Simple Login Card */}
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white dark:bg-secondary-800/80 border border-warm-200 dark:border-secondary-700/60 rounded-2xl shadow-md p-10 sm:p-12 space-y-8 transition-theme">
          
          {/* Header */}
          <div className="space-y-3 text-center">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-800 dark:text-warm-100 transition-theme">
              {role === 'buyer' ? 'Sign In' : 'Artisan / Admin Sign In'}
            </h1>
            <p className="text-base text-secondary-600 dark:text-warm-200 font-light transition-theme">
              {role === 'buyer' 
                ? 'Sign in to access your wholesale sourcing history and place orders.' 
                : 'Access your artisan dashboard to manage products and inquiries.'}
            </p>
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
              <Input
                label={role === 'artisan' ? 'Artisan Email Address' : 'Business Email Address'}
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder={role === 'artisan' ? 'artisan@kumaon.org' : 'buyer@kumaon.org'}
                required
              />

              <Input
                label={
                  <span className="flex justify-between items-center w-full">
                    <span>Password</span>
                    <span className="text-xs text-primary-600 dark:text-primary-400 hover:underline cursor-pointer normal-case font-normal transition-theme">
                      Forgot password?
                    </span>
                  </span>
                }
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="w-full mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader size="sm" color="white" />
                    <span>Checking...</span>
                  </div>
                ) : (
                  <span>Log In</span>
                )}
              </Button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-warm-200 dark:border-secondary-700/60"></div>
                <span className="flex-shrink mx-4 text-secondary-500 text-xs uppercase tracking-wider font-semibold">Or connect with</span>
                <div className="flex-grow border-t border-warm-200 dark:border-secondary-700/60"></div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 border-warm-300 dark:border-secondary-700 hover:bg-warm-50 dark:hover:bg-secondary-800"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" className="w-5 h-5">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.711a4.96 4.96 0 0 1 0-3.422V4.957H.957a8.991 8.991 0 0 0 0 8.086l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.806 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                <span>Sign in with Google</span>
              </Button>
            </form>
          )}

          <div className="text-center text-sm text-secondary-600 dark:text-warm-300 space-y-2.5">
            <div>
              Don't have an account?{' '}
              <Link to={`/register?role=${role}`} className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                Register
              </Link>
            </div>
            <div className="text-xs opacity-80 pt-1">
              {role === 'buyer' ? (
                <span>
                  Are you an Artisan or Admin?{' '}
                  <button
                    type="button"
                    onClick={() => handleToggleRole('artisan')}
                    className="text-primary-600 dark:text-primary-400 font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline"
                  >
                    Sign In Here
                  </button>
                </span>
              ) : (
                <span>
                  Back to{' '}
                  <button
                    type="button"
                    onClick={() => handleToggleRole('buyer')}
                    className="text-primary-600 dark:text-primary-400 font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline"
                  >
                    Wholesale Buyer Sign In
                  </button>
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Simple Copyright Footer to allow absolute vertical centering */}
      <div className="bg-warm-50/50 dark:bg-secondary-900/10 py-6 text-center text-xs text-secondary-500 border-t border-warm-200/40 dark:border-secondary-800/40 transition-theme shrink-0">
        <p>© {new Date().getFullYear()} Kumaon Craft Connect. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
