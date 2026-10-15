import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart, selectPendingIds } from '../features/cart/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const pendingIds = useSelector(selectPendingIds);

  const product = item.product;
  if (!product) return null;

  const isPending = pendingIds.includes(product._id);
  const formattedUnitPrice = `₹${(product.price || 0).toLocaleString('en-IN')}`;
  const lineTotal = (product.price || 0) * item.quantity;
  const formattedLineTotal = `₹${lineTotal.toLocaleString('en-IN')}`;
  const isMinQuantity = item.quantity <= 1;
  const isMaxQuantity = item.quantity >= product.stock;

  const handleDecrement = () => {
    if (isMinQuantity || isPending) return;
    dispatch(updateQuantity({ productId: product._id, quantity: item.quantity - 1 }));
  };

  const handleIncrement = () => {
    if (isMaxQuantity || isPending) return;
    dispatch(updateQuantity({ productId: product._id, quantity: item.quantity + 1 }));
  };

  const handleRemove = () => {
    if (isPending) return;
    dispatch(removeFromCart(product._id));
  };

  return (
    <div
      className={`py-6 border-b border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-opacity duration-200 ${
        isPending ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      {/* Product Image & Info */}
      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
        <div className="w-20 h-24 sm:w-24 sm:h-28 bg-[#f5f5f5] shrink-0 border border-neutral-200/60 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          {product.category && (
            <span className="text-[9px] font-medium tracking-[0.25em] text-neutral-400 uppercase block mb-1">
              {product.category}
            </span>
          )}
          <h3 className="text-sm font-normal text-neutral-900 tracking-wide truncate">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 font-mono">
            {formattedUnitPrice}
          </p>
          {product.stock <= 5 && (
            <p className="text-[10px] tracking-[0.15em] uppercase text-amber-700 font-medium mt-1.5">
              Only {product.stock} pieces remaining
            </p>
          )}
        </div>
      </div>

      {/* Quantity Stepper & Line Total & Remove Action */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-neutral-300 bg-white">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={isMinQuantity || isPending}
            className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:text-black hover:bg-neutral-100 active:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title={isMinQuantity ? 'Quantity cannot be less than 1' : 'Decrease'}
          >
            <span className="text-sm font-medium leading-none">−</span>
          </button>

          <span className="w-9 text-center text-xs font-mono font-medium text-neutral-900 select-none">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={isMaxQuantity || isPending}
            className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:text-black hover:bg-neutral-100 active:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title={isMaxQuantity ? 'Stock limit reached' : 'Increase'}
          >
            <span className="text-sm font-medium leading-none">+</span>
          </button>
        </div>

        {/* Line Total */}
        <div className="text-right min-w-[5.5rem]">
          <span className="block text-sm font-semibold tracking-tight text-neutral-900">
            {formattedLineTotal}
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400">Total</span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-400 hover:text-black transition-colors underline-offset-4 hover:underline p-1"
          title="Remove piece"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
