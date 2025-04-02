
import React, { useState } from 'react';
import { usePOS } from '@/contexts/POSContext';
import { Product } from '@/types/pos';
import { Plus, Edit } from 'lucide-react';

const ProductGrid: React.FC = () => {
  const { products, categories, addToCart, selectedCategory, searchTerm, currency } = usePOS();

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <ProductItem 
          key={product.id} 
          product={product} 
          categoryName={getCategoryName(product.category)}
          onAddToCart={() => addToCart(product)} 
          currency={currency}
        />
      ))}
      
      {filteredProducts.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No products found.
        </div>
      )}
    </div>
  );
};

interface ProductItemProps {
  product: Product;
  categoryName: string;
  onAddToCart: () => void;
  currency: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, categoryName, onAddToCart, currency }) => {
  const { dayOpen } = usePOS();
  const [showPriceEdit, setShowPriceEdit] = useState<boolean>(false);
  const [customPrice, setCustomPrice] = useState<string>(product.price.toString());

  const handleAddToCart = () => {
    onAddToCart();
    setShowPriceEdit(false);
  };

  const togglePriceEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPriceEdit(!showPriceEdit);
    setCustomPrice(product.price.toString());
  };

  return (
    <div className="pos-item flex flex-col p-3 border rounded-lg hover:shadow-md transition-shadow">
      <div className="text-xs text-pos-blue font-semibold mb-1">{categoryName}</div>
      <div className="font-medium">{product.name}</div>
      <div className="text-gray-500 text-sm">Stock: {product.quantity}</div>
      
      {showPriceEdit ? (
        <div className="mt-2 flex items-center">
          <span className="mr-1">{currency}</span>
          <input
            type="number"
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            className="border rounded p-1 text-sm w-16"
            step="0.01"
            min="0"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddToCart();
              } else if (e.key === 'Escape') {
                setShowPriceEdit(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={handleAddToCart}
            className="ml-2 bg-pos-blue text-white p-1 rounded-md hover:bg-blue-700 transition-colors"
            disabled={product.quantity <= 0 || !dayOpen}
          >
            <Plus size={18} />
          </button>
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="font-bold">{currency} {product.price.toFixed(2)}</div>
            <button
              onClick={togglePriceEdit}
              className="ml-1 text-gray-500 hover:text-pos-blue transition-colors"
            >
              <Edit size={14} />
            </button>
          </div>
          <button
            onClick={onAddToCart}
            className="bg-pos-blue text-white p-1 rounded-md hover:bg-blue-700 transition-colors"
            disabled={product.quantity <= 0 || !dayOpen}
          >
            <Plus size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
