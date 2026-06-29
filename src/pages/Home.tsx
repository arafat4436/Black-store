import React from 'react';
import type { Product } from '../types';
import { ArrowRight, ShieldCheck, Flame, Cpu } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  products: Product[];
}

export const Home: React.FC<HomeProps> = ({ onNavigate, products }) => {
  // Show first 3 products as "New Drops"
  const featuredProducts = products.slice(0, 3);
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section 
        className="relative h-[90vh] flex items-center justify-center bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('./images/hero-bg.png')`,
        }}
      >
        <div className="text-center px-4 max-w-4xl z-10">
          <p className="text-brand-silver uppercase tracking-[0.5em] text-xs md:text-sm font-semibold mb-4">
            Dark Matter Apparel
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tight text-white mb-6 uppercase leading-none">
            EMBRACE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-600">
              DARKNESS
            </span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-lg max-w-xl mx-auto mb-8 font-light tracking-wide leading-relaxed">
            Premium heavyweight streetwear engineered for the stealth aesthetic. Strictly monochromatic, designed with ultra-premium materials.
          </p>
          <button 
            onClick={() => onNavigate('shop')}
            className="group inline-flex items-center gap-2 bg-white text-black text-sm uppercase font-bold tracking-widest px-8 py-4 border border-white hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
          >
            Shop Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.5)_0%,rgba(0,0,0,1)_80%)] pointer-events-none" />
      </section>

      {/* Brand Value Props */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-neutral-900 bg-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-brand-charcoal border border-neutral-900 flex flex-col items-center text-center group hover:border-neutral-700 transition-colors duration-300">
            <Cpu className="w-8 h-8 text-neutral-400 mb-4 group-hover:text-white transition-colors" />
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-white">450 GSM Heavyweight</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Thick, durable, and structured fabrics designed to hold their shape and provide the ultimate cozy oversized drape.
            </p>
          </div>
          <div className="p-8 bg-brand-charcoal border border-neutral-900 flex flex-col items-center text-center group hover:border-neutral-700 transition-colors duration-300">
            <Flame className="w-8 h-8 text-neutral-400 mb-4 group-hover:text-white transition-colors" />
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-white">Monochromatic Identity</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              No distracting colors. Strictly matte blacks, deep charcoals, and off-whites. Designed to integrate into any wardrobe.
            </p>
          </div>
          <div className="p-8 bg-brand-charcoal border border-neutral-900 flex flex-col items-center text-center group hover:border-neutral-700 transition-colors duration-300">
            <ShieldCheck className="w-8 h-8 text-neutral-400 mb-4 group-hover:text-white transition-colors" />
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2 text-white">Premium Craftsmanship</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Handcrafted in limited batches with custom double-layered hoods, ribbed side panels, and seamless detailing.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Drops / New Drops */}
      <section className="py-20 px-4 md:px-8 border-t border-neutral-900 bg-gradient-to-b from-black to-brand-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-2 font-bold">Latest Release</p>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">NEW DROPS</h2>
            </div>
            <button 
              onClick={() => onNavigate('shop')}
              className="mt-4 md:mt-0 text-sm uppercase tracking-widest font-bold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors border-b border-transparent hover:border-white pb-1"
            >
              View Catalog <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div 
                key={product.id}
                className="group relative bg-black border border-neutral-900 p-4 flex flex-col hover:border-neutral-700 transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => onNavigate('shop')}
              >
                <div className="relative overflow-hidden bg-neutral-950 aspect-[4/5] mb-6 border border-neutral-900">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-black uppercase tracking-widest px-2 py-1">
                    NEW DROP
                  </div>
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-md uppercase font-bold text-white tracking-wide group-hover:text-neutral-300 transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-md font-semibold text-neutral-300">
                    ৳{product.price.toLocaleString()}
                  </span>
                </div>

                <p className="text-neutral-500 text-xs line-clamp-2 mb-4 font-light">
                  {product.description}
                </p>

                <div className="mt-auto text-xs uppercase tracking-widest font-bold text-white border border-neutral-800 py-3 text-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                  Select Options
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 px-4 text-center border-t border-neutral-900 bg-black relative overflow-hidden">
        <div className="max-w-2xl mx-auto z-10 relative">
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-4 tracking-tight">JOIN THE SYNDICATE</h2>
          <p className="text-neutral-400 text-sm md:text-base mb-8 max-w-md mx-auto font-light leading-relaxed">
            Subscribe to receive priority access to limited streetwear drops, secret collections, and exclusive updates.
          </p>

          {subscribed ? (
            <div className="bg-neutral-950 border border-neutral-800 p-6 text-brand-silver font-semibold text-sm uppercase tracking-widest inline-block animate-fade-in">
              ✓ YOU ARE NOW ON THE LIST. PREPARE FOR THE DROP.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-brand-charcoal border border-neutral-800 text-white px-4 py-4 text-sm focus:outline-none focus:border-neutral-500 font-sans tracking-wide"
              />
              <button 
                type="submit" 
                className="bg-white text-black hover:bg-black hover:text-white border border-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300"
              >
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>

        {/* Decorative background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />
      </section>
    </div>
  );
};
