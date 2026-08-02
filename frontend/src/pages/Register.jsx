import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import { API_BASE_URL } from '../config';

const Register = () => {
  const [role, setRole] = useState('buyer'); // default role is buyer
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleToggleRole = (selectedRole) => {
    setRole(selectedRole);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all the required fields.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        // Save user session in localStorage
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
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(result.message || 'Registration failed. Please check details.');
      }
    } catch (err) {
      setError('Connection to auth server failed. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-warm-50 dark:bg-secondary-900/30 transition-theme">
      <Navbar />

      {/* Main Container */}
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        
        {/* Registration Card */}
        <div className="w-full max-w-lg bg-white dark:bg-secondary-800/80 border border-warm-200 dark:border-secondary-700/60 rounded-2xl shadow-md p-10 sm:p-12 space-y-8 transition-theme">
          
          {/* Header */}
          <div className="space-y-3 text-center">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-secondary-800 dark:text-warm-100 transition-theme">
              Create Account
            </h1>
            <p className="text-base text-secondary-600 dark:text-warm-200 font-light transition-theme">
              Register as a buyer or an artisan to connect with Kumaon's heritage.
            </p>
          </div>

          {/* Tab Role Selector */}
          <div className="flex border-b border-warm-200 dark:border-secondary-700 transition-theme">
            <Button
              variant="ghost"
              onClick={() => handleToggleRole('buyer')}
              className={`flex-1 !rounded-none !bg-transparent border-b-2 !pb-3 !pt-0 !px-0 text-sm font-bold uppercase tracking-wider active:scale-100 transition-all ${
                role === 'buyer'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-600 dark:text-warm-300 hover:text-secondary-800 dark:hover:text-warm-100'
              }`}
            >
              Wholesale Buyer
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleToggleRole('artisan')}
              className={`flex-1 !rounded-none !bg-transparent border-b-2 !pb-3 !pt-0 !px-0 text-sm font-bold uppercase tracking-wider active:scale-100 transition-all ${
                role === 'artisan'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-600 dark:text-warm-300 hover:text-secondary-800 dark:hover:text-warm-100'
              }`}
            >
              Artisan / Guild
            </Button>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="bg-red-50 border-l-2 border-red-500 p-3 rounded-lg text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-2 border-green-500 p-3 rounded-lg text-sm font-semibold text-green-700 text-center animate-pulse">
              Account created successfully! Loading your dashboard...
            </div>
          )}

          {/* Register Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Kuldeep Kohli"
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. info@graphicera.edu"
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="•••••••• (Min 6 characters)"
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
                    <span>Signing up...</span>
                  </div>
                ) : (
                  <span>Register Account</span>
                )}
              </Button>
            </form>
          )}

          <div className="text-center text-sm text-secondary-600 dark:text-warm-300">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              Log In
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
