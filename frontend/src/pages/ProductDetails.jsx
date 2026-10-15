import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectPendingIds } from '../features/cart/cartSlice';
import api, { toggleWishlistItem, getWishlist } from '../services/api';
import Navbar from '../components/Navbar';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const pendingIds = useSelector(selectPendingIds);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        if (err.response?.status === 400 || err.response?.status === 404) {
          setError('Piece not found in collection.');
        } else {
          setError('Unable to load piece details.');
        }
      } finally {
        setLoading(false);
      }
    };

    const checkWishlist = async () => {
      try {
        const response = await getWishlist();
        const found = response.data.wishlist.some((p) => p._id === id);
        setIsWishlisted(found);
      } catch (err) {
        // user might be logged out
      }
    };

    fetchProduct();
    checkWishlist();
  }, [id]);

  const formattedPrice = product ? `₹${product.price.toLocaleString('en-IN')}` : '';
  const isOutOfStock = product?.stock === 0;
  const isAdding = pendingIds.includes(product?._id);

  const handleAddToCart = async () => {
    if (!product || isOutOfStock || isAdding) return;
    const result = await dispatch(addToCart(product._id));
    if (!addToCart.rejected.match(result)) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2200);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product || wishlistLoading) return;
    try {
      setWishlistLoading(true);
      const res = await toggleWishlistItem(product._id);
      setIsWishlisted(res.data.isWishlisted);
      window.dispatchEvent(new CustomEvent('wishlist-updated'));
    } catch (err) {
      // silently fail
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <span className="spinner !w-8 !h-8 !border-2"></span>
            <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">Inspecting Piece Details…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-24 px-4">
          <div className="text-center max-w-md p-10 border border-neutral-200 bg-neutral-50/50">
            <h2 className="font-serif text-2xl tracking-[0.15em] uppercase text-black mb-3">{error || 'Piece Unavailable'}</h2>
            <p className="text-xs tracking-wider text-neutral-500 mb-6 uppercase">The specified piece is currently not cataloged.</p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-black text-white text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-neutral-800 transition-colors"
            >
              Return to Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 fade-in">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-neutral-400 mb-8 pb-4 border-b border-neutral-100">
          <Link to="/products" className="hover:text-black transition-colors">
            Collection
          </Link>
          <span>/</span>
          <span className="text-neutral-500">{product.category}</span>
          <span>/</span>
          <span className="text-black font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Split Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Dramatic Portrait Imagery (7 cols) */}
          <div className="lg:col-span-7 bg-[#f6f6f6] border border-neutral-200/60 overflow-hidden relative group">
            <div className="aspect-[3/4] w-full flex items-center justify-center p-4 sm:p-8">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain max-h-[700px] group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            <span className="absolute top-4 left-4 px-2.5 py-1 bg-white/95 text-[9px] uppercase tracking-[0.25em] font-medium text-black border border-neutral-200/80">
              {product.category}
            </span>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                <span className="px-6 py-3 bg-black text-white text-xs tracking-[0.3em] uppercase font-medium">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Atelier Purchase Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-28 space-y-6">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium block mb-2">
                Reference #{product._id.slice(-6).toUpperCase()}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-neutral-900 font-normal">
                {product.name}
              </h1>
              <div className="mt-3 flex items-baseline justify-between pb-4 border-b border-neutral-200">
                <p className="font-mono text-2xl font-semibold text-neutral-900">{formattedPrice}</p>
                <span className={`text-[10px] tracking-[0.2em] uppercase font-medium ${
                  isOutOfStock ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  {isOutOfStock ? 'Sold Out' : `${product.stock} units left`}
                </span>
              </div>
            </div>

            {/* Description Narrative */}
            <div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Purchase CTA Buttons */}
            <div className="pt-4 space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className={`w-full py-4 text-xs font-medium uppercase tracking-[0.28em] transition-all duration-200 flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
                    : addedToCart
                      ? 'bg-neutral-900 text-white'
                      : 'bg-black text-white hover:bg-neutral-800 active:bg-black'
                }`}
              >
                {isOutOfStock ? (
                  'Sold Out'
                ) : isAdding ? (
                  <>
                    <span className="spinner spinner-white !w-3.5 !h-3.5"></span>
                    <span>Adding to Bag…</span>
                  </>
                ) : addedToCart ? (
                  'Added to Bag'
                ) : (
                  'Add to Bag'
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
                className={`w-full py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] border transition-colors flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? 'border-black bg-neutral-900 text-white'
                    : 'border-neutral-300 hover:border-black text-neutral-800 hover:text-black bg-white'
                }`}
              >
                <span>{isWishlisted ? '♥ Saved in Atelier' : '♡ Save to Wishlist'}</span>
              </button>
            </div>

            {/* Editorial Information Accordion */}
            <div className="pt-6 border-t border-neutral-200 divide-y divide-neutral-200 text-xs">
              <div>
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'details' ? '' : 'details')}
                  className="w-full py-3.5 flex justify-between items-center text-left uppercase tracking-[0.2em] font-medium text-neutral-900"
                >
                  <span>Composition & Care</span>
                  <span className="font-mono text-xs">{activeTab === 'details' ? '−' : '+'}</span>
                </button>
                {activeTab === 'details' && (
                  <div className="pb-4 text-neutral-500 text-[11px] leading-relaxed tracking-wide space-y-1 fade-in">
                    <p>• Premium craftmanship & rigorous quality control.</p>
                    <p>• Handle with care to preserve original silhouette.</p>
                    <p>• Do not tumble dry. Store in a cool, dry place.</p>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'shipping' ? '' : 'shipping')}
                  className="w-full py-3.5 flex justify-between items-center text-left uppercase tracking-[0.2em] font-medium text-neutral-900"
                >
                  <span>Delivery & Returns</span>
                  <span className="font-mono text-xs">{activeTab === 'shipping' ? '−' : '+'}</span>
                </button>
                {activeTab === 'shipping' && (
                  <div className="pb-4 text-neutral-500 text-[11px] leading-relaxed tracking-wide space-y-1 fade-in">
                    <p>• Complimentary standard shipping on all orders.</p>
                    <p>• Delivery within 3–5 business days.</p>
                    <p>• 30-day return policy for unused items in original packaging.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
