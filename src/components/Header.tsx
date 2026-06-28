import React from 'react';
import { ShoppingBag, Menu, X, User as UserIcon } from 'lucide-react';
import type { CartItem, User } from '../types';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartItems,
  onOpenCart,
  currentUser,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Home', value: 'home' },
    { name: 'Shop', value: 'shop' },
    { name: 'About', value: 'about' },
    { name: 'Contact', value: 'contact' },
  ];

  const handleNavClick = (value: string) => {
    onNavigate(value);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex justify-between items-center">
        {/* Brand Name */}
        <button 
          onClick={() => handleNavClick('home')}
          className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-white hover:text-neutral-300 transition-colors focus:outline-none"
        >
          DARK MATTER
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <button
              key={link.value}
              onClick={() => handleNavClick(link.value)}
              className={`text-xs font-bold uppercase tracking-widest relative pb-2 focus:outline-none ${
                currentPage === link.value 
                  ? 'text-white' 
                  : 'text-neutral-400 hover:text-white transition-colors'
              }`}
            >
              {link.name}
              {currentPage === link.value && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
              )}
            </button>
          ))}
          {currentUser && (
            <button
              onClick={() => handleNavClick('account')}
              className={`text-xs font-bold uppercase tracking-widest relative pb-2 focus:outline-none ${
                currentPage === 'account' 
                  ? 'text-white' 
                  : 'text-neutral-400 hover:text-white transition-colors'
              }`}
            >
              My Orders
              {currentPage === 'account' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
              )}
            </button>
          )}
        </nav>

        {/* Cart, Profile & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 bg-brand-charcoal hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 transition-all focus:outline-none text-white cursor-pointer"
            title="Open Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Profile Icon */}
          <button
            onClick={currentUser ? () => handleNavClick('account') : onOpenAuth}
            className={`p-2.5 bg-brand-charcoal hover:bg-neutral-900 border transition-all focus:outline-none text-white cursor-pointer ${
              currentPage === 'account' 
                ? 'border-white' 
                : 'border-neutral-900 hover:border-neutral-800'
            }`}
            title={currentUser ? `Account: ${currentUser.name}` : 'Login / Register'}
          >
            <UserIcon className="w-4 h-4" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-900 bg-black">
          <nav className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => handleNavClick(link.value)}
                className={`text-left text-sm font-bold uppercase tracking-widest py-2 border-b border-transparent ${
                  currentPage === link.value ? 'text-white' : 'text-neutral-400'
                }`}
              >
                {link.name}
              </button>
            ))}
            {currentUser && (
              <button
                onClick={() => handleNavClick('account')}
                className={`text-left text-sm font-bold uppercase tracking-widest py-2 border-b border-transparent ${
                  currentPage === 'account' ? 'text-white' : 'text-neutral-400'
                }`}
              >
                My Orders
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
