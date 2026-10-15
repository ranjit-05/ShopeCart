import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { getOrderByIdApi, updateOrderStatusApi } from '../services/api';
import Navbar from '../components/Navbar';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const authRes = await api.get('/customers/me');
      setUser(authRes.data);

      const response = await getOrderByIdApi(id);
      setOrder(response.data.order);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }
      if (err.response?.status === 404 || err.response?.status === 403) {
        setError('Order not found or you do not have permission to view it.');
      } else {
        setError('Failed to load order details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await updateOrderStatusApi(order._id, newStatus);
      setOrder(res.data.order);
    } catch (err) {
      // Dev status change silently fails or logs if disabled
      console.error('Dev status update failed:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar userName={user?.fullName} />
        <div className="flex-1 flex items-center justify-center py-28">
          <div className="flex flex-col items-center gap-4">
            <span className="spinner !w-8 !h-8 !border-2"></span>
            <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">Loading Order Details…</p>
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
            <h2 className="font-serif text-2xl tracking-[0.18em] uppercase text-black mb-3">Order Unavailable</h2>
            <p className="text-xs tracking-wider text-neutral-500 mb-8 uppercase leading-relaxed">{error || 'This order does not exist or belongs to another client.'}</p>
            <Link
              to="/orders"
              className="inline-block px-8 py-3.5 bg-black text-white text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-neutral-800 transition-colors"
            >
              Back to Order Archive
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedTotal = `₹${(order.totalAmount || 0).toLocaleString('en-IN')}`;

  const steps = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar userName={user?.fullName} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 fade-in">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-neutral-400 mb-8 pb-4 border-b border-neutral-100">
          <Link to="/orders" className="hover:text-black transition-colors">
            Order Archive
          </Link>
          <span>/</span>
          <span className="text-neutral-900 font-mono">
            #{order._id.slice(-8).toUpperCase()}
          </span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-neutral-200 gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-medium block mb-1">
                Order Reference
              </span>
              <h1 className="text-lg sm:text-xl font-bold font-mono text-neutral-900">
                #{order._id}
              </h1>
              <p className="text-xs text-neutral-500 mt-1">Recorded on {formattedDate}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="px-3 py-1 text-[9px] font-medium uppercase tracking-[0.22em] bg-black text-white">
                {order.status}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-neutral-900">
                {formattedTotal}
              </span>
            </div>
          </div>

          {/* Minimalist Visual Stepper */}
          {currentStepIndex !== -1 && (
            <div className="pt-8 pb-2">
              <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-neutral-200 w-full z-0"></div>
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-black z-0 transition-all duration-300"
                  style={{
                    width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  }}
                ></div>

                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-6 h-6 flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                          isCompleted
                            ? 'bg-black text-white'
                            : 'bg-white border border-neutral-300 text-neutral-400'
                        } ${isCurrent ? 'ring-2 ring-neutral-400 ring-offset-2' : ''}`}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span className="text-[9px] font-medium text-neutral-600 mt-2 uppercase tracking-[0.18em]">
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Dev Status Controls */}
              <div className="mt-8 pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-end gap-2 text-xs">
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-medium">Dev Simulator:</span>
                {steps.map((step) => (
                  <button
                    key={step}
                    type="button"
                    disabled={updatingStatus || order.status === step}
                    onClick={() => handleStatusChange(step)}
                    className={`px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] font-medium transition-colors ${
                      order.status === step
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Snapshot (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white border border-neutral-200 p-6 sm:p-7">
            <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-neutral-900 mb-4 pb-3 border-b border-neutral-200">
              Pieces in Order ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-neutral-100">
              {order.items.map((item, idx) => {
                const lineTotal = (item.price || 0) * item.quantity;
                return (
                  <div key={idx} className="py-4 flex items-center gap-4">
                    <div className="w-16 h-20 bg-[#f5f5f5] overflow-hidden shrink-0 border border-neutral-200/60">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-normal text-neutral-900 tracking-wide truncate">{item.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        Price: ₹{(item.price || 0).toLocaleString('en-IN')} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-medium text-neutral-900">
                        ₹{lineTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Address & Payment Info (4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white border border-neutral-200 p-6">
              <h3 className="text-xs uppercase tracking-[0.22em] font-semibold text-neutral-900 mb-3 pb-2 border-b border-neutral-200">
                Delivery Destination
              </h3>
              {order.shippingAddress ? (
                <div className="text-xs text-neutral-600 space-y-1">
                  <p className="font-semibold text-neutral-900">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-neutral-400">No destination record.</p>
              )}
            </div>

            {/* Payment Summary */}
            <div className="bg-white border border-neutral-200 p-6">
              <h3 className="text-xs uppercase tracking-[0.22em] font-semibold text-neutral-900 mb-3 pb-2 border-b border-neutral-200">
                Payment Breakdown
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 uppercase tracking-[0.18em]">Status</span>
                  <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>

                {order.razorpayPaymentId && (
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 uppercase tracking-[0.18em]">Transaction</span>
                    <span className="font-mono text-[10px] text-neutral-700">
                      {order.razorpayPaymentId}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-900 flex justify-between items-baseline">
                  <span className="uppercase tracking-[0.22em] font-bold text-neutral-900">Total</span>
                  <span className="font-mono text-base font-bold text-neutral-900">{formattedTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
