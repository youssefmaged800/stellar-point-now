
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, Category, ViewType, PaymentMethod } from '../types/pos';
import { toast } from 'sonner';
import { generateMockProducts } from '../utils/mockData';

interface POSContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  categories: Category[];
  activeTab: ViewType;
  searchTerm: string;
  selectedCategory: string;
  selectedPayment: PaymentMethod | null;
  
  setActiveTab: (tab: ViewType) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedPayment: (method: PaymentMethod) => void;
  
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  placeOrder: () => void;
  completeOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  modifyOrder: (orderId: string) => void;
  
  getCartTotal: () => number;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const usePOS = () => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};

interface POSProviderProps {
  children: ReactNode;
}

export const POSProvider: React.FC<POSProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<ViewType>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  // Initialize with mock data
  useEffect(() => {
    const mockData = generateMockProducts();
    setProducts(mockData.products);
    setCategories(mockData.categories);
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    
    toast.success(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.success(`Item removed from cart`);
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectedPayment(null);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      status: 'pending',
      total: getCartTotal(),
      paymentMethod: selectedPayment,
      timestamp: new Date(),
      tableNumber: Math.floor(Math.random() * 20) + 1,
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    toast.success(`Order #${newOrder.id} placed successfully`);
    clearCart();
  };

  const completeOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'completed' } : order
      )
    );
    toast.success(`Order #${orderId} completed`);
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      )
    );
    toast.error(`Order #${orderId} cancelled`);
  };

  const modifyOrder = (orderId: string) => {
    const orderToModify = orders.find((order) => order.id === orderId);
    
    if (orderToModify) {
      setCart(orderToModify.items);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      toast.info(`Modifying order #${orderId}`);
    }
  };

  const value = {
    products,
    cart,
    orders,
    categories,
    activeTab,
    searchTerm,
    selectedCategory,
    selectedPayment,
    
    setActiveTab,
    setSearchTerm,
    setSelectedCategory,
    setSelectedPayment,
    
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    
    placeOrder,
    completeOrder,
    cancelOrder,
    modifyOrder,
    
    getCartTotal,
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
};
