
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

const POSLayout: React.FC = () => {
  const { activeTab } = usePOS();

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
        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === 'dashboard' ? (
            renderActiveContent()
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
