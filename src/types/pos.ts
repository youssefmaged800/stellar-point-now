
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  quantity: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  paymentMethod: 'cash' | 'card' | 'qr';
  timestamp: Date;
  tableNumber?: number;
}

export interface Category {
  id: string;
  name: string;
}

export type PaymentMethod = 'cash' | 'card' | 'qr';
export type ViewType = 'dashboard' | 'orders' | 'kitchen' | 'inventory';
