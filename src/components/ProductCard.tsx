import React from 'react';
import type { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: 'M' | 'L' | 'XL' | 'XXL' | 'N/A') => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isApparel = product.category === 'Apparel';
  const [selectedSize, setSelectedSize] = React.useState<'M' | 'L' | 'XL' | 'XXL' | 'N/A'>(
    isApparel ? 'M' : 'N/A'
  );

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize);
  };

  return (
    <div className="group bg-brand-charcoal border border-neutral-900 p-4 flex flex-col hover:border-neutral-700 transition-all duration-300 ease-in-out">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-neutral-950 aspect-[4/5] mb-5 border border-neutral-900">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-neutral-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-neutral-800">
          {product.category}
        </div>
      </div>

      {/* Info */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-md uppercase font-bold text-white tracking-wide group-hover:text-neutral-300 transition-colors">
          {product.name}
        </h3>
        <span className="text-md font-semibold text-neutral-300">
          ৳{product.price.toLocaleString()}
        </span>
      </div>

      <p className="text-neutral-500 text-xs line-clamp-2 mb-4 font-light leading-relaxed">
        {product.description}
      </p>

      {/* Size Selector for Apparel */}
      {isApparel && (
        <div className="mb-4">
          <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">Select Size</p>
          <div className="flex gap-2">
            {(['M', 'L', 'XL', 'XXL'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`w-9 h-9 text-xs font-bold border transition-colors flex items-center justify-center ${
                  selectedSize === size
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-neutral-400 border-neutral-800 hover:border-neutral-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add To Cart CTA */}
      <button
        onClick={handleAddToCart}
        className="mt-auto w-full group inline-flex items-center justify-center gap-2 bg-transparent text-white border border-neutral-800 hover:bg-white hover:text-black hover:border-white py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ease-in-out"
      >
        <Plus className="w-3.5 h-3.5" />
        Add to Cart
      </button>
    </div>
  );
};
