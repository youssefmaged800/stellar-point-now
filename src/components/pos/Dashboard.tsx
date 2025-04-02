
import React, { useState, useEffect } from 'react';
import { usePOS } from '@/contexts/POSContext';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Clock, 
  Banknote, 
  CreditCard as CardIcon, 
  QrCode 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Dashboard: React.FC = () => {
  const { orders } = usePOS();
  const [salesData, setSalesData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]);

  useEffect(() => {
    if (orders.length === 0) return;

    // Generate sales data by hour
    const hourlyData: { [key: string]: number } = {};
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = 0;
    }

    // Count orders by payment method
    const paymentCounts = { cash: 0, card: 0, qr: 0 };

    orders.forEach(order => {
      const hour = new Date(order.timestamp).getHours();
      hourlyData[hour] += order.total;
      
      if (order.paymentMethod === 'cash') paymentCounts.cash++;
      if (order.paymentMethod === 'card') paymentCounts.card++;
      if (order.paymentMethod === 'qr') paymentCounts.qr++;
    });

    // Format for charts
    const hourlyChartData = Object.entries(hourlyData).map(([hour, amount]) => ({
      hour: `${hour}:00`,
      amount
    }));

    const paymentChartData = [
      { name: 'Cash', value: paymentCounts.cash },
      { name: 'Card', value: paymentCounts.card },
      { name: 'QR', value: paymentCounts.qr }
    ];

    setSalesData(hourlyChartData);
    setPaymentData(paymentChartData);
  }, [orders]);

  // Calculate totals
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  const COLORS = ['#1E40AF', '#3B82F6', '#93C5FD'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Sales" 
          value={`$${totalSales.toFixed(2)}`} 
          icon={<TrendingUp />} 
          color="bg-blue-100 text-blue-700"
        />
        <StatCard 
          title="Orders" 
          value={totalOrders.toString()} 
          icon={<ShoppingBag />}
          color="bg-green-100 text-green-700" 
        />
        <StatCard 
          title="Completed" 
          value={completedOrders.toString()} 
          icon={<Clock />}
          color="bg-purple-100 text-purple-700" 
        />
        <StatCard 
          title="Pending" 
          value={pendingOrders.toString()} 
          icon={<Users />}
          color="bg-amber-100 text-amber-700" 
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Hourly Sales</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Bar dataKey="amount" fill="#1E40AF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => [value, 'Orders']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Payment Methods Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PaymentMethodCard 
            method="Cash" 
            icon={<Banknote />} 
            count={orders.filter(o => o.paymentMethod === 'cash').length}
            amount={orders.filter(o => o.paymentMethod === 'cash').reduce((sum, o) => sum + o.total, 0)}
          />
          <PaymentMethodCard 
            method="Card" 
            icon={<CardIcon />} 
            count={orders.filter(o => o.paymentMethod === 'card').length}
            amount={orders.filter(o => o.paymentMethod === 'card').reduce((sum, o) => sum + o.total, 0)}
          />
          <PaymentMethodCard 
            method="QR" 
            icon={<QrCode />} 
            count={orders.filter(o => o.paymentMethod === 'qr').length}
            amount={orders.filter(o => o.paymentMethod === 'qr').reduce((sum, o) => sum + o.total, 0)}
          />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        <div className={`p-2 rounded-full ${color}`}>
          {icon}
        </div>
        <h3 className="ml-2 text-gray-600">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

interface PaymentMethodCardProps {
  method: string;
  icon: React.ReactNode;
  count: number;
  amount: number;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ method, icon, count, amount }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <div className="flex items-center mb-2">
        <div className="p-2 bg-white rounded-full shadow-sm">
          {icon}
        </div>
        <h3 className="ml-2 font-medium">{method}</h3>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Orders: {count}</span>
        <span>${amount.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Dashboard;
