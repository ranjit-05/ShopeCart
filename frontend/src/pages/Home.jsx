import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/customers/me');
        setUser(response.data);
      } catch (error) {
        console.error('Not authenticated — redirecting to login', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-28">
          <div className="flex flex-col items-center gap-4">
            <span className="spinner !w-8 !h-8 !border-2"></span>
            <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">Loading Client Atelier…</p>
          </div>
        </div>
      </div>
    );
  }

  const firstName = user?.fullName?.split(' ')[0] || 'Client';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar userName={user?.fullName} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 fade-in">
        {/* Editorial Section Header */}
        <div className="border-b border-neutral-200 pb-8 mb-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-medium block mb-1">
              Private Client Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl tracking-[0.18em] font-light text-black uppercase">
              Welcome, {firstName}
            </h1>
          </div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-neutral-500">
            [ Atelier Member ]
          </span>
        </div>

        {/* Client Profile Card */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-10 mb-12">
          <div className="flex items-center gap-5 pb-6 border-b border-neutral-200">
            <div className="w-14 h-14 bg-black text-white flex items-center justify-center font-serif text-xl font-light">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-normal tracking-wide text-neutral-900">{user?.fullName}</h2>
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 block mt-0.5">
                Verified Client Account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 font-medium block mb-1">
                Full Name
              </span>
              <span className="text-neutral-900 font-medium tracking-wide">{user?.fullName}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 font-medium block mb-1">
                Email Address
              </span>
              <span className="text-neutral-900 font-medium tracking-wide">{user?.email}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 font-medium block mb-1">
                Contact Phone
              </span>
              <span className="text-neutral-900 font-medium tracking-wide font-mono">{user?.phone || 'Not recorded'}</span>
            </div>
          </div>
        </div>

        {/* Quick Atelier Navigation Cards (Zara Editorial Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            to="/products"
            className="group p-6 bg-neutral-50/60 hover:bg-black hover:text-white border border-neutral-200 hover:border-black transition-all duration-300 flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 group-hover:text-neutral-400 block mb-2">
                Curations
              </span>
              <h3 className="font-serif text-lg tracking-wide text-neutral-900 group-hover:text-white uppercase font-light">
                The Collection
              </h3>
            </div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium mt-4 text-neutral-500 group-hover:text-neutral-300 flex items-center gap-1">
              Explore Pieces →
            </span>
          </Link>

          <Link
            to="/wishlist"
            className="group p-6 bg-neutral-50/60 hover:bg-black hover:text-white border border-neutral-200 hover:border-black transition-all duration-300 flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 group-hover:text-neutral-400 block mb-2">
                Personal
              </span>
              <h3 className="font-serif text-lg tracking-wide text-neutral-900 group-hover:text-white uppercase font-light">
                Saved Items
              </h3>
            </div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium mt-4 text-neutral-500 group-hover:text-neutral-300 flex items-center gap-1">
              View Wishlist →
            </span>
          </Link>

          <Link
            to="/cart"
            className="group p-6 bg-neutral-50/60 hover:bg-black hover:text-white border border-neutral-200 hover:border-black transition-all duration-300 flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 group-hover:text-neutral-400 block mb-2">
                Checkout
              </span>
              <h3 className="font-serif text-lg tracking-wide text-neutral-900 group-hover:text-white uppercase font-light">
                Shopping Bag
              </h3>
            </div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium mt-4 text-neutral-500 group-hover:text-neutral-300 flex items-center gap-1">
              Review Bag →
            </span>
          </Link>

          <Link
            to="/orders"
            className="group p-6 bg-neutral-50/60 hover:bg-black hover:text-white border border-neutral-200 hover:border-black transition-all duration-300 flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-400 group-hover:text-neutral-400 block mb-2">
                Fulfillment
              </span>
              <h3 className="font-serif text-lg tracking-wide text-neutral-900 group-hover:text-white uppercase font-light">
                Order Archive
              </h3>
            </div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium mt-4 text-neutral-500 group-hover:text-neutral-300 flex items-center gap-1">
              Track Orders →
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
