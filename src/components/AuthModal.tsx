import React from 'react';
import { X, Lock, Phone, User as UserIcon, Mail } from 'lucide-react';
import type { User } from '../types';
import { sendToGoogleSheet } from '../utils/googleSheets';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

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
  const [loading, setLoading] = React.useState(false);
  const [showForgot, setShowForgot] = React.useState(false);

  if (!isOpen) return null;

  const handleTabChange = (selectedTab: 'login' | 'register') => {
    setTab(selectedTab);
    setError('');
    setShowForgot(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid 11-digit Bangladeshi phone number (e.g., 017XXXXXXXX).');
      setLoading(false);
      return;
    }

    try {
      if (tab === 'register') {
        if (!formData.name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (!formData.email.trim()) {
          setError('Please enter your email address.');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        const userDocRef = doc(db, 'users', formData.phone);

        try {
          // Create new account in Firebase Auth using REAL email
          await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        } catch (authError: any) {
          if (authError.code === 'auth/email-already-in-use') {
            setError('An account with this email already exists.');
          } else {
            console.error("Auth Error:", authError);
            setError('Registration failed. Please try again.');
          }
          setLoading(false);
          return;
        }

        // Create new account in Firestore (without password!)
        const newUser = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          createdAt: new Date().toISOString(),
        };

        // Use the phone number as the document ID for easy querying
        await setDoc(userDocRef, newUser);
        
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
        if (!formData.email.trim()) {
          setError('Please enter your email address.');
          setLoading(false);
          return;
        }

        try {
          await signInWithEmailAndPassword(auth, formData.email, formData.password);
          
          // Fetch user details from Firestore by querying the email
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', formData.email));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            onLogin({ name: userData.name, phone: userData.phone, email: userData.email });
            onClose();
          } else {
            setError('User profile not found. Please contact support.');
          }
        } catch (authError: any) {
          setError('Invalid email or password.');
        }
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError('An error occurred while connecting to the server. Please try again.');
    } finally {
      setLoading(false);
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
        {showForgot ? (
          <div className="text-center py-8">
            <h3 className="text-white text-lg font-bold uppercase tracking-widest mb-4">Reset Password</h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              Enter the email address you registered with, and we will send you a secure link to reset your password.
            </p>
            <div className="mb-6 text-left">
              <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1.5">EMAIL ADDRESS</label>
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
            <button
              onClick={async () => {
                if (!formData.email.trim()) {
                  setError('Please enter your email address to reset your password.');
                  return;
                }
                setLoading(true);
                try {
                  await sendPasswordResetEmail(auth, formData.email);
                  alert('Password reset email sent! Check your inbox.');
                  setShowForgot(false);
                } catch (e: any) {
                  setError('Failed to send reset email. Ensure the email is correct.');
                }
                setLoading(false);
              }}
              disabled={loading}
              className="inline-block w-full bg-white text-black border border-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-300"
            >
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>
            <button
              onClick={() => { setShowForgot(false); setError(''); }}
              className="mt-6 text-neutral-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
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

          {tab === 'register' && (
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
          )}

          <div>
            <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1.5">EMAIL ADDRESS</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-brand-charcoal border border-neutral-850 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

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
            {tab === 'login' && (
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}
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
              disabled={loading}
              className={`w-full bg-white text-black border border-white py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300 mt-6 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white'
              }`}
            >
              {loading ? 'PROCESSING...' : (tab === 'login' ? 'LOG IN' : 'CREATE ACCOUNT')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
