import React, { useEffect } from 'react';
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
import { collection, onSnapshot, doc, getDoc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './lib/firebase';
import { notifyAdminTelegram, notifyCustomerEmail } from './utils/notifications';

function App() {
  const [currentPage, setCurrentPage] = React.useState<string>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false);
  
  // Local cart for guests, will be merged/synced when logged in
  const [cartItems, setCartItems] = React.useState<CartItem[]>(() => {
    const saved = localStorage.getItem('dark_matter_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [productsList, setProductsList] = React.useState<Product[]>(defaultProducts);
  const [usersList, setUsersList] = React.useState<User[]>([]);

  const [cartOpen, setCartOpen] = React.useState(false);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  // 1. Initialize Session & User Data
  useEffect(() => {
    const sessionPhone = localStorage.getItem('dark_matter_session');
    if (sessionPhone) {
      getDoc(doc(db, 'users', sessionPhone)).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCurrentUser({ name: data.name, phone: data.phone, email: data.email });
          if (data.cart) {
            setCartItems(data.cart);
          }
        } else {
          localStorage.removeItem('dark_matter_session');
        }
      }).catch(console.error);
    }
  }, []);

  // 2. Sync Cart to LocalStorage and Firestore
  useEffect(() => {
    localStorage.setItem('dark_matter_cart', JSON.stringify(cartItems));
    if (currentUser) {
      setDoc(doc(db, 'users', currentUser.phone), { cart: cartItems }, { merge: true }).catch(console.error);
    }
  }, [cartItems, currentUser]);

  // 3. Real-time Products Sync
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (snapshot.empty) {
        // Seed default products if db is empty
        defaultProducts.forEach(p => {
          setDoc(doc(db, 'products', p.id), p);
        });
        setProductsList(defaultProducts);
      } else {
        const liveProducts = snapshot.docs.map(doc => doc.data() as Product);
        setProductsList(liveProducts);
      }
    });
    return () => unsubscribe();
  }, []);

  // 4. Real-time Orders Sync (Scoped by role)
  useEffect(() => {
    let q;
    if (isAdminAuthenticated) {
      // Admin sees all orders
      q = collection(db, 'orders');
    } else if (currentUser) {
      // User sees their own orders
      q = query(collection(db, 'orders'), where('customer.phone', '==', currentUser.phone));
    } else {
      setOrders([]);
      return;
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders = snapshot.docs.map(doc => doc.data() as Order);
      // Sort by date descending (newest first)
      liveOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(liveOrders);
    });

    return () => unsubscribe();
  }, [isAdminAuthenticated, currentUser]);

  // 5. Real-time Users Sync for Admin
  useEffect(() => {
    if (isAdminAuthenticated) {
      const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
        const liveUsers = snapshot.docs.map(doc => doc.data() as User);
        setUsersList(liveUsers);
      });
      return () => unsubscribe();
    } else {
      setUsersList([]);
    }
  }, [isAdminAuthenticated]);

  // Toast timer auto-clear
  useEffect(() => {
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

  const handleOrderPlaced = async (newOrder: Order) => {
    // Save order to Firestore
    await setDoc(doc(db, 'orders', newOrder.orderId), newOrder);

    // Notify Admin via Telegram
    notifyAdminTelegram(newOrder);

    // Notify Customer via Email (if they have an email on file)
    if (currentUser?.email) {
      notifyCustomerEmail(newOrder, currentUser.email);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    // Update order status in Firestore
    await setDoc(doc(db, 'orders', orderId), { status: newStatus }, { merge: true });
  };

  const handleAddProduct = async (newProduct: Product) => {
    // Add product to Firestore
    await setDoc(doc(db, 'products', newProduct.id), newProduct);
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    await setDoc(doc(db, 'products', updatedProduct.id), updatedProduct, { merge: true });
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, 'products', productId));
  };

  const handleLogin = async (user: User) => {
    localStorage.setItem('dark_matter_session', user.phone);
    
    // Fetch user's saved cart from Firestore FIRST to avoid race condition with useEffect
    try {
      const docSnap = await getDoc(doc(db, 'users', user.phone));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.cart && data.cart.length > 0) {
          setCartItems(data.cart);
        }
      }
    } catch (e) {
      console.error('Failed to load cloud cart:', e);
    }
    
    // Now set currentUser, so the subsequent useEffect syncs the correct cart
    setCurrentUser(user);
    setCurrentPage('account');
  };

  const handleLogout = () => {
    localStorage.removeItem('dark_matter_session');
    setCurrentUser(null);
    setCartItems([]); // Clear local cart on logout to prevent next user from seeing it
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
  useEffect(() => {
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
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          users={usersList}
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
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        cartItems={cartItems}
        onOpenCart={() => setCartOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setAuthOpen(true)}
      />

      <main className="flex-grow">
        {renderPage()}
      </main>

      <Footer onNavigate={setCurrentPage} />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckoutOpen}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onOrderPlaced={handleOrderPlaced}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={handleLogin}
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

export default App;
