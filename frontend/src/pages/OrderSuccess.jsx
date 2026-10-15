import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { getOrderByIdApi } from '../services/api';
import Navbar from '../components/Navbar';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const authRes = await api.get('/customers/me');
        setUser(authRes.data);

        const orderRes = await getOrderByIdApi(id);
        setOrder(orderRes.data.order);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
          return;
        }
        setError(err.response?.data?.message || 'Unable to retrieve order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar userName={user?.fullName} />
        <div className="flex-1 flex items-center justify-center py-28">
          <div className="flex flex-col items-center gap-4">
            <span className="spinner !w-8 !h-8 !border-2"></span>
            <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">Loading Confirmation…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar userName={user?.fullName} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
          <div className="text-center max-w-md bg-neutral-50/50 p-10 border border-neutral-200">
            <h2 className="font-serif text-2xl tracking-[0.18em] uppercase text-black mb-3">Order Not Found</h2>
            <p className="text-xs tracking-wider text-neutral-500 mb-8 uppercase leading-relaxed">{error || 'Could not find the specified order.'}</p>
            <Link
              to="/orders"
              className="inline-block px-8 py-3.5 bg-black text-white text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-neutral-800 transition-colors"
            >
              View Order Archive
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formattedTotal = `₹${(order.totalAmount || 0).toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar userName={user?.fullName} />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 fade-in">
        <div className="bg-white border border-neutral-200 p-8 sm:p-12 text-center">
          {/* Minimalist Seal */}
          <div className="w-14 h-14 border border-black flex items-center justify-center mx-auto mb-6 text-black">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-medium block mb-2">Acquisition Confirmed</span>
          <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-light text-black uppercase mb-3">
            Thank You for Your Order
          </h1>
          <p className="text-xs tracking-wider text-neutral-500 uppercase mb-8">
            Your piece has been reserved and is preparing for dispatch.
          </p>

          {/* Order Snapshot Receipt Card */}
          <div className="bg-neutral-50/70 border border-neutral-200 p-6 sm:p-7 text-left mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-2">
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-medium block">Order Identifier</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900">{order._id}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-medium block sm:text-right">Fulfillment Status</span>
                <span className="inline-block px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.2em] bg-black text-white">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500 uppercase tracking-[0.18em]">Payment Status</span>
              <span className="font-mono font-medium text-neutral-900 uppercase">
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500 uppercase tracking-[0.18em]">Total Charged</span>
              <span className="font-mono text-base font-bold text-neutral-900">{formattedTotal}</span>
            </div>

            {order.shippingAddress && (
              <div className="pt-4 border-t border-neutral-200 text-xs text-neutral-600 space-y-1">
                <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-medium block mb-1">Shipping Destination</span>
                <p className="font-medium text-neutral-900">
                  {order.shippingAddress.fullName} • {order.shippingAddress.phone}
                </p>
                <p className="text-neutral-500">
                  {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-8 py-3.5 bg-black text-white text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-neutral-800 transition-colors"
            >
              View Order Archive
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 py-3.5 border border-neutral-300 text-neutral-800 text-[11px] uppercase tracking-[0.25em] font-medium hover:border-black transition-colors"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
