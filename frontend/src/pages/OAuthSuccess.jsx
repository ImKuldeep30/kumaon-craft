import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Loader from '../components/ui/Loader';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const name = searchParams.get('name');

    if (token && email && role) {
      // Successfully authenticated, write parameters to local session storage
      localStorage.setItem(
        'user_session',
        JSON.stringify({
          token,
          email,
          role,
          name: name || 'Google Explorer',
        })
      );
      
      // Delay navigation slightly to let the success loader animate nicely
      const timer = setTimeout(() => {
        if (role === 'buyer') {
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setError('OAuth authentication failed. Parameters missing in query string.');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-secondary-900/30 flex items-center justify-center p-6 transition-theme">
      <div className="w-full max-w-md bg-white dark:bg-secondary-800/80 border border-warm-200 dark:border-secondary-700/60 rounded-2xl p-10 text-center shadow-md space-y-6 transition-theme">
        
        {error ? (
          <>
            <div className="text-4xl">❌</div>
            <h2 className="font-serif text-2xl font-bold text-red-600">Authentication Error</h2>
            <p className="text-sm text-secondary-600 dark:text-warm-300 transition-theme">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-bold transition-all active:scale-95"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <Loader size="lg" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-secondary-800 dark:text-warm-100 transition-theme">
              Google Authenticated!
            </h2>
            <p className="text-sm text-secondary-600 dark:text-warm-300 transition-theme">
              Securing connection and loading Kumaon Craft Connect...
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default OAuthSuccess;
