
import React from 'react';
import { usePOS } from '@/contexts/POSContext';

const CategoryFilter: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = usePOS();

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto py-2">
      <button
        onClick={() => setSelectedCategory('all')}
        className={`px-4 py-1 rounded-full whitespace-nowrap ${
          selectedCategory === 'all'
            ? 'bg-pos-blue text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`px-4 py-1 rounded-full whitespace-nowrap ${
            selectedCategory === category.id
              ? 'bg-pos-blue text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
