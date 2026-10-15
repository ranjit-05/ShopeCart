import { useSelector } from 'react-redux';
import { selectCartItems, selectSubtotal, selectTotalUnits } from '../features/cart/cartSlice';

const OrderSummary = () => {
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const totalUnits = useSelector(selectTotalUnits);

  const formattedSubtotal = `₹${subtotal.toLocaleString('en-IN')}`;

  return (
    <div className="bg-white border border-neutral-200 p-6 sm:p-7 sticky top-28">
      <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-neutral-900 pb-4 border-b border-neutral-200 flex items-center justify-between">
        <span>Order Summary</span>
        <span className="font-mono text-[11px] text-neutral-500 font-normal">
          [{totalUnits} {totalUnits === 1 ? 'PIECE' : 'PIECES'}]
        </span>
      </h2>

      {/* Items list preview */}
      <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto my-4 pr-1">
        {cartItems.map((item) => {
          const product = item.product;
          if (!product) return null;
          const lineTotal = (product.price || 0) * item.quantity;
          const formattedLineTotal = `₹${lineTotal.toLocaleString('en-IN')}`;
          const formattedUnitPrice = `₹${(product.price || 0).toLocaleString('en-IN')}`;

          return (
            <div key={product._id || item._id} className="py-3 flex items-center gap-3">
              <div className="w-12 h-16 bg-[#f5f5f5] overflow-hidden shrink-0 border border-neutral-200/60">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-normal text-neutral-900 truncate tracking-wide">{product.name}</h4>
                <p className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                  Qty: {item.quantity} × {formattedUnitPrice}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-medium text-neutral-900 font-mono">{formattedLineTotal}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calculation breakdown */}
      <div className="space-y-3 pt-4 border-t border-neutral-200 text-xs">
        <div className="flex justify-between text-neutral-500">
          <span className="uppercase tracking-[0.18em]">Subtotal</span>
          <span className="font-medium text-neutral-900 font-mono">{formattedSubtotal}</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span className="uppercase tracking-[0.18em]">Delivery</span>
          <span className="text-neutral-900 uppercase tracking-[0.15em] font-medium">Complimentary</span>
        </div>
        <div className="pt-4 border-t border-neutral-900 flex justify-between items-baseline">
          <span className="uppercase tracking-[0.25em] font-bold text-neutral-900 text-xs">Total Amount</span>
          <span className="font-mono text-lg font-bold text-neutral-900">{formattedSubtotal}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-neutral-100 text-[10px] tracking-[0.15em] uppercase text-neutral-400 leading-relaxed">
        All taxes included. Complimentary 30-day exchange and returns.
      </div>
    </div>
  );
};

export default OrderSummary;
