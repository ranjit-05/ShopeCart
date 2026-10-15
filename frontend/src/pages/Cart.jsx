import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import {
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectTotalUnits,
  selectSubtotal,
  fetchCart,
} from '../features/cart/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const cartItems = useSelector(selectCartItems);
  const cartLoading = useSelector(selectCartLoading);
  const cartError = useSelector(selectCartError);
  const totalUnits = useSelector(selectTotalUnits);
  const subtotal = useSelector(selectSubtotal);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthLoading(true);
        const response = await api.get('/customers/me');
        setUser(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
          return;
        }
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleRetry = () => {
    dispatch(fetchCart());
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  const formattedSubtotal = `₹${subtotal.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar userName={user?.fullName} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 fade-in">
        {/* Editorial Page Header */}
        <div className="border-b border-neutral-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-medium block mb-1">Order Checkout</span>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.2em] font-light text-black uppercase">
              Shopping Bag
            </h1>
          </div>
          {!cartLoading && !cartError && cartItems.length > 0 && (
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
              [{totalUnits} {totalUnits === 1 ? 'Piece' : 'Pieces'}]
            </span>
          )}
        </div>

        {/* Loading State */}
        {(authLoading || cartLoading) && (
          <div className="flex items-center justify-center py-28">
            <div className="flex flex-col items-center gap-4">
              <span className="spinner !w-8 !h-8 !border-2"></span>
              <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">Reviewing Bag Contents…</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!authLoading && !cartLoading && cartError && (
          <div className="flex items-center justify-center py-28">
            <div className="text-center max-w-md p-8 border border-neutral-200 bg-neutral-50/50">
              <p className="text-sm uppercase tracking-[0.2em] font-medium text-neutral-900 mb-2">Unable to Retrieve Bag</p>
              <p className="text-xs text-neutral-500 mb-6">{typeof cartError === 'string' ? cartError : 'Please verify network and retry.'}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="px-6 py-2.5 bg-black text-white text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-neutral-800 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!authLoading && !cartLoading && !cartError && cartItems.length === 0 && (
          <div className="flex items-center justify-center py-28">
            <div className="text-center max-w-md p-10 border border-neutral-200 bg-neutral-50/40">
              <h2 className="font-serif text-2xl tracking-[0.18em] uppercase text-black mb-3">Your Bag is Empty</h2>
              <p className="text-xs tracking-wider text-neutral-500 mb-8 uppercase leading-relaxed">
                Items added to your shopping bag will be preserved here for your review and checkout.
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

        {/* Cart Contents with Order Summary */}
        {!authLoading && !cartLoading && !cartError && cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="border-t border-neutral-200 divide-y divide-neutral-200">
                {cartItems.map((item) => (
                  <CartItem key={item.product?._id || item._id} item={item} />
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Link
                  to="/products"
                  className="text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-600 hover:text-black transition-colors"
                >
                  ← Continue Exploring
                </Link>
              </div>
            </div>

            {/* Order Summary & Checkout Action (5 cols / 4 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
              <div className="bg-white border border-neutral-200 p-6 sm:p-8">
                <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-neutral-900 pb-4 border-b border-neutral-200 flex items-center justify-between">
                  <span>Summary</span>
                  <span className="font-mono text-xs text-neutral-500">[{totalUnits} Items]</span>
                </h2>

                <div className="space-y-3.5 my-6 text-xs">
                  <div className="flex justify-between text-neutral-500">
                    <span className="uppercase tracking-[0.18em]">Subtotal</span>
                    <span className="font-mono text-neutral-900 font-medium">{formattedSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500">
                    <span className="uppercase tracking-[0.18em]">Delivery</span>
                    <span className="text-neutral-900 uppercase tracking-[0.15em] font-medium">Complimentary</span>
                  </div>
                  <div className="pt-4 border-t border-neutral-900 flex justify-between items-baseline">
                    <span className="uppercase tracking-[0.25em] font-bold text-neutral-900">Total</span>
                    <span className="font-mono text-xl font-bold text-neutral-900">{formattedSubtotal}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full py-4 bg-black text-white hover:bg-neutral-800 active:bg-black font-medium text-xs uppercase tracking-[0.25em] transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <span>→</span>
                </button>

                <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 text-center mt-4">
                  Tax inclusive • Standard Delivery Included
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
