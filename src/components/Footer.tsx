import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-black border-t border-neutral-900 text-neutral-500 py-16 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <h4 className="text-white font-black uppercase tracking-[0.2em] text-md">
            DARK MATTER
          </h4>
          <p className="text-xs font-light leading-relaxed max-w-xs">
            Premium, heavy-density streetwear engineered for modern urban utility. Strictly monochromatic. Designed and crafted in Dhaka, Bangladesh.
          </p>
        </div>

        {/* Navigation links */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => onNavigate('home')} 
                className="hover:text-white transition-colors uppercase tracking-wider font-semibold"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('shop')} 
                className="hover:text-white transition-colors uppercase tracking-wider font-semibold"
              >
                Shop Catalog
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('about')} 
                className="hover:text-white transition-colors uppercase tracking-wider font-semibold"
              >
                Philosophy
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('contact')} 
                className="hover:text-white transition-colors uppercase tracking-wider font-semibold"
              >
                Support / FAQ
              </button>
            </li>
            <li className="pt-2">
              <button 
                onClick={() => onNavigate('admin')} 
                className="hover:text-white transition-colors uppercase tracking-wider font-semibold text-[10px] text-neutral-600 hover:text-neutral-400"
              >
                Staff Portal
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
            Customer Support
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors uppercase tracking-wider">
                Exchanges & Returns
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors uppercase tracking-wider">
                Sizing Guide
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors uppercase tracking-wider">
                Order Tracking
              </button>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
            Follow Us
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="#" className="hover:text-white transition-colors uppercase tracking-wider">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors uppercase tracking-wider">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors uppercase tracking-wider">
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto border-t border-neutral-950 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light">
        <p>© {new Date().getFullYear()} DARK MATTER. ALL RIGHTS RESERVED.</p>
        <p className="text-neutral-600">MADE IN BANGLADESH</p>
      </div>
    </footer>
  );
};
