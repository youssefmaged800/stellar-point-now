
import React from 'react';
import { usePOS } from '@/contexts/POSContext';
import { ViewType } from '@/types/pos';
import { LayoutDashboard, ShoppingCart, ChefHat, PackageSearch, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = usePOS();

  const menuItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'kitchen', label: 'Kitchen', icon: <ChefHat size={20} /> },
    { id: 'inventory', label: 'Inventory', icon: <PackageSearch size={20} /> },
  ];

  return (
    <div className="bg-pos-blue text-white h-screen w-20 md:w-64 flex flex-col shadow-lg">
      <div className="p-4 flex items-center justify-center md:justify-start">
        <CreditCard className="h-8 w-8 mr-2" />
        <h1 className="text-xl font-bold hidden md:block">OMNIPOS</h1>
      </div>
      
      <div className="flex-1 px-2 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center p-2 rounded-md w-full transition-colors",
                  activeTab === item.id 
                    ? "bg-white text-pos-blue" 
                    : "text-white hover:bg-opacity-25 hover:bg-white"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="ml-3 hidden md:block">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 hidden md:block text-xs text-blue-100 text-center md:text-left">
        OMNIPOS v1.0
      </div>
    </div>
  );
};

export default Sidebar;
