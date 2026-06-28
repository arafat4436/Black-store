import React from 'react';
import type { CartItem } from '../types';
import { X, Plus, Minus, Trash, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, size: string, change: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-black border-l border-neutral-900 flex flex-col shadow-2xl animate-slide-in">
          {/* Header */}
          <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-brand-charcoal">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h2 className="text-md font-bold uppercase tracking-widest text-white">YOUR CART</h2>
              {cartItems.length > 0 && (
                <span className="bg-white text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </div>
            <button 
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingBag className="w-12 h-12 text-neutral-800 mb-4" />
                <p className="text-neutral-500 uppercase font-bold tracking-widest text-xs">
                  Your cart is empty
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 text-xs uppercase tracking-widest font-bold text-white border-b border-white pb-1"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-4 p-4 bg-brand-charcoal border border-neutral-950 hover:border-neutral-900 transition-colors"
                >
                  {/* Image */}
                  <div className="w-20 h-24 bg-neutral-950 border border-neutral-900 flex-shrink-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs uppercase font-bold text-white tracking-wide leading-tight">
                          {item.product.name}
                        </h4>
                        <button 
                          onClick={() => onRemoveItem(item.product.id, item.size)}
                          className="text-neutral-500 hover:text-white transition-colors"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {item.size !== 'N/A' && (
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mt-1">
                          SIZE: {item.size}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      {/* Qty Controls */}
                      <div className="flex items-center border border-neutral-800 bg-black">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, -1)}
                          className="px-2.5 py-1 text-neutral-400 hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, 1)}
                          className="px-2.5 py-1 text-neutral-400 hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xs font-semibold text-neutral-300">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Subtotal & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-neutral-900 bg-brand-charcoal space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">Subtotal</span>
                <span className="text-lg font-black text-white">৳{subtotal.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-normal font-light">
                Shipping and delivery costs will be calculated at checkout based on your district.
              </p>
              
              <button
                onClick={onCheckout}
                className="w-full bg-white text-black hover:bg-black hover:text-white border border-white py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300"
              >
                PROCEED TO COD CHECKOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
