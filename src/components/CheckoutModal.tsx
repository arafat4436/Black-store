import React from 'react';
import { X, CheckCircle, Truck, CreditCard, Smartphone } from 'lucide-react';
import type { CartItem, Order, User } from '../types';
import { sendToGoogleSheet } from '../utils/googleSheets';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
  currentUser: User | null;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onClearCart,
  currentUser,
  onOrderPlaced,
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    address: '',
    district: 'inside', // 'inside' or 'outside'
  });
  
  const [paymentMethod, setPaymentMethod] = React.useState<'cod' | 'bkash' | 'card'>('cod');
  const [txid, setTxid] = React.useState('');
  const [cardDetails, setCardDetails] = React.useState({
    number: '',
    expiry: '',
    cvv: '',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [orderSuccess, setOrderSuccess] = React.useState(false);
  const [orderNumber, setOrderNumber] = React.useState('');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const deliveryCharge = formData.district === 'inside' ? 80 : 150;
  const total = subtotal + deliveryCharge;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      const randNum = Math.floor(10000 + Math.random() * 90000);
      const generatedId = `DM-${randNum}`;
      setOrderNumber(generatedId);
      
      const newOrder: Order = {
        orderId: generatedId,
        items: cartItems,
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          district: formData.district,
        },
        deliveryCharge: deliveryCharge,
        total: total,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'bkash' ? `bKash/Nagad (${txid})` : 'Credit/Debit Card',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        status: 'Processing',
        userPhone: currentUser ? currentUser.phone : undefined
      };

      // Save order to localStorage database
      const ordersKey = 'dark_matter_orders';
      const existingOrders: Order[] = JSON.parse(localStorage.getItem(ordersKey) || '[]');
      existingOrders.push(newOrder);
      localStorage.setItem(ordersKey, JSON.stringify(existingOrders));

      // Propagate order back to parent state
      onOrderPlaced(newOrder);

      // Sync order to Google Sheet in real-time
      sendToGoogleSheet({
        type: 'order',
        orderId: newOrder.orderId,
        customerName: newOrder.customer.name,
        phone: newOrder.customer.phone,
        address: newOrder.customer.address,
        district: newOrder.customer.district === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka',
        total: newOrder.total,
        paymentMethod: newOrder.paymentMethod,
        date: newOrder.date,
      });

      setIsSubmitting(false);
      setOrderSuccess(true);
    }, 1200);
  };

  const handleDone = () => {
    onClearCart();
    setOrderSuccess(false);
    setPaymentMethod('cod');
    setTxid('');
    setCardDetails({ number: '', expiry: '', cvv: '' });
    onClose();
  };

  const getPaymentName = () => {
    switch (paymentMethod) {
      case 'cod':
        return 'CASH ON DELIVERY';
      case 'bkash':
        return 'MOBILE BANKING (BKASH / NAGAD)';
      case 'card':
        return 'CREDIT / DEBIT CARD';
      default:
        return 'CASH ON DELIVERY';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div 
        onClick={orderSuccess ? handleDone : onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Box */}
      <div className="bg-black border border-neutral-900 w-full max-w-lg p-6 md:p-8 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]">
        {!orderSuccess && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {orderSuccess ? (
          /* Success Screen */
          <div className="text-center py-8 space-y-6 animate-fade-in">
            <CheckCircle className="w-16 h-16 text-white mx-auto" />
            
            <div>
              <h2 className="text-xl md:text-3xl font-black uppercase text-white tracking-tight mb-2">ORDER PLACED</h2>
              <p className="text-neutral-400 text-xs md:text-sm font-light">
                {paymentMethod === 'cod' 
                  ? 'Your Cash on Delivery order is being processed.' 
                  : 'Your payment was successfully received and order is confirmed.'}
              </p>
            </div>

            <div className="bg-brand-charcoal border border-neutral-950 p-6 text-left space-y-4 max-w-sm mx-auto">
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">ORDER NUMBER</span>
                <span className="text-sm font-bold text-white">{orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">TOTAL VALUE</span>
                <span className="text-sm font-bold text-white">৳{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">PAYMENT TYPE</span>
                <span className="text-sm font-bold text-white uppercase">{getPaymentName()}</span>
              </div>
              {paymentMethod === 'bkash' && txid && (
                <div className="flex justify-between border-b border-neutral-900 pb-2">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">TXID</span>
                  <span className="text-sm font-bold text-white uppercase">{txid}</span>
                </div>
              )}
              <div>
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest block mb-1">DELIVERY ADDRESS</span>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">{formData.address}</p>
                <p className="text-xs text-neutral-400 font-bold uppercase mt-1 tracking-widest">
                  {formData.district === 'inside' ? 'INSIDE DHAKA' : 'OUTSIDE DHAKA'}
                </p>
              </div>
            </div>

            <p className="text-neutral-500 text-xs font-light max-w-xs mx-auto">
              We will contact you at <span className="text-neutral-300 font-semibold">{formData.phone}</span> to confirm your shipment.
            </p>

            <button
              onClick={handleDone}
              className="w-full bg-white text-black hover:bg-black hover:text-white border border-white py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Truck className="w-5 h-5 text-white" />
              <h2 className="text-md font-bold uppercase tracking-widest text-white">SHIPPING & PAYMENT</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="ENTER YOUR NAME"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-brand-charcoal border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">PHONE NUMBER</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-brand-charcoal border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">DELIVERY DISTRICT</label>
                <div className="relative">
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full appearance-none bg-brand-charcoal border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 pr-10 rounded-none cursor-pointer"
                  >
                    <option value="inside">INSIDE DHAKA (৳80 delivery)</option>
                    <option value="outside">OUTSIDE DHAKA (৳150 delivery)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">FULL DELIVERY ADDRESS</label>
                <textarea
                  required
                  rows={2}
                  placeholder="HOUSE, ROAD, SECTOR, AREA, DISTRICT"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-brand-charcoal border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 resize-none"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2.5">PAYMENT METHOD</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 text-[10px] font-bold uppercase tracking-wider border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'cod'
                        ? 'bg-white text-black border-white'
                        : 'bg-brand-charcoal text-neutral-400 border-neutral-850 hover:border-neutral-700'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>COD</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3 text-[10px] font-bold uppercase tracking-wider border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'bkash'
                        ? 'bg-white text-black border-white'
                        : 'bg-brand-charcoal text-neutral-400 border-neutral-850 hover:border-neutral-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>bKash/Nagad</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 text-[10px] font-bold uppercase tracking-wider border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-white text-black border-white'
                        : 'bg-brand-charcoal text-neutral-400 border-neutral-850 hover:border-neutral-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>
                </div>
              </div>

              {/* Conditional Payment Detail Fields */}
              {paymentMethod === 'bkash' && (
                <div className="bg-brand-charcoal border border-neutral-850 p-4 space-y-3 animate-fade-in">
                  <p className="text-[10px] text-neutral-400 font-light leading-normal">
                    Send <strong>৳{total.toLocaleString()}</strong> to our merchant bKash/Nagad number: <span className="text-white font-mono font-semibold">+880 1712-345678</span> (Merchant Send Money option).
                  </p>
                  <div>
                    <label className="block text-neutral-500 text-[9px] uppercase font-bold tracking-widest mb-1.5">TRANSACTION ID (TXID)</label>
                    <input
                      type="text"
                      required
                      placeholder="ENTER TxID (e.g. 9J8F2K3L)"
                      value={txid}
                      onChange={(e) => setTxid(e.target.value)}
                      className="w-full bg-black border border-neutral-800 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-neutral-500 font-mono uppercase"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="bg-brand-charcoal border border-neutral-850 p-4 space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-neutral-500 text-[9px] uppercase font-bold tracking-widest mb-1.5">CARD NUMBER</label>
                    <input
                      type="text"
                      required
                      placeholder="0000 0000 0000 0000"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full bg-black border border-neutral-800 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-neutral-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-500 text-[9px] uppercase font-bold tracking-widest mb-1.5">EXPIRY DATE</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-black border border-neutral-800 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-neutral-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-500 text-[9px] uppercase font-bold tracking-widest mb-1.5">CVV</label>
                      <input
                        type="password"
                        required
                        placeholder="***"
                        maxLength={3}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-black border border-neutral-800 text-white px-3 py-2.5 text-xs focus:outline-none focus:border-neutral-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-brand-charcoal border border-neutral-950 p-4 space-y-2">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Cart Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Delivery Fee</span>
                  <span>৳{deliveryCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white border-t border-neutral-900 pt-2 mt-2">
                  <span>Total Payable</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-black hover:text-white border border-white py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300 disabled:bg-neutral-800 disabled:border-neutral-800 disabled:text-neutral-500"
              >
                {isSubmitting 
                  ? 'PROCESSING ORDER...' 
                  : paymentMethod === 'cod' 
                    ? 'CONFIRM CASH ON DELIVERY' 
                    : paymentMethod === 'bkash' 
                      ? 'CONFIRM BKASH PAYMENT' 
                      : 'PAY WITH CREDIT CARD'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
