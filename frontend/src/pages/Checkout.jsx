import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import Navbar from '../components/Navbar';
import CheckoutForm from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import { selectCartItems, selectCartLoading } from '../features/cart/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const cartItems = useSelector(selectCartItems);
  const cartLoading = useSelector(selectCartLoading);

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

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar userName={user?.fullName} />
        <div className="flex-1 flex items-center justify-center py-28">
          <div className="flex flex-col items-center gap-4">
            <span className="spinner !w-8 !h-8 !border-2"></span>
            <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">Preparing Secure Checkout…</p>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty, do not show checkout form
  if (!cartLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar userName={user?.fullName} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
          <div className="text-center max-w-md bg-neutral-50/50 p-10 border border-neutral-200">
            <h2 className="font-serif text-2xl tracking-[0.18em] uppercase text-black mb-3">Your Bag is Empty</h2>
            <p className="text-xs tracking-wider text-neutral-500 mb-8 uppercase leading-relaxed">
              At least one piece must be placed in your shopping bag before proceeding to atelier checkout.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-3.5 bg-black text-white text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-neutral-800 transition-colors"
              >
                Explore Collection
              </Link>
              <Link
                to="/cart"
                className="w-full sm:w-auto px-8 py-3.5 border border-neutral-300 text-neutral-800 text-[11px] uppercase tracking-[0.22em] font-medium hover:border-black transition-colors"
              >
                View Bag
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar userName={user?.fullName} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 fade-in">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-neutral-400 mb-8 pb-4 border-b border-neutral-100">
          <Link to="/cart" className="hover:text-black transition-colors">
            Shopping Bag
          </Link>
          <span>/</span>
          <span className="text-black font-medium">Checkout</span>
        </div>

        <div className="border-b border-neutral-200 pb-6 mb-10">
          <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-medium block mb-1">Payment Step</span>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.2em] font-light text-black uppercase">
            Order Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Checkout Form (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <CheckoutForm />
          </div>

          {/* Order Summary (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
            <OrderSummary />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
