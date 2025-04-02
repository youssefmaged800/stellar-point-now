
import React from 'react';
import { usePOS } from '@/contexts/POSContext';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import OrdersView from './OrdersView';
import KitchenDisplay from './KitchenDisplay';
import InventoryView from './InventoryView';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchBar';
import { format } from 'date-fns';
import { Clock, AlertCircle } from 'lucide-react';

const POSLayout: React.FC = () => {
  const { activeTab, dayOpen, currentTime } = usePOS();

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrdersView />;
      case 'kitchen':
        return <KitchenDisplay />;
      case 'inventory':
        return <InventoryView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with time and status */}
        <header className="bg-white border-b p-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">OMNIPOS</h1>
          
          <div className="flex items-center space-x-4">
            {!dayOpen && (
              <div className="flex items-center text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Business Day Closed</span>
              </div>
            )}
            
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-md">
              <Clock className="w-4 h-4 mr-2 text-gray-600" />
              <span className="font-mono">{format(currentTime, 'hh:mm:ss a')}</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === 'dashboard' ? (
            <div className="flex h-full space-x-4">
              <div className="flex-1 overflow-y-auto">
                {renderActiveContent()}
              </div>
              <div className="w-96">
                <Cart />
              </div>
            </div>
          ) : (
            <div className="flex h-full space-x-4">
              <div className="flex-1 overflow-y-auto">
                {renderActiveContent()}
              </div>
              
              {activeTab !== 'inventory' && activeTab !== 'orders' && activeTab !== 'kitchen' && (
                <div className="w-96 flex flex-col space-y-4">
                  <SearchBar />
                  <CategoryFilter />
                  <ProductGrid />
                </div>
              )}
              
              {activeTab !== 'inventory' && activeTab !== 'orders' && activeTab !== 'kitchen' && (
                <div className="w-96">
                  <Cart />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default POSLayout;
