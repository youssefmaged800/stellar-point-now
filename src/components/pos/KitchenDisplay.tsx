
import React, { useState, useEffect } from 'react';
import { usePOS } from '@/contexts/POSContext';
import { Order } from '@/types/pos';
import { Clock, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const KitchenDisplay: React.FC = () => {
  const { orders, completeOrder } = usePOS();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [timers, setTimers] = useState<Record<string, number>>({});

  useEffect(() => {
    // Filter only pending orders
    const pending = orders.filter(order => order.status === 'pending');
    setPendingOrders(pending);

    // Initialize timers for new orders
    const newTimers = { ...timers };
    pending.forEach(order => {
      if (!newTimers[order.id]) {
        // Get seconds since order was created
        const orderTime = new Date(order.timestamp).getTime();
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - orderTime) / 1000);
        newTimers[order.id] = elapsedSeconds;
      }
    });
    setTimers(newTimers);
  }, [orders]);

  // Update timers every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimers(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key] += 1;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getTimerColor = (seconds: number): string => {
    if (seconds < 300) return 'text-green-500'; // Less than 5 minutes
    if (seconds < 600) return 'text-yellow-500'; // Less than 10 minutes
    return 'text-red-500'; // 10 minutes or more
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Kitchen Display</h1>
      
      {pendingOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
          <p className="text-xl">No pending orders</p>
          <p className="mt-2">All caught up! 🎉</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-amber-500"
            >
              <div className="p-4 bg-amber-50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900">{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(order.timestamp), { addSuffix: true })}
                  </p>
                </div>
                <div className={`flex items-center ${getTimerColor(timers[order.id] || 0)}`}>
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="font-mono">{formatTime(timers[order.id] || 0)}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="font-medium mb-2">Items:</h4>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between border-b pb-1">
                      <span>{item.quantity}x {item.name}</span>
                    </li>
                  ))}
                </ul>
                
                {order.tableNumber && (
                  <div className="mt-3 text-sm">
                    <span className="font-medium">Table:</span> {order.tableNumber}
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => completeOrder(order.id)}
                    className="flex items-center bg-pos-success text-white px-3 py-1 rounded-md"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Complete Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KitchenDisplay;
