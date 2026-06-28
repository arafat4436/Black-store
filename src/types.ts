export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Apparel' | 'Accessories' | 'Footwear';
  image: string;
  description: string;
}

export interface CartItem {
  product: Product;
  size: 'M' | 'L' | 'XL' | 'XXL' | 'N/A';
  quantity: number;
}

export interface User {
  name: string;
  phone: string;
  email?: string;
}

export interface Order {
  orderId: string;
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    address: string;
    district: string;
  };
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  date: string;
  status: 'Ordered' | 'Processing' | 'Shipped via Courier' | 'Delivered';
  userPhone?: string; // Links order to user account
}
