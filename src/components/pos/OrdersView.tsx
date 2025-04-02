
import React, { useState } from 'react';
import { usePOS } from '@/contexts/POSContext';
import { Order } from '@/types/pos';
import { 
  Check, 
  X, 
  Edit, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Filter
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const OrdersView: React.FC = () => {
  const { orders, completeOrder, cancelOrder, modifyOrder } = usePOS();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .filter(order => order.id.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      
      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-grow">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order ID..."
              className="block w-full p-2 ps-10 text-sm border border-gray-300 rounded-lg bg-white"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 text-sm border border-gray-300 rounded-lg bg-white"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatusCard 
          title="Pending" 
          count={pendingOrders} 
          icon={<Clock className="w-5 h-5" />} 
          color="text-amber-500 bg-amber-100" 
        />
        <StatusCard 
          title="Completed" 
          count={completedOrders} 
          icon={<CheckCircle className="w-5 h-5" />} 
          color="text-green-500 bg-green-100" 
        />
        <StatusCard 
          title="Cancelled" 
          count={cancelledOrders} 
          icon={<AlertCircle className="w-5 h-5" />} 
          color="text-red-500 bg-red-100" 
        />
      </div>
      
      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onComplete={completeOrder}
                    onCancel={cancelOrder}
                    onModify={modifyOrder}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface StatusCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, count, icon, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface OrderRowProps {
  order: Order;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onModify: (id: string) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, onComplete, onCancel, onModify }) => {
  const statusStyles = {
    pending: 'bg-amber-100 text-amber-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {order.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDistanceToNow(new Date(order.timestamp), { addSuffix: true })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {order.items.length}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        ${order.total.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
        {order.paymentMethod}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
          statusStyles[order.status as keyof typeof statusStyles]
        }`}>
          {order.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          {order.status === 'pending' && (
            <>
              <button
                onClick={() => onComplete(order.id)}
                className="text-green-600 hover:text-green-900"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => onModify(order.id)}
                className="text-blue-600 hover:text-blue-900"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => onCancel(order.id)}
                className="text-red-600 hover:text-red-900"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default OrdersView;
