import React from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBackToStore }) => {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for the demo Admin site
    if (password === 'admin123') {
      onLogin();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 border border-neutral-900 bg-brand-charcoal animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-full mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-center">Admin Portal</h1>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-2">Restricted Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
              placeholder="Enter admin password"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black hover:bg-neutral-200 py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-900 text-center">
          <button
            onClick={onBackToStore}
            className="text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
          >
            &larr; Return to Store
          </button>
        </div>
      </div>
    </div>
  );
};
