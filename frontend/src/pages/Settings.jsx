import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const Settings = () => {
  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [preferences, setPreferences] = useState({
    notifications: true,
    newsletter: false,
    darkMode: false,
  });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('user_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setUser({
          name: parsed.name || 'User',
          email: parsed.email || '',
          role: parsed.role || 'buyer',
        });
      } catch (err) {
        console.error('Failed to parse user session');
      }
    }
  }, []);

  const handleCheckboxChange = (name) => {
    setPreferences((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setToastMessage('Account settings updated successfully!');
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-warm-50 dark:bg-secondary-900/30 transition-theme">
      <Navbar />

      <div className="flex-grow max-w-4xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

        <div className="bg-white dark:bg-secondary-800/80 border border-warm-200 dark:border-secondary-700/60 rounded-3xl p-8 sm:p-12 shadow-sm space-y-10 transition-theme">
          
          {/* Header */}
          <div className="border-b border-warm-200 dark:border-secondary-700/60 pb-6 transition-theme">
            <h1 className="font-serif text-3xl font-bold text-secondary-800 dark:text-warm-100 transition-theme">
              Account Settings
            </h1>
            <p className="text-sm text-secondary-600 dark:text-warm-300 font-light mt-1 transition-theme">
              Manage your personal details, role definitions, and communication preferences.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            {/* Profile Info */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-secondary-800 dark:text-warm-100 transition-theme">
                Profile Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Display Name"
                  type="text"
                  value={user.name}
                  disabled
                  helperText="Name is managed via authentication account credentials"
                />
                
                <Input
                  label="Registered Email"
                  type="email"
                  value={user.email}
                  disabled
                  helperText="Email cannot be changed once verified"
                />
              </div>

              <div>
                <span className="block text-xs uppercase tracking-wider text-secondary-600 dark:text-warm-300 font-bold mb-2 transition-theme">
                  Account Access Role
                </span>
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-900/50 capitalize transition-theme">
                  {user.role} Status
                </span>
              </div>
            </div>

            <hr className="border-warm-200 dark:border-secondary-700/60 transition-theme" />

            {/* Sourcing Preferences */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-secondary-800 dark:text-warm-100 transition-theme">
                System Preferences
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={() => handleCheckboxChange('notifications')}
                    className="w-4 h-4 rounded text-primary-500 border-warm-300 focus:ring-primary-400 dark:bg-secondary-900 dark:border-secondary-700"
                  />
                  <span className="text-sm text-secondary-800 dark:text-warm-100 font-medium transition-theme">
                    Email Notifications for Quote Status Updates
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.newsletter}
                    onChange={() => handleCheckboxChange('newsletter')}
                    className="w-4 h-4 rounded text-primary-500 border-warm-300 focus:ring-primary-400 dark:bg-secondary-900 dark:border-secondary-700"
                  />
                  <span className="text-sm text-secondary-800 dark:text-warm-100 font-medium transition-theme">
                    Receive Monthly Himalayan Artisan Heritage Newsletter
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg">
                Save Settings
              </Button>
            </div>
          </form>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
