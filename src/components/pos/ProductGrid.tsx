
import React from 'react';
import { usePOS } from '@/contexts/POSContext';
import { Product } from '@/types/pos';
import { Plus } from 'lucide-react';

const ProductGrid: React.FC = () => {
  const { products, categories, addToCart, selectedCategory, searchTerm } = usePOS();

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
}

const ProductItem: React.FC<ProductItemProps> = ({ product, categoryName, onAddToCart }) => {
  return (
    <div className="pos-item flex flex-col">
      <div className="text-xs text-pos-blue font-semibold mb-1">{categoryName}</div>
      <div className="font-medium">{product.name}</div>
      <div className="text-gray-500 text-sm">Stock: {product.quantity}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="font-bold">${product.price.toFixed(2)}</div>
        <button
          onClick={onAddToCart}
          className="bg-pos-blue text-white p-1 rounded-md hover:bg-blue-700 transition-colors"
          disabled={product.quantity <= 0}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;
