import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WishlistCard = ({ product, onRemove }) => {
  const navigate = useNavigate();
  const [removing, setRemoving] = useState(false);

  const formattedPrice = `₹${product.price.toLocaleString('en-IN')}`;
  const isOutOfStock = product.stock === 0;

  const handleRemove = async (e) => {
    e.stopPropagation();
    if (removing) return;
    setRemoving(true);
    try {
      await onRemove(product._id);
    } catch (err) {
      setRemoving(false);
    }
  };

  return (
    <div className="group flex flex-col bg-white border border-neutral-200/80 hover:border-black transition-colors duration-300 fade-in">
      {/* Editorial Image Container */}
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

        <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-neutral-900 text-[9px] font-medium tracking-[0.25em] uppercase border border-neutral-200/60">
          {product.category}
        </span>

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
              isOutOfStock ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              {isOutOfStock ? 'Sold Out' : `${product.stock} available`}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-[4px]"></div>

        <div className="pt-2 space-y-1.5">
          <button
            type="button"
            onClick={() => navigate(`/products/${product._id}`)}
            className="w-full py-2.5 bg-black text-white hover:bg-neutral-800 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors"
          >
            View Piece
          </button>

          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="w-full py-2 text-[10px] font-medium uppercase tracking-[0.2em] border border-neutral-200 hover:border-black text-neutral-600 hover:text-black transition-colors disabled:opacity-40"
          >
            {removing ? 'Removing...' : 'Remove from Saved'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
