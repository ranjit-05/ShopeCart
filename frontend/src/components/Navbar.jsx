import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api, { getWishlistCount } from '../services/api';
import { selectTotalUnits, clearCart } from '../features/cart/cartSlice';

const Navbar = ({ userName }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const totalUnits = useSelector(selectTotalUnits);
  const [loggingOut, setLoggingOut] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchCount = async () => {
    try {
      const response = await getWishlistCount();
      setWishlistCount(response.data.count);
    } catch (err) {
      // silently fail
    }
  };

  useEffect(() => {
    fetchCount();

    const handleWishlistUpdate = () => fetchCount();
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await api.post('/customers/logout');
      dispatch(clearCart());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(clearCart());
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top Editorial Announcement Ticker */}
      <div className="bg-neutral-950 text-neutral-300 py-1.5 px-4 text-center text-[10px] tracking-[0.28em] uppercase font-light">
        <span>Complimentary Standard Delivery & Express Atelier Services</span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Left: Mobile hamburger & Main Nav on Desktop */}
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-neutral-900 hover:text-neutral-600 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                )}
              </svg>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              <Link
                to="/products"
                className={`text-[11px] uppercase tracking-[0.22em] font-medium transition-colors relative py-1 ${
                  isActive('/products')
                    ? 'text-black border-b border-black'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Collection
              </Link>
              <Link
                to="/home"
                className={`text-[11px] uppercase tracking-[0.22em] font-medium transition-colors relative py-1 ${
                  isActive('/home')
                    ? 'text-black border-b border-black'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Atelier
              </Link>
              <Link
                to="/orders"
                className={`text-[11px] uppercase tracking-[0.22em] font-medium transition-colors relative py-1 ${
                  isActive('/orders')
                    ? 'text-black border-b border-black'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                Orders
              </Link>
            </div>
          </div>

          {/* Center: High-Fashion Brand Logo */}
          <div className="flex items-center">
            <Link to="/products" className="group flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.32em] font-light text-black group-hover:opacity-75 transition-opacity">
                SHOPKART
              </span>
              <span className="text-[8px] tracking-[0.45em] text-neutral-400 uppercase -mt-0.5">
                Edition 2026
              </span>
            </Link>
          </div>

          {/* Right: Wishlist, Cart & Client Actions */}
          <div className="flex items-center gap-5 sm:gap-7">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors ${
                isActive('/wishlist') ? 'text-black' : 'text-neutral-600 hover:text-black'
              }`}
              title="Saved items"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              <span className="hidden sm:inline">Saved</span>
              {wishlistCount > 0 && (
                <span className="text-[10px] font-mono font-medium text-neutral-900 bg-neutral-100 px-1.5 py-0.5 border border-neutral-200">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Link */}
            <Link
              to="/cart"
              className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors ${
                isActive('/cart') ? 'text-black' : 'text-neutral-600 hover:text-black'
              }`}
              title="Shopping bag"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span className="hidden sm:inline">Bag</span>
              <span className="text-[10px] font-mono font-semibold text-white bg-black px-1.5 py-0.5">
                {totalUnits}
              </span>
            </Link>

            {/* User Profile Monogram (Desktop) */}
            {userName && (
              <div className="hidden md:flex items-center gap-2 border-l border-neutral-200 pl-4">
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-medium">
                  {userName.split(' ')[0]}
                </span>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-[10px] uppercase tracking-[0.22em] font-medium px-3 py-1.5 border border-neutral-300 hover:border-black text-neutral-800 hover:text-black transition-all disabled:opacity-40"
              title="Sign out of your session"
            >
              {loggingOut ? (
                <span className="spinner"></span>
              ) : (
                'Logout'
              )}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-200 fade-in flex flex-col gap-3">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-[0.25em] font-medium py-2 text-neutral-900 border-b border-neutral-100"
            >
              The Collection
            </Link>
            <Link
              to="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-[0.25em] font-medium py-2 text-neutral-900 border-b border-neutral-100"
            >
              Client Atelier (Home)
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-[0.25em] font-medium py-2 text-neutral-900 border-b border-neutral-100 flex justify-between"
            >
              <span>Saved Items</span>
              <span className="font-mono text-neutral-500">({wishlistCount})</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-[0.25em] font-medium py-2 text-neutral-900 border-b border-neutral-100 flex justify-between"
            >
              <span>Shopping Bag</span>
              <span className="font-mono text-neutral-500">({totalUnits})</span>
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-[0.25em] font-medium py-2 text-neutral-900"
            >
              Order Archive
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

