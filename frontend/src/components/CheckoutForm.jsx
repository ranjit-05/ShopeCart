import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cart/cartSlice';
import { createPaymentOrderApi, verifyPaymentApi, paymentFailedApi } from '../services/api';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      errors.phone = 'Phone must be a valid 10-digit Indian mobile number';
    }

    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = 'Address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = 'Pincode must contain 6 digits';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // 1. Create payment order on server (client passes ONLY shippingAddress)
      const shippingAddress = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        addressLine1: formData.addressLine1.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      };

      const response = await createPaymentOrderApi(shippingAddress);
      const data = response.data;

      // 2. Load Razorpay script dynamically
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        setGeneralError('Failed to load Razorpay SDK. Please check your internet connection and try again.');
        setLoading(false);
        return;
      }

      // 3. Configure and open Razorpay
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'ShopKart',
        description: 'ShopKart Order Payment',
        order_id: data.razorpayOrderId,
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#4f46e5',
        },
        handler: async function (paymentResponse) {
          try {
            // Forward payment response parameters to verify-payment endpoint
            await verifyPaymentApi({
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            // Dispatches cart clear action on successful payment verification
            dispatch(clearCart());
            navigate(`/order-success/${data.shopKartOrderId}`);
          } catch (err) {
            setGeneralError(err.response?.data?.message || 'Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            paymentFailedApi({ shopKartOrderId: data.shopKartOrderId }).catch(() => {});
            setLoading(false);
            setGeneralError('Payment failed. Your cart has not been cleared. Please try again.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        paymentFailedApi({ shopKartOrderId: data.shopKartOrderId }).catch(() => {});
        setLoading(false);
        setGeneralError('Payment failed. Your cart has not been cleared. Please try again.');
      });

      rzp.open();
    } catch (err) {
      setLoading(false);
      setGeneralError(err.response?.data?.message || 'Failed to initiate order. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6 sm:p-8">
      <h2 className="text-xs uppercase tracking-[0.25em] font-semibold text-neutral-900 mb-6 pb-4 border-b border-neutral-200 flex items-center justify-between">
        <span>Delivery Address</span>
        <span className="text-[10px] text-neutral-400 font-normal tracking-[0.15em] uppercase">Step 1 of 1</span>
      </h2>

      {generalError && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-neutral-50 border-l-2 border-black text-neutral-800 text-xs tracking-wide">
          <svg className="w-4 h-4 shrink-0 mt-0.5 text-neutral-900" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{generalError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className="block text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-600 mb-1.5">
            Full Name <span className="text-neutral-400">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="E.G. ALEXANDER VANCE"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border bg-neutral-50/50 hover:bg-white focus:bg-white text-xs tracking-wider uppercase placeholder:text-neutral-400 placeholder:normal-case text-neutral-900 focus:outline-none transition-colors ${
              fieldErrors.fullName ? 'border-red-500' : 'border-neutral-200 focus:border-black'
            }`}
          />
          {fieldErrors.fullName && (
            <p className="text-[10px] text-red-600 mt-1 font-medium">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Phone */}
        <div className="sm:col-span-2">
          <label htmlFor="phone" className="block text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-600 mb-1.5">
            Mobile Number (10 Digits) <span className="text-neutral-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 font-mono text-xs">
              +91
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              maxLength="10"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full pl-12 pr-4 py-3 border bg-neutral-50/50 hover:bg-white focus:bg-white text-xs tracking-wider placeholder:text-neutral-400 font-mono text-neutral-900 focus:outline-none transition-colors ${
                fieldErrors.phone ? 'border-red-500' : 'border-neutral-200 focus:border-black'
              }`}
            />
          </div>
          {fieldErrors.phone && (
            <p className="text-[10px] text-red-600 mt-1 font-medium">{fieldErrors.phone}</p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label htmlFor="addressLine1" className="block text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-600 mb-1.5">
            Street Address <span className="text-neutral-400">*</span>
          </label>
          <input
            id="addressLine1"
            name="addressLine1"
            type="text"
            placeholder="Flat / Suite / Building, Street"
            value={formData.addressLine1}
            onChange={handleChange}
            className={`w-full px-4 py-3 border bg-neutral-50/50 hover:bg-white focus:bg-white text-xs tracking-wider placeholder:text-neutral-400 text-neutral-900 focus:outline-none transition-colors ${
              fieldErrors.addressLine1 ? 'border-red-500' : 'border-neutral-200 focus:border-black'
            }`}
          />
          {fieldErrors.addressLine1 && (
            <p className="text-[10px] text-red-600 mt-1 font-medium">{fieldErrors.addressLine1}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-600 mb-1.5">
            City <span className="text-neutral-400">*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="Mumbai / Bengaluru"
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-4 py-3 border bg-neutral-50/50 hover:bg-white focus:bg-white text-xs tracking-wider placeholder:text-neutral-400 text-neutral-900 focus:outline-none transition-colors ${
              fieldErrors.city ? 'border-red-500' : 'border-neutral-200 focus:border-black'
            }`}
          />
          {fieldErrors.city && (
            <p className="text-[10px] text-red-600 mt-1 font-medium">{fieldErrors.city}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-600 mb-1.5">
            State <span className="text-neutral-400">*</span>
          </label>
          <input
            id="state"
            name="state"
            type="text"
            placeholder="Maharashtra / Karnataka"
            value={formData.state}
            onChange={handleChange}
            className={`w-full px-4 py-3 border bg-neutral-50/50 hover:bg-white focus:bg-white text-xs tracking-wider placeholder:text-neutral-400 text-neutral-900 focus:outline-none transition-colors ${
              fieldErrors.state ? 'border-red-500' : 'border-neutral-200 focus:border-black'
            }`}
          />
          {fieldErrors.state && (
            <p className="text-[10px] text-red-600 mt-1 font-medium">{fieldErrors.state}</p>
          )}
        </div>

        {/* Pincode */}
        <div className="sm:col-span-2">
          <label htmlFor="pincode" className="block text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-600 mb-1.5">
            Postal Code (6 Digits) <span className="text-neutral-400">*</span>
          </label>
          <input
            id="pincode"
            name="pincode"
            type="text"
            maxLength="6"
            placeholder="400001"
            value={formData.pincode}
            onChange={handleChange}
            className={`w-full px-4 py-3 border bg-neutral-50/50 hover:bg-white focus:bg-white text-xs font-mono tracking-wider placeholder:text-neutral-400 text-neutral-900 focus:outline-none transition-colors ${
              fieldErrors.pincode ? 'border-red-500' : 'border-neutral-200 focus:border-black'
            }`}
          />
          {fieldErrors.pincode && (
            <p className="text-[10px] text-red-600 mt-1 font-medium">{fieldErrors.pincode}</p>
          )}
        </div>
      </div>

      {/* Payment Action */}
      <div className="mt-8 pt-6 border-t border-neutral-200">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-black text-white hover:bg-neutral-800 active:bg-black font-medium text-xs uppercase tracking-[0.25em] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="spinner spinner-white"></span>
              <span>Initiating Transaction...</span>
            </>
          ) : (
            <>
              <span>Proceed to Payment</span>
              <span>→</span>
            </>
          )}
        </button>
        <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 text-center mt-3">
          Encrypted 256-Bit SSL Checkout • Razorpay Gateway
        </p>
      </div>
    </form>
  );
};

export default CheckoutForm;
