import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { getOrdersApi } from '../services/api';
import Navbar from '../components/Navbar';
import OrderCard from '../components/OrderCard';

const Orders = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const authRes = await api.get('/customers/me');
      setUser(authRes.data);

      const response = await getOrdersApi();
      setOrders(response.data.orders || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      setError('Unable to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar userName={user?.fullName} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 fade-in">
        <div className="border-b border-neutral-200 pb-6 mb-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-medium block mb-1">Client History</span>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-[0.2em] font-light text-black uppercase">
              Order Archive
            </h1>
          </div>
          {!loading && !error && orders.length > 0 && (
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
              [{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}]
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-28">
            <div className="flex flex-col items-center gap-4">
              <span className="spinner !w-8 !h-8 !border-2"></span>
              <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">Loading Order Archive…</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center py-28">
            <div className="text-center max-w-md p-8 border border-neutral-200 bg-neutral-50/50">
              <p className="text-sm uppercase tracking-[0.2em] font-medium text-neutral-900 mb-2">{error}</p>
              <p className="text-xs text-neutral-500 mb-6">Unable to retrieve past orders.</p>
              <button
                type="button"
                onClick={fetchOrders}
                className="px-6 py-2.5 bg-black text-white text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-neutral-800 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex items-center justify-center py-28">
            <div className="text-center max-w-md p-10 border border-neutral-200 bg-neutral-50/40">
              <h2 className="font-serif text-2xl tracking-[0.18em] uppercase text-black mb-3">No Past Orders</h2>
              <p className="text-xs tracking-wider text-neutral-500 mb-8 uppercase leading-relaxed">
                When you acquire pieces from our collections, your order history and live fulfillment will be archived here.
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

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
