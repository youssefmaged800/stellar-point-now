
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
  dayOpen: boolean;
  currentTime: Date;
  dayStartTime: Date | null;
  currency: string;
  
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
  sendToKitchen: (orderId: string) => void;
  
  getCartTotal: () => number;
  openDay: () => void;
  closeDay: () => void;
  updateProductInventory: (productId: string, newQuantity: number) => void;
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
  const [dayOpen, setDayOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [dayStartTime, setDayStartTime] = useState<Date | null>(null);
  const [currency, setCurrency] = useState<string>('EGP');

  useEffect(() => {
    const mockData = generateMockProducts();
    setProducts(mockData.products);
    setCategories(mockData.categories);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() < 2) {
        if (dayOpen) {
          closeDay();
        }
      }

      if (now.getHours() === 0 && now.getMinutes() === 1 && now.getSeconds() < 2) {
        if (!dayOpen) {
          openDay();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dayOpen]);

  const openDay = () => {
    setDayOpen(true);
    setDayStartTime(new Date());
    toast.success('Business day started');
  };

  const closeDay = () => {
    setDayOpen(false);
    setDayStartTime(null);
    toast.success('Business day closed');
  };

  const updateProductInventory = (productId: string, newQuantity: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, quantity: newQuantity } : product
      )
    );
    toast.success(`Product inventory updated`);
  };

  const addToCart = (product: Product) => {
    if (!dayOpen) {
      toast.error('Cannot add items: Business day is not open');
      return;
    }
    
    if (product.quantity <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Check if we have enough in inventory before adding
        if (existingItem.quantity + 1 > product.quantity) {
          toast.error(`Not enough ${product.name} in inventory`);
          return prevCart;
        }
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

    // Check inventory before updating
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.quantity) {
      toast.error(`Not enough ${product.name} in inventory`);
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
    if (!dayOpen) {
      toast.error('Cannot place order: Business day is not open');
      return;
    }

    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    // Prepare new order
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      status: 'pending',
      total: getCartTotal(),
      paymentMethod: selectedPayment,
      timestamp: new Date(),
      tableNumber: Math.floor(Math.random() * 20) + 1,
      sentToKitchen: false,
    };

    // Update inventory
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        updateProductInventory(product.id, product.quantity - item.quantity);
      }
    });

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    
    // Show success message
    toast.success(`Order #${newOrder.id} placed successfully`);
    toast.success(`Payment received via ${selectedPayment}`, {
      duration: 3000,
    });

    // Automatically send to kitchen
    setTimeout(() => {
      sendToKitchen(newOrder.id);
    }, 500);

    clearCart();
  };

  const sendToKitchen = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, sentToKitchen: true } : order
      )
    );
    toast.success(`Order #${orderId} sent to kitchen`);
  };

  const completeOrder = (orderId: string) => {
    if (!dayOpen) {
      toast.error('Cannot complete order: Business day is not open');
      return;
    }
    
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'completed' } : order
      )
    );
    toast.success(`Order #${orderId} completed`);
  };

  const cancelOrder = (orderId: string) => {
    const orderToCancel = orders.find(order => order.id === orderId);
    if (orderToCancel) {
      // Return items to inventory
      orderToCancel.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          updateProductInventory(product.id, product.quantity + item.quantity);
        }
      });
    }

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      )
    );
    toast.error(`Order #${orderId} cancelled`);
  };

  const modifyOrder = (orderId: string) => {
    if (!dayOpen) {
      toast.error('Cannot modify order: Business day is not open');
      return;
    }
    
    const orderToModify = orders.find((order) => order.id === orderId);
    
    if (orderToModify) {
      // Return items to inventory
      orderToModify.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          updateProductInventory(product.id, product.quantity + item.quantity);
        }
      });

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
    dayOpen,
    currentTime,
    dayStartTime,
    currency,
    
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
    sendToKitchen,
    
    getCartTotal,
    openDay,
    closeDay,
    updateProductInventory,
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
};
