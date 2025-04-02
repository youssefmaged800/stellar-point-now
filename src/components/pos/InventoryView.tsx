
import React, { useState } from 'react';
import { usePOS } from '@/contexts/POSContext';
import { Product } from '@/types/pos';
import { Search, Filter, Plus, Minus, Edit } from 'lucide-react';

const InventoryView: React.FC = () => {
  const { products, categories, updateProductInventory, currency } = usePOS();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const startEditing = (product: Product) => {
    setEditingProduct(product.id);
    setEditQuantity(product.quantity);
  };

  const saveInventoryChange = (productId: string) => {
    updateProductInventory(productId, editQuantity);
    setEditingProduct(null);
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (categoryFilter === 'all' || product.category === categoryFilter)
    )
    .sort((a, b) => {
      const key = sortBy as keyof Product;
      
      if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return sortOrder === 'asc' 
          ? (a[key] as string).localeCompare(b[key] as string)
          : (b[key] as string).localeCompare(a[key] as string);
      }
      
      if (typeof a[key] === 'number' && typeof b[key] === 'number') {
        return sortOrder === 'asc'
          ? (a[key] as number) - (b[key] as number)
          : (b[key] as number) - (a[key] as number);
      }
      
      return 0;
    });

  const getLowStockCount = () => {
    return products.filter(p => p.quantity < 10).length;
  };

  const getTotalStockValue = () => {
    return products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  };
  
  const getTotalStockItems = () => {
    return products.reduce((sum, product) => sum + product.quantity, 0);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Low Stock Items</h3>
          <p className="text-2xl font-bold">{getLowStockCount()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Stock Value</h3>
          <p className="text-2xl font-bold">{currency} {getTotalStockValue().toFixed(2)}</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-grow">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="block w-full p-2 ps-10 text-sm border border-gray-300 rounded-lg bg-white"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="p-2 text-sm border border-gray-300 rounded-lg bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="p-2 text-sm border border-gray-300 rounded-lg bg-white"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="quantity">Quantity</option>
            <option value="category">Category</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className="p-2 text-sm border border-gray-300 rounded-lg bg-white"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      
      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
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
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">ID: {product.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100">
                        {categories.find(c => c.id === product.category)?.name || product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {currency} {product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editingProduct === product.id ? (
                        <div className="flex items-center">
                          <button
                            onClick={() => setEditQuantity(Math.max(0, editQuantity - 1))}
                            className="p-1 bg-gray-200 rounded"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-16 mx-2 border rounded p-1 text-center"
                            min="0"
                          />
                          <button
                            onClick={() => setEditQuantity(editQuantity + 1)}
                            className="p-1 bg-gray-200 rounded"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => saveInventoryChange(product.id)}
                            className="ml-2 bg-green-500 text-white p-1 px-2 rounded"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span>{product.quantity}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingProduct === product.id ? (
                        <button 
                          onClick={() => setEditingProduct(null)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button 
                          onClick={() => startEditing(product)} 
                          className="text-indigo-600 hover:text-indigo-800 flex items-center"
                        >
                          <Edit size={14} className="mr-1" /> Edit Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-3 border-t">
          <div className="text-sm text-gray-500">
            {filteredProducts.length} of {products.length} products | Total items in stock: {getTotalStockItems()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
