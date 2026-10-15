import { useState, useEffect } from 'react';
import api from '../services/api';
import { getWishlist, toggleWishlistItem } from '../services/api';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [wishlistIds, setWishlistIds] = useState(new Set());

  
  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');

      
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (sortOrder) params.sort = sortOrder;

      const response = await api.get('/products', { params });
      setProducts(response.data.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Something went wrong while loading products.');
    } finally {
      setLoading(false);
    }
  };

  
  const [currentFilters, setCurrentFilters] = useState({});

  
  useEffect(() => {
    fetchProducts();

    const fetchWishlistIds = async () => {
      try {
        const response = await getWishlist();
        const ids = new Set(response.data.wishlist.map((p) => p._id));
        setWishlistIds(ids);
      } catch (err) {
        // silently fail — user may not be logged in
      }
    };
    fetchWishlistIds();
  }, []); 

  
  useEffect(() => {
    fetchProducts(currentFilters);
  }, [sortOrder]); 

  
  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
    fetchProducts({ ...filters });
  };

  const handleWishlistToggle = async (productId) => {
    const response = await toggleWishlistItem(productId);
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (response.data.isWishlisted) {
        next.add(productId);
      } else {
        next.delete(productId);
      }
      return next;
    });
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 fade-in">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-8 mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-medium">Edition 2026</span>
              <span className="text-neutral-300">•</span>
              <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-medium">Ready-To-Wear</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl tracking-[0.2em] font-light text-black uppercase">
              The Collection
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
              {!loading && `[ ${products.length} Pieces ]`}
            </span>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-100">
          <div className="flex-1">
            <SearchBar onFilterChange={handleFilterChange} />
          </div>

          <div className="sm:w-56 shrink-0 relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-200 focus:border-black text-[11px] uppercase tracking-[0.18em] font-medium text-neutral-900 focus:outline-none transition-all duration-200 cursor-pointer appearance-none"
            >
              <option value="">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-neutral-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-28">
            <div className="flex flex-col items-center gap-4">
              <span className="spinner !w-8 !h-8 !border-2"></span>
              <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">Curating Collection…</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center py-28">
            <div className="text-center max-w-md p-8 border border-neutral-200 bg-neutral-50">
              <p className="text-sm uppercase tracking-[0.2em] font-medium text-neutral-900 mb-2">{error}</p>
              <p className="text-xs text-neutral-500 mb-6">Unable to connect to the atelier catalog.</p>
              <button
                onClick={() => fetchProducts(currentFilters)}
                className="px-6 py-2.5 bg-black text-white text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-neutral-800 transition-colors"
              >
                Reload Collection
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="flex items-center justify-center py-28">
            <div className="text-center max-w-md p-10 border border-neutral-200 bg-neutral-50/50">
              <h2 className="font-serif text-2xl tracking-[0.15em] uppercase text-black mb-2">No Pieces Found</h2>
              <p className="text-xs tracking-wider text-neutral-500 mb-6 uppercase">
                Try modifying your search or select another category.
              </p>
              <button
                onClick={() => {
                  setCurrentFilters({});
                  fetchProducts({});
                }}
                className="px-6 py-2.5 bg-black text-white text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-neutral-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={wishlistIds.has(product._id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;

