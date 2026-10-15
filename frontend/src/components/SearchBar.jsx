import { useState, useEffect } from 'react';

const SearchBar = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['All Categories', 'Electronics', 'Fashion', 'Books', 'Home'];

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        search: search.trim(),
        category: category === 'All Categories' ? '' : category
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [search, category]); 

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input Field */}
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="SEARCH THE COLLECTION..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-200 focus:border-black text-xs tracking-[0.18em] uppercase placeholder:text-neutral-400 placeholder:normal-case placeholder:tracking-normal text-neutral-900 focus:outline-none transition-all duration-200"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-black text-xs font-mono"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Dropdown */}
      <div className="relative sm:w-60">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-200 focus:border-black text-[11px] uppercase tracking-[0.18em] font-medium text-neutral-900 focus:outline-none transition-all duration-200 cursor-pointer appearance-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All Categories' ? 'ALL CATEGORIES' : cat.toUpperCase()}
            </option>
          ))}
        </select>
        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-400">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
