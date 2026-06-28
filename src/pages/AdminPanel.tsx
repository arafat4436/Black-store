import React from 'react';
import { BarChart3, ClipboardList, PlusSquare, DollarSign, Layers, ShoppingBag, LogOut, Users, ExternalLink, CheckCircle, AlertCircle, Settings, Edit2, Trash2, X, Upload } from 'lucide-react';
import type { Order, Product, User } from '../types';
import { getGoogleSheetUrl, setGoogleSheetUrl } from '../utils/googleSheets';

const IMGBB_API_KEY = 'c5f018eb93c2c5d8e1c0360454869faa';

interface AdminPanelProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  users: User[];
  onLogout?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  onUpdateOrderStatus,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  users,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = React.useState<'analytics' | 'orders' | 'products' | 'customers' | 'settings'>('analytics');
  
  // Product form state
  const [newProduct, setNewProduct] = React.useState({
    name: '',
    category: 'Apparel' as Product['category'],
    price: '',
    image: '',
    description: '',
  });
  const [editingProductId, setEditingProductId] = React.useState<string | null>(null);
  const [productSuccess, setProductSuccess] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Analytics calculations
  const analytics = React.useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    const statusCounts = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const categoryCounts = products.reduce(
      (acc, prod) => {
        acc[prod.category] = (acc[prod.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalOrders,
      totalRevenue,
      statusCounts,
      categoryCounts,
    };
  }, [orders, products]);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.description) return;

    const priceNum = parseFloat(newProduct.price);
    if (isNaN(priceNum)) return;

    let imageUrl = newProduct.image.trim() || './images/tee-stealth.png';

    // Upload image to ImgBB if a file was selected
    if (imageFile) {
      try {
        setUploadProgress(10);
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('key', IMGBB_API_KEY);

        const response = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData,
        });

        setUploadProgress(80);
        const data = await response.json();

        if (data.success) {
          imageUrl = data.data.display_url;
          setUploadProgress(100);
        } else {
          console.error('ImgBB upload failed:', data);
          setUploadProgress(null);
          return;
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        setUploadProgress(null);
        return;
      }
    }

    const productToSave: Product = {
      id: editingProductId || `prod-${newProduct.category.toLowerCase()}-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      price: priceNum,
      image: imageUrl,
      description: newProduct.description,
    };

    if (editingProductId) {
      onUpdateProduct(productToSave);
    } else {
      onAddProduct(productToSave);
    }
    
    setProductSuccess(true);
    setEditingProductId(null);
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(null);
    setNewProduct({
      name: '',
      category: 'Apparel',
      price: '',
      image: '',
      description: '',
    });

    setTimeout(() => setProductSuccess(false), 3000);
  };

  const handleEditClick = (prod: Product) => {
    setEditingProductId(prod.id);
    setNewProduct({
      name: prod.name,
      category: prod.category,
      price: prod.price.toString(),
      image: prod.image,
      description: prod.description,
    });
    setImageFile(null);
    setImagePreview(prod.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Google Sheet URL state
  const [sheetUrl, setSheetUrl] = React.useState(getGoogleSheetUrl());
  const [sheetSaved, setSheetSaved] = React.useState(false);

  const handleSaveSheetUrl = () => {
    setGoogleSheetUrl(sheetUrl.trim());
    setSheetSaved(true);
    setTimeout(() => setSheetSaved(false), 3000);
  };

  const handleDisconnectSheet = () => {
    setSheetUrl('');
    setGoogleSheetUrl('');
  };

  const isSheetConnected = getGoogleSheetUrl().length > 0;

  return (
    <div className="py-12 px-4 md:px-8 lg:px-16 w-full min-h-screen bg-black animate-fade-in font-sans">
      {/* Title */}
      <div className="mb-12 border-b border-neutral-900 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-2 leading-none">
            COMMAND CENTER
          </h1>
          <p className="text-neutral-500 text-sm font-light uppercase tracking-widest">
            Dark Matter Staff Portal
          </p>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors md:mb-2 border border-neutral-900 px-4 py-2 hover:border-neutral-500"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-5 py-4 text-xs font-bold uppercase tracking-widest border transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-black border-white'
                : 'bg-brand-charcoal text-neutral-400 border-neutral-900 hover:border-neutral-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            📊 Analytics Overview
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-5 py-4 text-xs font-bold uppercase tracking-widest border transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-black border-white'
                : 'bg-brand-charcoal text-neutral-400 border-neutral-900 hover:border-neutral-700'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            🚚 Order Management
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-5 py-4 text-xs font-bold uppercase tracking-widest border transition-all ${
              activeTab === 'products'
                ? 'bg-white text-black border-white'
                : 'bg-brand-charcoal text-neutral-400 border-neutral-900 hover:border-neutral-700'
            }`}
          >
            <PlusSquare className="w-4 h-4" />
            📦 Product Manager
          </button>
          
          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full flex items-center gap-3 px-5 py-4 text-xs font-bold uppercase tracking-widest border transition-all ${
              activeTab === 'customers'
                ? 'bg-white text-black border-white'
                : 'bg-brand-charcoal text-neutral-400 border-neutral-900 hover:border-neutral-700'
            }`}
          >
            <Users className="w-4 h-4" />
            👥 Users & Customers
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-5 py-4 text-xs font-bold uppercase tracking-widest border transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-black border-white'
                : 'bg-brand-charcoal text-neutral-400 border-neutral-900 hover:border-neutral-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            ⚙️ Settings
          </button>
        </div>

        {/* Main Workspace Area */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: ANALYTICS OVERVIEW */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-xl font-bold uppercase tracking-wider text-white">System Metrics</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="bg-brand-charcoal border border-neutral-900 p-6 flex flex-col justify-between h-36">
                  <div className="flex justify-between items-center text-neutral-500">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Total Revenue</span>
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-black text-white">৳{analytics.totalRevenue.toLocaleString()}</p>
                    <p className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest mt-1">Gross sales in BDT</p>
                  </div>
                </div>

                {/* Orders Count Card */}
                <div className="bg-brand-charcoal border border-neutral-900 p-6 flex flex-col justify-between h-36">
                  <div className="flex justify-between items-center text-neutral-500">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Total Orders</span>
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-black text-white">{analytics.totalOrders}</p>
                    <p className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest mt-1">Items shipped & pending</p>
                  </div>
                </div>

                {/* Active Products Card */}
                <div className="bg-brand-charcoal border border-neutral-900 p-6 flex flex-col justify-between h-36">
                  <div className="flex justify-between items-center text-neutral-500">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Active Drops</span>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-black text-white">{products.length}</p>
                    <p className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest mt-1">Catalog items listed</p>
                  </div>
                </div>
              </div>

              {/* Status Breakdown Grid */}
              <div className="bg-brand-charcoal border border-neutral-900 p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 border-b border-neutral-950 pb-3">
                  Orders Breakdown by Status
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(['Ordered', 'Processing', 'Shipped via Courier', 'Delivered'] as const).map((status) => {
                    const count = analytics.statusCounts[status] || 0;
                    return (
                      <div key={status} className="bg-black border border-neutral-950 p-4 text-center">
                        <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mb-1">{status}</p>
                        <p className="text-xl font-black text-white">{count}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold uppercase tracking-wider text-white">Manage Shipments</h2>

              {orders.length === 0 ? (
                <div className="text-center py-20 bg-brand-charcoal border border-neutral-950">
                  <p className="text-neutral-500 uppercase font-bold tracking-widest text-xs">No orders placed in system yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-neutral-900">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-brand-charcoal border-b border-neutral-900 text-neutral-400 uppercase tracking-widest font-bold">
                        <th className="p-4 font-bold">Order ID</th>
                        <th className="p-4 font-bold">Customer Details</th>
                        <th className="p-4 font-bold">Shipping Address</th>
                        <th className="p-4 font-bold">Total</th>
                        <th className="p-4 font-bold">Status Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-950">
                      {orders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-brand-charcoal/50 bg-black/40 text-neutral-300">
                          {/* Order ID */}
                          <td className="p-4 font-mono font-bold text-white uppercase tracking-wider whitespace-nowrap">
                            {order.orderId}
                            <p className="text-[9px] text-neutral-500 font-sans font-light tracking-normal mt-0.5">{order.date}</p>
                          </td>

                          {/* Customer */}
                          <td className="p-4">
                            <p className="font-semibold text-white uppercase">{order.customer.name}</p>
                            <p className="font-mono text-neutral-400 text-[10px] mt-0.5">{order.customer.phone}</p>
                          </td>

                          {/* Address */}
                          <td className="p-4 max-w-xs leading-relaxed">
                            <p className="line-clamp-2">{order.customer.address}</p>
                            <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5">
                              {order.customer.district === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}
                            </p>
                          </td>

                          {/* Total */}
                          <td className="p-4 whitespace-nowrap font-semibold text-white">
                            ৳{order.total.toLocaleString()}
                            <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-light mt-0.5">{order.paymentMethod}</p>
                          </td>

                          {/* Status Edit */}
                          <td className="p-4">
                            <div className="relative">
                              <select
                                value={order.status}
                                onChange={(e) => onUpdateOrderStatus(order.orderId, e.target.value as Order['status'])}
                                className="appearance-none bg-black border border-neutral-850 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-2 pr-8 focus:outline-none focus:border-neutral-500 w-full cursor-pointer rounded-none"
                              >
                                <option value="Ordered">Ordered</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped via Courier">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                                <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCT MANAGER */}
          {activeTab === 'products' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-brand-charcoal border border-neutral-900 p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                    {editingProductId ? 'Edit Product' : 'Create New Release Drop'}
                  </h2>
                  {editingProductId && (
                    <button
                      onClick={() => {
                        setEditingProductId(null);
                        setNewProduct({ name: '', category: 'Apparel', price: '', image: '', description: '' });
                      }}
                      className="text-neutral-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      <X className="w-4 h-4" /> Cancel Edit
                    </button>
                  )}
                </div>

                {productSuccess && (
                  <div className="bg-neutral-950 border border-neutral-850 p-4 text-center text-brand-silver font-semibold text-xs uppercase tracking-widest mb-6 animate-fade-in">
                    {editingProductId ? '✓ PRODUCT UPDATED SUCCESSFULLY' : '✓ PRODUCT APPENDED TO STORE CATALOG SUCCESSFUL'}
                  </div>
                )}

                <form onSubmit={handleProductSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">PRODUCT NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Core Utility Oversized Hoodie"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full bg-black border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">CATEGORY</label>
                      <div className="relative">
                        <select
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as Product['category'] })}
                          className="w-full appearance-none bg-black border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 pr-10 rounded-none cursor-pointer"
                        >
                          <option value="Apparel">Apparel</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Footwear">Footwear</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Price BDT */}
                    <div>
                      <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">PRICE IN BDT (৳)</label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 1800"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full bg-black border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">PRODUCT IMAGE</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageSelect(file);
                        }}
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file && file.type.startsWith('image/')) handleImageSelect(file);
                        }}
                        className="w-full bg-black border border-dashed border-neutral-700 hover:border-neutral-500 text-white px-4 py-6 text-sm focus:outline-none cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
                      >
                        {imagePreview ? (
                          <div className="flex items-center gap-4 w-full">
                            <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover border border-neutral-800" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white uppercase truncate">{imageFile ? imageFile.name : 'Current Image'}</p>
                              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Click to change</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-neutral-500" />
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Click or drag image here</p>
                          </>
                        )}
                      </div>
                      {uploadProgress !== null && uploadProgress < 100 && (
                        <div className="mt-2 w-full bg-neutral-900 h-1.5">
                          <div
                            className="bg-white h-1.5 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-2">DESCRIPTION</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Product details, GSM, materials..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full bg-black border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-black hover:text-white border border-white py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300 mt-2"
                  >
                    {editingProductId ? 'SAVE CHANGES' : 'ADD PRODUCT DROP'}
                  </button>
                </form>
              </div>

              {/* Listed Products Mini-Table */}
              <div className="bg-brand-charcoal border border-neutral-900 p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 pb-2 border-b border-neutral-950">
                  Listed Catalog Products ({products.length})
                </h3>
                <div className="space-y-3">
                  {products.map((prod) => (
                    <div key={prod.id} className="flex justify-between items-center bg-black border border-neutral-950 p-3 text-xs">
                      <div>
                        <p className="font-bold text-white uppercase">{prod.name}</p>
                        <p className="text-[10px] text-neutral-500 uppercase mt-0.5">{prod.category} | ID: {prod.id}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-white">৳{prod.price.toLocaleString()}</p>
                        <div className="flex items-center gap-2 border-l border-neutral-800 pl-4">
                          <button
                            onClick={() => handleEditClick(prod)}
                            className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to permanently delete "${prod.name}"?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="p-2 text-red-900 hover:text-red-500 hover:bg-red-950/30 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: USERS & CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold uppercase tracking-wider text-white">Registered Users</h2>

              {users.length === 0 ? (
                <div className="text-center py-20 bg-brand-charcoal border border-neutral-950">
                  <p className="text-neutral-500 uppercase font-bold tracking-widest text-xs">No registered users found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-neutral-900">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-brand-charcoal border-b border-neutral-900 text-neutral-400 uppercase tracking-widest font-bold">
                        <th className="p-4 font-bold">Name</th>
                        <th className="p-4 font-bold">Phone Number</th>
                        <th className="p-4 font-bold">Email Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-950">
                      {users.map((user, i) => (
                        <tr key={i} className="hover:bg-brand-charcoal/50 bg-black/40 text-neutral-300">
                          <td className="p-4 font-semibold text-white uppercase">{user.name}</td>
                          <td className="p-4 font-mono tracking-wider">{user.phone}</td>
                          <td className="p-4">{user.email || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GOOGLE SHEETS INTEGRATION & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fade-in">
              {/* Connection Status Banner */}
              <div className={`border p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                isSheetConnected 
                  ? 'bg-green-950/20 border-green-900/50' 
                  : 'bg-brand-charcoal border-neutral-900'
              }`}>
                <div className="flex items-start gap-4">
                  {isSheetConnected ? (
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-neutral-500 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-white">
                      {isSheetConnected ? 'Google Sheet Connected' : 'Google Sheet Not Connected'}
                    </h2>
                    <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-bold">
                      {isSheetConnected 
                        ? 'User registrations and orders are syncing to your Google Sheet in real-time.' 
                        : 'Paste your Google Apps Script URL below to enable real-time data sync.'}
                    </p>
                  </div>
                </div>
                {isSheetConnected && (
                  <button
                    onClick={handleDisconnectSheet}
                    className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest transition-colors border border-red-900/50 px-4 py-2 hover:border-red-700 shrink-0"
                  >
                    Disconnect
                  </button>
                )}
              </div>

              {/* URL Configuration */}
              <div className="bg-brand-charcoal border border-neutral-900 p-6 md:p-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 pb-3 border-b border-neutral-950">
                  Google Apps Script Web App URL
                </h3>

                {sheetSaved && (
                  <div className="bg-green-950/20 border border-green-900/50 p-4 text-center text-green-400 font-semibold text-xs uppercase tracking-widest mb-6 animate-fade-in">
                    ✓ Google Sheet URL saved successfully
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    className="flex-1 bg-black border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-neutral-500 font-mono"
                  />
                  <button
                    onClick={handleSaveSheetUrl}
                    disabled={!sheetUrl.trim()}
                    className="bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors shrink-0"
                  >
                    Save & Connect
                  </button>
                </div>
                <p className="text-[10px] text-neutral-600 mt-3 uppercase tracking-widest font-bold">
                  Deploy your Google Apps Script as a Web App and paste the URL here.
                </p>
              </div>

              {/* How It Works */}
              <div className="bg-brand-charcoal border border-neutral-900 p-6 md:p-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 pb-3 border-b border-neutral-950">
                  How Real-Time Sync Works
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-black border border-neutral-950 p-5 text-center">
                    <div className="text-2xl mb-3">👤</div>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">User Registers</p>
                    <p className="text-xs text-neutral-400">Name, phone, and email are automatically sent to the "Users" tab.</p>
                  </div>
                  <div className="bg-black border border-neutral-950 p-5 text-center">
                    <div className="text-2xl mb-3">🛒</div>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Order Placed</p>
                    <p className="text-xs text-neutral-400">Order ID, customer info, total, and payment method go to the "Orders" tab.</p>
                  </div>
                  <div className="bg-black border border-neutral-950 p-5 text-center">
                    <div className="text-2xl mb-3">📊</div>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">View Anytime</p>
                    <p className="text-xs text-neutral-400">Open your Google Sheet from any device to see all data in real-time.</p>
                  </div>
                </div>
              </div>

              {/* Open Sheet Link */}
              {isSheetConnected && (
                <div className="bg-brand-charcoal border border-neutral-900 p-6 text-center">
                  <a
                    href="https://sheets.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white hover:text-neutral-300 text-xs font-bold uppercase tracking-widest transition-colors border border-neutral-700 px-6 py-3 hover:border-neutral-500"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Google Sheets
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
