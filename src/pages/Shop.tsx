import React from 'react';
import type { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopProps {
  onAddToCart: (product: Product, size: 'M' | 'L' | 'XL' | 'XXL' | 'N/A') => void;
  products: Product[];
}

export const Shop: React.FC<ShopProps> = ({ onAddToCart, products }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [sortBy, setSortBy] = React.useState<string>('default');

  // Filter products
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory === 'All') return true;
      return product.category === selectedCategory;
    });
  }, [selectedCategory]);

  // Sort products
  const sortedProducts = React.useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    return list; // Default sorting
  }, [filteredProducts, sortBy]);

  const categories = ['All', 'Apparel', 'Accessories', 'Footwear'];

  return (
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen animate-fade-in">
      <div className="mb-12 border-b border-neutral-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-2 leading-none">
            CATALOG
          </h1>
          <p className="text-neutral-500 text-sm font-light">
            Showing {sortedProducts.length} premium black items
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-brand-charcoal border border-neutral-800 text-neutral-300 text-xs font-bold uppercase tracking-widest px-6 py-4 pr-12 rounded-none focus:outline-none focus:border-neutral-500 w-full sm:w-auto cursor-pointer"
            >
              <option value="default">Default Sort</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Categories filter layout */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-white text-black border-white'
                : 'bg-brand-charcoal text-neutral-400 border-neutral-900 hover:border-neutral-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid of products */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-brand-charcoal border border-neutral-950">
          <p className="text-neutral-500 uppercase font-bold tracking-widest text-sm">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};
