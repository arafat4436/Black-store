import React from 'react';
import { X, Lock, Phone, User as UserIcon, Mail } from 'lucide-react';
import type { User } from '../types';
import { sendToGoogleSheet } from '../utils/googleSheets';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [tab, setTab] = React.useState<'login' | 'register'>('login');
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = React.useState('');

  if (!isOpen) return null;

  const handleTabChange = (selectedTab: 'login' | 'register') => {
    setTab(selectedTab);
    setError('');
    setFormData({
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const validatePhone = (phone: string) => {
    return /^01[3-9]\d{8}$/.test(phone); // Bangladeshi 11-digit mobile validation
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const accountsKey = 'dark_matter_accounts';
    const accounts: (User & { password: string })[] = JSON.parse(
      localStorage.getItem(accountsKey) || '[]'
    );

    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid 11-digit Bangladeshi phone number (e.g., 017XXXXXXXX).');
      return;
    }

    if (tab === 'register') {
      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      // Check if account already exists
      const exists = accounts.some((acc) => acc.phone === formData.phone);
      if (exists) {
        setError('An account with this phone number already exists.');
        return;
      }

      // Create new account
      const newUser = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        password: formData.password,
      };

      accounts.push(newUser);
      localStorage.setItem(accountsKey, JSON.stringify(accounts));
      
      // Sync new user to Google Sheet in real-time
      sendToGoogleSheet({
        type: 'user',
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
      });

      // Auto login after registration
      onLogin({ name: newUser.name, phone: newUser.phone, email: newUser.email });
      onClose();
    } else {
      // Login flow
      const account = accounts.find(
        (acc) => acc.phone === formData.phone && acc.password === formData.password
      );

      if (!account) {
        setError('Invalid phone number or password.');
        return;
      }

      onLogin({ name: account.name, phone: account.phone, email: account.email });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity" />

      {/* Modal Box */}
      <div className="bg-black border border-neutral-900 w-full max-w-md p-6 md:p-8 relative z-10 shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo/Heading */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-white">
            DARK MATTER
          </h2>
          <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mt-1">
            Access Member Portal
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 border-b border-neutral-900 mb-6">
          <button
            onClick={() => handleTabChange('login')}
            className={`py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              tab === 'login'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={`py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              tab === 'register'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="bg-red-950/20 border border-red-900/50 p-4 text-red-400 text-xs font-light tracking-wide mb-6">
            {error}
          </div>
        )}

        {/* Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1.5">FULL NAME</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-brand-charcoal border border-neutral-850 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1.5">PHONE NUMBER</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="tel"
                required
                placeholder="e.g. 017XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-brand-charcoal border border-neutral-850 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1.5">EMAIL (OPTIONAL)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-brand-charcoal border border-neutral-850 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1.5">PASSWORD</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-brand-charcoal border border-neutral-850 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1.5">CONFIRM PASSWORD</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-brand-charcoal border border-neutral-850 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black hover:bg-black hover:text-white border border-white py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300 mt-6"
          >
            {tab === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  );
};
