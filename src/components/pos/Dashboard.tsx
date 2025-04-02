
import React from 'react';
import { usePOS } from '@/contexts/POSContext';
import DayStatus from './DayStatus';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { orders, dayOpen, products, addToCart } = usePOS();
  
  // Calculate sales data for chart
  const completedOrders = orders.filter(order => order.status === 'completed');
  const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  
  // Simple sales by hour chart data
  const salesByHour = Array(24).fill(0).map((_, i) => ({ 
    hour: i, 
    sales: 0 
  }));
  
  completedOrders.forEach(order => {
    const hour = new Date(order.timestamp).getHours();
    salesByHour[hour].sales += order.total;
  });
  
  // Only show hours with sales
  const filteredSalesByHour = salesByHour.filter(item => item.sales > 0);

  // Get low stock inventory items
  const lowStockItems = products.filter(product => product.quantity < 10);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4">
          <DayStatus />
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 md:w-3/4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-1">Today's Sales</h3>
            <p className="text-2xl font-bold text-green-600">${totalSales.toFixed(2)}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-1">Pending Orders</h3>
            <p className="text-2xl font-bold text-amber-600">{pendingOrders}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-1">System Status</h3>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${dayOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-lg font-semibold">{dayOpen ? 'Open' : 'Closed'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Sales by Hour</h3>
        <div className="h-64">
          {filteredSalesByHour.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredSalesByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Sales']}
                  labelFormatter={(hour) => `Hour: ${hour}:00`}
                />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No sales data available
            </div>
          )}
        </div>
      </div>
      
      {/* Inventory section with Add buttons */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Inventory Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-2">{product.quantity}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.quantity <= 0
                        ? 'bg-red-100 text-red-800'
                        : product.quantity < 10
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.quantity <= 0
                        ? 'Out of Stock'
                        : product.quantity < 10
                        ? 'Low Stock'
                        : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <Button 
                      size="sm" 
                      onClick={() => addToCart(product)}
                      disabled={product.quantity <= 0 || !dayOpen}
                      className="flex items-center"
                    >
                      <Plus size={16} className="mr-1" /> Add
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {products.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No inventory items found
            </div>
          )}
        </div>
      </div>
      
      {/* Low stock alert section */}
      {lowStockItems.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-amber-600">Low Stock Alert</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item) => (
              <div key={item.id} className="p-4 border rounded-md bg-amber-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => addToCart(item)}
                    disabled={item.quantity <= 0 || !dayOpen}
                    className="flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
