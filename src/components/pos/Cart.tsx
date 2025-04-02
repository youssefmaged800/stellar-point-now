
import React from 'react';
import { usePOS } from '@/contexts/POSContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import MainComponent from './MainComponent';

const Cart: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartItemQuantity, 
    currency
  } = usePOS();

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Current Order</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Cart is empty
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-500 text-sm">{currency} {item.price.toFixed(2)}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                    className="p-1 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <Minus size={14} />
                  </button>
                  
                  <span className="w-6 text-center">{item.quantity}</span>
                  
                  <button
                    onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                    className="p-1 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <Plus size={14} />
                  </button>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-md ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Replace the payment section with our MainComponent */}
      <MainComponent />
    </div>
  );
};

export default Cart;
