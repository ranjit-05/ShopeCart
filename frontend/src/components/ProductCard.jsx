import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems, selectPendingIds } from '../features/cart/cartSlice';

const ProductCard = ({ product, isWishlisted = false, onWishlistToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const pendingIds = useSelector(selectPendingIds);

  const [saving, setSaving] = useState(false);
  const [wishlistError, setWishlistError] = useState('');
  const [cartError, setCartError] = useState('');

  const formattedPrice = `₹${product.price.toLocaleString('en-IN')}`;
  const isOutOfStock = product.stock === 0;
  const isAdding = pendingIds.includes(product._id);
  const existingCartItem = cartItems.find(
    (item) => (item.product?._id || item.product) === product._id
  );
  const isInCart = Boolean(existingCartItem);

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (saving || !onWishlistToggle) return;
    setSaving(true);
    setWishlistError('');
    try {
      await onWishlistToggle(product._id);
    } catch (err) {
      setWishlistError('Unable to update saved items.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isAdding || isOutOfStock) return;
    if (existingCartItem && existingCartItem.quantity >= product.stock) {
      setCartError(`Limit reached (${product.stock} available)`);
      return;
    }
    setCartError('');
    const result = await dispatch(addToCart(product._id));
    if (addToCart.rejected.match(result)) {
      setCartError(result.payload || 'Failed to add to bag');
    }
  };

  return (
    <div className="group flex flex-col bg-white border border-neutral-200/80 hover:border-black transition-colors duration-300">
      {/* Editorial Image Container (Portrait 3:4 ratio) */}
      <div
        onClick={() => navigate(`/products/${product._id}`)}
        className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Minimalist Category Tag */}
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-neutral-900 text-[9px] font-medium tracking-[0.25em] uppercase border border-neutral-200/60">
          {product.category}
        </span>

        {/* Floating Wishlist Button */}
        {onWishlistToggle && (
          <button
            type="button"
            onClick={handleWishlistClick}
            disabled={saving}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isWishlisted
                ? 'bg-black text-white'
                : 'bg-white/90 text-neutral-700 hover:text-black hover:bg-white border border-neutral-200/60'
            }`}
            title={isWishlisted ? 'Remove from saved' : 'Save to wishlist'}
            aria-label="Wishlist toggle"
          >
            {saving ? (
              <span className={`spinner !w-3 !h-3 ${isWishlisted ? 'spinner-white' : ''}`}></span>
            ) : (
              <svg
                className="w-4 h-4"
                fill={isWishlisted ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            )}
          </button>
        )}

        {/* Out of Stock Ribbon / Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-4 py-2 bg-black text-white text-[10px] tracking-[0.28em] uppercase font-medium">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 bg-white">
        <div
          onClick={() => navigate(`/products/${product._id}`)}
          className="cursor-pointer mb-2"
        >
          <h3 className="text-sm font-normal text-neutral-900 group-hover:underline tracking-wide line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-medium tracking-tight text-neutral-900">
              {formattedPrice}
            </span>
            <span className={`text-[10px] tracking-[0.15em] uppercase font-medium ${
              isOutOfStock
                ? 'text-neutral-400'
                : product.stock <= 5
                  ? 'text-amber-700'
                  : 'text-neutral-500'
            }`}>
              {isOutOfStock ? 'Sold Out' : `${product.stock} left`}
            </span>
          </div>
        </div>

        {wishlistError && (
          <p className="text-[10px] text-red-600 mb-1">{wishlistError}</p>
        )}

        <div className="flex-1 min-h-[4px]"></div>

        {/* Actions */}
        <div className="pt-2 space-y-1.5">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`w-full py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] transition-all duration-200 flex items-center justify-center gap-2 ${
              isOutOfStock
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200'
                : isAdding
                  ? 'bg-neutral-800 text-white cursor-wait'
                  : isInCart
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                    : 'bg-black text-white hover:bg-neutral-800'
            }`}
          >
            {isAdding ? (
              <>
                <span className="spinner spinner-white !w-3 !h-3"></span>
                <span>Adding...</span>
              </>
            ) : isInCart ? (
              'In Bag (+1)'
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              'Add to Bag'
            )}
          </button>

          {cartError && (
            <p className="text-[10px] text-red-600 text-center font-medium">{cartError}</p>
          )}

          <button
            type="button"
            onClick={() => navigate(`/products/${product._id}`)}
            className="w-full py-2 border border-neutral-200 hover:border-black text-neutral-700 hover:text-black text-[10px] font-medium uppercase tracking-[0.2em] transition-colors"
          >
            View Piece
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

