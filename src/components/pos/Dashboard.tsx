
import React from 'react';
import { usePOS } from '@/contexts/POSContext';
import DayStatus from './DayStatus';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { orders, dayOpen } = usePOS();
  
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
    </div>
  );
};

export default Dashboard;
