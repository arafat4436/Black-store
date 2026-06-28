import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Account } from './pages/Account';
import { AdminPanel } from './pages/AdminPanel';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AdminLogin } from './components/AdminLogin';
import { products as defaultProducts } from './data/products';
import type { Product, CartItem, Order, User } from './types';

function App() {
  const [currentPage, setCurrentPage] = React.useState<string>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false);
  const [cartItems, setCartItems] = React.useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dark_matter_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentUser, setCurrentUser] = React.useState<User | null>(() => {
    const saved = localStorage.getItem('dark_matter_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = React.useState<Order[]>(() => {
    const saved = localStorage.getItem('dark_matter_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [productsList, setProductsList] = React.useState<Product[]>(() => {
    const saved = localStorage.getItem('dark_matter_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [cartOpen, setCartOpen] = React.useState(false);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  // Sync cart to localStorage
  React.useEffect(() => {
    localStorage.setItem('dark_matter_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync user session to localStorage
  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dark_matter_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dark_matter_currentUser');
    }
  }, [currentUser]);

  // Sync orders to localStorage
  React.useEffect(() => {
    localStorage.setItem('dark_matter_orders', JSON.stringify(orders));
  }, [orders]);

  // Sync products to localStorage
  React.useEffect(() => {
    localStorage.setItem('dark_matter_products', JSON.stringify(productsList));
  }, [productsList]);

  // Toast timer auto-clear
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAddToCart = (product: Product, size: 'M' | 'L' | 'XL' | 'XXL' | 'N/A') => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      } else {
        return [...prevItems, { product, size, quantity: 1 }];
      }
    });
    // Trigger toast notification instead of opening cart drawer
    const sizeText = size !== 'N/A' ? ` (${size})` : '';
    setToast(`ADDED: ${product.name}${sizeText}`);
  };

  const handleUpdateQuantity = (productId: string, size: string, change: number) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product.id === productId && item.size === size) {
          const newQty = item.quantity + change;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      });
    });
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckoutOpen = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        if (order.orderId === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
    });
  };

  const handleAddProduct = (newProduct: Product) => {
    setProductsList((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('account');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} products={productsList} />;
      case 'shop':
        return <Shop onAddToCart={handleAddToCart} products={productsList} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'account':
        return currentUser ? (
          <Account user={currentUser} orders={orders} onLogout={handleLogout} />
        ) : (
          <Home onNavigate={setCurrentPage} products={productsList} />
        );
      default:
        return <Home onNavigate={setCurrentPage} products={productsList} />;
    }
  };

  // Scroll to top on page change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  if (currentPage === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin 
          onLogin={() => setIsAdminAuthenticated(true)} 
          onBackToStore={() => setCurrentPage('home')} 
        />
      );
    }
    return (
      <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white selection:text-black">
        <AdminPanel 
          orders={orders} 
          onUpdateOrderStatus={handleUpdateOrderStatus} 
          products={productsList} 
          onAddProduct={handleAddProduct}
          onLogout={() => {
            setIsAdminAuthenticated(false);
            setCurrentPage('home');
          }}
        />
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 bg-white text-black border border-white px-6 py-4 flex items-center gap-3 animate-fade-in shadow-2xl font-sans text-xs font-bold uppercase tracking-widest">
            <span className="bg-black text-white w-5 h-5 flex items-center justify-center font-bold text-[10px]">✓</span>
            <span>{toast}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Navigation Header */}
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        cartItems={cartItems}
        onOpenCart={() => setCartOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setAuthOpen(true)}
      />

      {/* Page Content */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* Sliding Cart Drawer Overlay */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckoutOpen}
      />

      {/* Centered COD Checkout Popup Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* User Login/Register Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={handleLogin}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-white text-black border border-white px-6 py-4 flex items-center gap-3 animate-fade-in shadow-2xl font-sans text-xs font-bold uppercase tracking-widest">
          <span className="bg-black text-white w-5 h-5 flex items-center justify-center font-bold text-[10px]">✓</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default App;
