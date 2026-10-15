import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWishlist, removeWishlistItem } from '../services/api';
import Navbar from '../components/Navbar';
import WishlistCard from '../components/WishlistCard';


const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getWishlist();
      setWishlist(response.data.wishlist);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError('Something went wrong. We couldn\'t load your wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    await removeWishlistItem(productId);
    setWishlist((prev) => prev.filter((p) => p._id !== productId));
    window.dispatchEvent(new CustomEvent('wishlist-updated'));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 fade-in">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-neutral-200 pb-6 mb-10 gap-2">
          <div>
            <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-medium block mb-1">Personal Atelier</span>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.2em] font-light text-black uppercase">
              Saved Pieces
            </h1>
          </div>
          {!loading && !error && wishlist.length > 0 && (
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
              [{wishlist.length} {wishlist.length === 1 ? 'Piece' : 'Pieces'}]
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-28">
            <div className="flex flex-col items-center gap-4">
              <span className="spinner !w-8 !h-8 !border-2"></span>
              <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">Retrieving Saved Pieces…</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center py-28">
            <div className="text-center max-w-md p-8 border border-neutral-200 bg-neutral-50/50">
              <p className="text-sm uppercase tracking-[0.2em] font-medium text-neutral-900 mb-2">{error}</p>
              <p className="text-xs text-neutral-500 mb-6">Could not load saved pieces.</p>
              <button
                onClick={fetchWishlist}
                className="px-6 py-2.5 bg-black text-white text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-neutral-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="flex items-center justify-center py-28">
            <div className="text-center max-w-md p-10 border border-neutral-200 bg-neutral-50/40">
              <h2 className="font-serif text-2xl tracking-[0.18em] uppercase text-black mb-3">No Saved Pieces</h2>
              <p className="text-xs tracking-wider text-neutral-500 mb-8 uppercase leading-relaxed">
                Save pieces you appreciate by selecting the wishlist icon to revisit them whenever you return.
              </p>
              <Link
                to="/products"
                className="inline-block px-8 py-3.5 bg-black text-white text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-neutral-800 transition-colors"
              >
                Explore The Collection
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist Grid */}
        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
            {wishlist.map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
