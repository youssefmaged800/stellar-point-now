
import React from 'react';
import { usePOS } from '@/contexts/POSContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartItemQuantity, 
    clearCart,
    getCartTotal,
    selectedPayment,
    setSelectedPayment,
    placeOrder
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
                  <div className="text-gray-500 text-sm">${item.price.toFixed(2)}</div>
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
      
      <div className="p-4 border-t">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Subtotal:</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-medium">Tax (10%):</span>
          <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total:</span>
          <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => setSelectedPayment('cash')}
            className={`p-2 border rounded-md flex flex-col items-center justify-center ${
              selectedPayment === 'cash' ? 'bg-pos-blue text-white' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className="text-xs">Cash</span>
          </button>
          
          <button
            onClick={() => setSelectedPayment('card')}
            className={`p-2 border rounded-md flex flex-col items-center justify-center ${
              selectedPayment === 'card' ? 'bg-pos-blue text-white' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className="text-xs">Card</span>
          </button>
          
          <button
            onClick={() => setSelectedPayment('qr')}
            className={`p-2 border rounded-md flex flex-col items-center justify-center ${
              selectedPayment === 'qr' ? 'bg-pos-blue text-white' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className="text-xs">QR</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={clearCart}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={cart.length === 0}
          >
            Clear
          </button>
          
          <button
            onClick={placeOrder}
            className="p-2 bg-pos-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={cart.length === 0 || !selectedPayment}
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
