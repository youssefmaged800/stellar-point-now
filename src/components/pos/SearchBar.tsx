
import React from 'react';
import { usePOS } from '@/contexts/POSContext';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm } = usePOS();

  return (
    <div className="relative">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-500" />
      </div>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="block w-full p-2 ps-10 text-sm border border-gray-300 rounded-lg bg-white"
      />
    </div>
  );
};

export default SearchBar;
