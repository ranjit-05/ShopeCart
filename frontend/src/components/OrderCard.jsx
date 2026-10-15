import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedTotal = `₹${(order.totalAmount || 0).toLocaleString('en-IN')}`;
  const shortId = `#${order._id.slice(-8).toUpperCase()}`;

  const statusStyles = {
    PLACED: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    CONFIRMED: 'bg-neutral-900 text-white border-neutral-900',
    SHIPPED: 'bg-neutral-800 text-white border-neutral-800',
    DELIVERED: 'bg-black text-white border-black',
    PENDING_PAYMENT: 'bg-neutral-50 text-neutral-600 border-neutral-200',
  };

  const steps = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="bg-white border border-neutral-200 transition-colors duration-200 hover:border-black">
      {/* Header bar */}
      <div className="p-4 sm:p-5 bg-neutral-50/70 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-medium block">Order Reference</span>
            <span className="font-mono font-bold text-neutral-900 text-xs sm:text-sm">{shortId}</span>
          </div>
          <span className="text-neutral-300">|</span>
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-medium block">Date</span>
            <span className="text-xs text-neutral-600 font-medium">{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={`px-2.5 py-0.5 text-[9px] font-medium tracking-[0.2em] uppercase border ${statusStyles[order.status] || 'bg-neutral-100 text-neutral-800 border-neutral-200'}`}>
            {order.status}
          </span>
          <span className="text-sm sm:text-base font-bold font-mono text-neutral-900">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* Body: Items Preview */}
      <div className="p-5 sm:p-6">
        <div className="space-y-3 mb-6">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-12 h-16 bg-[#f5f5f5] overflow-hidden shrink-0 border border-neutral-200/60">
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
                <p className="text-xs font-normal text-neutral-900 tracking-wide truncate">{item.name}</p>
                <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  Qty: {item.quantity} × ₹{(item.price || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-medium text-neutral-900">
                  ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Minimalist Visual Stepper */}
        {currentStepIndex !== -1 && (
          <div className="my-6 pt-5 border-t border-neutral-100">
            <div className="flex items-center justify-between relative max-w-xl mx-auto">
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
                      className={`w-5 h-5 flex items-center justify-center text-[9px] font-mono font-bold transition-all ${
                        isCompleted
                          ? 'bg-black text-white'
                          : 'bg-white border border-neutral-300 text-neutral-400'
                      } ${isCurrent ? 'ring-2 ring-neutral-400 ring-offset-2' : ''}`}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-[9px] font-medium text-neutral-500 mt-1.5 uppercase tracking-[0.18em] hidden sm:block">
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex justify-end pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => navigate(`/orders/${order._id}`)}
            className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-800 hover:text-black border border-neutral-300 hover:border-black transition-colors"
          >
            Order Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
