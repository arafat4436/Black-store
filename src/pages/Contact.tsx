import React from 'react';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, Search, Package, Clock, Truck, CheckCircle } from 'lucide-react';
import type { Order } from '../types';

interface FAQItem {
  question: string;
  answer: string;
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    orderId: '',
    message: '',
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);

  // Guest Order Tracking State
  const [trackingInput, setTrackingInput] = React.useState('');
  const [trackedOrders, setTrackedOrders] = React.useState<Order[]>([]);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', orderId: '', message: '' });
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    const input = trackingInput.trim().toUpperCase();
    if (!input) {
      setTrackedOrders([]);
      return;
    }

    // Load orders directly from localStorage
    const savedOrders: Order[] = JSON.parse(
      localStorage.getItem('dark_matter_orders') || '[]'
    );

    // Search by Order ID (exact match) or Customer Phone (match digits)
    const matches = savedOrders.filter(
      (order) => 
        order.orderId.toUpperCase() === input || 
        order.customer.phone.replace(/[-\s]/g, '') === input.replace(/[-\s]/g, '')
    );

    setTrackedOrders(matches);
  };

  const faqs: FAQItem[] = [
    {
      question: 'HOW DO I WASH MY HEAVYWEIGHT HOODIE?',
      answer: 'To preserve the 450 GSM fleece fabric and boxy fit, we recommend washing the garment inside out in cold water. Avoid bleach. Air-dry / hang-dry is highly recommended. If using a dryer, tumble dry on low heat to prevent shrinkage.',
    },
    {
      question: 'WHAT ARE THE SHIPPING FEES AND DELIVERY TIMES IN BANGLADESH?',
      answer: 'We deliver nationwide in Bangladesh. Delivery inside Dhaka is ৳80 (takes 1-3 business days). Delivery outside Dhaka is ৳150 (takes 3-5 business days). Cash on Delivery (COD) is available for all regions.',
    },
    {
      question: 'WHAT IS YOUR EXCHANGE AND RETURN POLICY?',
      answer: 'We accept sizing exchanges within 7 days of delivery. The item must be in its original condition (unwashed, unworn, with tags attached). Customers are responsible for the return shipping cost, or exchanges can be processed at our hub. Returns for refunds are only approved for defective items.',
    },
    {
      question: 'HOW CAN I TRACK MY ORDER?',
      answer: 'Once your order is processed, you will receive a tracking link via SMS to follow your delivery status through our logistics partner (Pathao / SteadFast / Paperfly). You can also use our Quick Order Lookup tool on this page.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Ordered':
        return <Package className="w-5 h-5 text-neutral-400" />;
      case 'Processing':
        return <Clock className="w-5 h-5 text-white animate-pulse" />;
      case 'Shipped via Courier':
        return <Truck className="w-5 h-5 text-white" />;
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-white" />;
      default:
        return <Package className="w-5 h-5 text-neutral-400" />;
    }
  };

  return (
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen animate-fade-in font-sans">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
          SUPPORT & CONTACT
        </h1>
        <p className="text-neutral-500 text-sm font-light max-w-md mx-auto">
          Need help with your order or want to track your package? Choose an option below.
        </p>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Contact Form */}
        <div className="bg-brand-charcoal border border-neutral-900 p-8">
          <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-6">
            SEND AN INQUIRY
          </h2>

          {submitted ? (
            <div className="bg-neutral-950 border border-neutral-800 p-8 text-center text-brand-silver font-semibold text-sm uppercase tracking-widest my-8 animate-fade-in">
              ✓ MESSAGE SENT. Our team will contact you within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">ORDER ID (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="#DM-1049"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    className="w-full bg-black border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">MESSAGE</label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black hover:bg-black hover:text-white border border-white py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300"
              >
                SUBMIT MESSAGE
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Details */}
        <div className="flex flex-col justify-between space-y-8">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-6">
              GET IN TOUCH
            </h2>
            <p className="text-neutral-400 font-light text-sm leading-relaxed mb-6">
              Our support team operates Sunday to Thursday, 10:00 AM to 6:00 PM (GMT+6). For urgent queries regarding sizing or exchanges, feel free to call our support line.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-brand-charcoal p-4 border border-neutral-950">
                <Phone className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">CALL US</p>
                  <p className="text-sm font-semibold text-white">+880 1712-345678</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-brand-charcoal p-4 border border-neutral-950">
                <Mail className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">EMAIL SUPPORT</p>
                  <p className="text-sm font-semibold text-white">support@darkmatter.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-brand-charcoal p-4 border border-neutral-950">
                <MapPin className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">HQ / DISTRIBUTION</p>
                  <p className="text-sm font-semibold text-white">Banani Road 11, Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Order Lookup Panel */}
      <div className="bg-brand-charcoal border border-neutral-900 p-6 md:p-8 mb-20">
        <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-2">
          <Search className="w-5 h-5" />
          QUICK ORDER LOOKUP
        </h2>
        <p className="text-neutral-500 text-xs font-light mb-6">
          Track your package instantly. Input your 5-digit Order ID (e.g. DM-12345) or the 11-digit phone number used during checkout.
        </p>

        <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-2 max-w-xl mb-6">
          <input
            type="text"
            required
            placeholder="ENTER ORDER ID OR PHONE NUMBER"
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            className="flex-1 bg-black border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 font-sans tracking-wide"
          />
          <button
            type="submit"
            className="bg-white text-black hover:bg-black hover:text-white border border-white px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors duration-300"
          >
            TRACK STATUS
          </button>
        </form>

        {/* Tracking results */}
        {hasSearched && (
          <div className="border-t border-neutral-950 pt-6 animate-fade-in">
            {trackedOrders.length === 0 ? (
              <div className="text-red-400 text-xs font-light py-2">
                No orders found matching "{trackingInput}". Verify the ID/phone number and try again.
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Matching Orders Found ({trackedOrders.length})</p>
                {trackedOrders.map((order) => (
                  <div key={order.orderId} className="bg-neutral-950 border border-neutral-900 p-5 md:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-900 pb-4 gap-2">
                      <div>
                        <span className="text-sm font-bold text-white font-mono">{order.orderId}</span>
                        <p className="text-[10px] text-neutral-500 font-light mt-0.5">Placed on: {order.date}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-brand-charcoal border border-neutral-850 px-3 py-1.5 text-xs text-white font-bold uppercase tracking-wide">
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light text-neutral-400">
                      <div>
                        <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Shipping details</p>
                        <p className="font-semibold text-white">{order.customer.name}</p>
                        <p className="mt-0.5">{order.customer.address}</p>
                        <p className="mt-0.5 uppercase text-[9px] font-bold text-neutral-500">
                          {order.customer.district === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}
                        </p>
                      </div>
                      <div className="md:text-right flex flex-col md:justify-between h-full">
                        <div>
                          <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Summary</p>
                          <p>Items in shipment: {order.items.reduce((acc, i) => acc + i.quantity, 0)}</p>
                          <p className="uppercase text-[9px] mt-0.5">Method: {order.paymentMethod}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Amount Payable</p>
                          <p className="text-base font-black text-white">৳{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="border-t border-neutral-900 pt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight mb-10 text-center">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className="bg-brand-charcoal border border-neutral-900 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-neutral-400 text-xs md:text-sm font-light leading-relaxed border-t border-neutral-950 pt-4 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
