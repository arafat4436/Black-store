import React from 'react';
import { Package, User as UserIcon, LogOut, ChevronDown, ChevronUp, Calendar, MapPin, Truck } from 'lucide-react';
import type { User, Order } from '../types';

interface AccountProps {
  user: User;
  orders: Order[];
  onLogout: () => void;
}

export const Account: React.FC<AccountProps> = ({ user, orders, onLogout }) => {
  const [expandedOrderId, setExpandedOrderId] = React.useState<string | null>(null);

  // Filter orders related to this user
  const userOrders = React.useMemo(() => {
    return orders.filter((o) => o.userPhone === user.phone);
  }, [orders, user.phone]);

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'Ordered':
        return 0;
      case 'Processing':
        return 1;
      case 'Shipped via Courier':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const statusSteps = [
    { label: 'Ordered', desc: 'Order placed successfully' },
    { label: 'Processing', desc: 'Items checked & packed at hub' },
    { label: 'Shipped via Courier', desc: 'Handed over to courier partner' },
    { label: 'Delivered', desc: 'Package delivered to address' },
  ];

  return (
    <div className="py-12 px-4 md:px-8 max-w-5xl mx-auto min-h-screen animate-fade-in font-sans">
      {/* Profile Header */}
      <div className="bg-brand-charcoal border border-neutral-900 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 flex items-center justify-center rounded-none">
            <UserIcon className="w-8 h-8 text-neutral-400" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase text-white tracking-wide">
              {user.name}
            </h1>
            <p className="text-xs text-neutral-500 font-light mt-0.5">
              Phone: {user.phone} {user.email && `| Email: ${user.email}`}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 bg-transparent text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-500 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors duration-300"
        >
          <LogOut className="w-4 h-4" />
          LOG OUT
        </button>
      </div>

      {/* Main Panel - Orders */}
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
          <Package className="w-5 h-5" />
          ORDER HISTORY ({userOrders.length})
        </h2>

        {userOrders.length === 0 ? (
          <div className="text-center py-20 bg-brand-charcoal border border-neutral-950">
            <Package className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
            <p className="text-neutral-500 uppercase font-bold tracking-widest text-xs">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => {
              const isExpanded = expandedOrderId === order.orderId;
              const currentStep = getStatusStep(order.status);

              return (
                <div 
                  key={order.orderId}
                  className="bg-brand-charcoal border border-neutral-900 overflow-hidden transition-colors"
                >
                  {/* Order Overview Header */}
                  <div
                    onClick={() => toggleOrderExpand(order.orderId)}
                    className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-neutral-950/20 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                          {order.orderId}
                        </span>
                        <span className="bg-white/10 text-neutral-300 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-white/5">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-light flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {order.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Total Value</p>
                        <p className="text-sm font-black text-white">৳{order.total.toLocaleString()}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Order Detail & Tracking Timeline */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-4 border-t border-neutral-950 space-y-8 animate-fade-in">
                      {/* Tracking Timeline */}
                      <div>
                        <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" />
                          Live Tracking Timeline
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative pl-4 md:pl-0 border-l border-neutral-800 md:border-l-0">
                          {statusSteps.map((step, idx) => {
                            const isCompleted = idx <= currentStep;
                            const isCurrent = idx === currentStep;

                            return (
                              <div key={idx} className="relative md:text-center space-y-1.5 md:space-y-2">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[21px] md:left-1/2 md:-translate-x-1/2 -top-1 md:-top-3.5">
                                  <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                                    isCompleted 
                                      ? 'bg-white ring-4 ring-white/10' 
                                      : 'bg-neutral-900 border-2 border-neutral-800'
                                  }`}>
                                    {isCurrent && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />}
                                  </div>
                                </div>

                                <p className={`text-xs font-bold uppercase tracking-wider ${
                                  isCompleted ? 'text-white' : 'text-neutral-600'
                                }`}>
                                  {step.label}
                                </p>
                                <p className="text-[10px] text-neutral-500 font-light leading-relaxed max-w-xs md:mx-auto">
                                  {step.desc}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-950">
                        {/* Ordered Items List */}
                        <div className="md:col-span-2 space-y-4">
                          <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Items In Order</h4>
                          {order.items.map((item) => (
                            <div 
                              key={`${item.product.id}-${item.size}`}
                              className="flex gap-4 p-3 bg-neutral-950 border border-neutral-900"
                            >
                              <div className="w-12 h-15 bg-brand-charcoal border border-neutral-900 flex-shrink-0">
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                  <h5 className="text-xs uppercase font-bold text-white tracking-wide">{item.product.name}</h5>
                                  <span className="text-xs font-bold text-neutral-300">৳{item.product.price.toLocaleString()}</span>
                                </div>
                                <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">
                                  Qty: {item.quantity} {item.size !== 'N/A' && `| Size: ${item.size}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipment & Payment Summary */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Shipment Summary</h4>
                          <div className="bg-neutral-950 border border-neutral-900 p-4 space-y-3 text-xs">
                            <div className="flex items-start gap-2 text-neutral-400">
                              <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Delivery Address</p>
                                <p className="font-light mt-0.5 leading-relaxed">{order.customer.address}</p>
                                <p className="font-bold uppercase tracking-widest text-[9px] mt-0.5">
                                  {order.customer.district === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}
                                </p>
                              </div>
                            </div>
                            <div className="border-t border-neutral-900 pt-2 space-y-1 text-neutral-400">
                              <div className="flex justify-between text-[10px]">
                                <span>Subtotal</span>
                                <span>৳{(order.total - order.deliveryCharge).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span>Delivery Fee</span>
                                <span>৳{order.deliveryCharge.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs font-bold text-white border-t border-neutral-900 pt-1.5 mt-1">
                                <span>Paid via</span>
                                <span className="uppercase">{order.paymentMethod}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
