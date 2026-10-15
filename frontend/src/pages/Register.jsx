import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';


const Register = () => {
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  
  const [fieldErrors, setFieldErrors] = useState({});

  
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  
  const validate = () => {
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required.';

    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Must be at least 6 characters.';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Enter a valid 10-digit phone number.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setApiError('');

    
    if (!validate()) return;

    try {
      setLoading(true);
      await api.post('/customers/register', formData);
      
      navigate('/login');
    } catch (err) {
      
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const borderClass = (field) =>
    fieldErrors[field]
      ? 'border-red-500'
      : 'border-neutral-200 hover:border-neutral-400 focus:border-black';

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left: High-Fashion Editorial Moodboard Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-950 text-white flex-col justify-between p-16 relative overflow-hidden border-r border-neutral-800">
        <div className="relative z-10">
          <Link to="/products" className="inline-block">
            <span className="font-serif text-2xl tracking-[0.35em] font-light text-white uppercase block">
              SHOPKART
            </span>
            <span className="text-[8px] tracking-[0.45em] text-neutral-400 uppercase -mt-0.5 block">
              Atelier & Archive
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md my-auto">
          <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-medium block mb-4">
            Private Client Registry
          </span>
          <h1 className="font-serif text-4xl xl:text-5xl font-light tracking-[0.1em] uppercase leading-tight mb-6">
            Join our curated community of discerning clients.
          </h1>
          <p className="text-neutral-400 text-xs tracking-wider leading-relaxed uppercase font-light">
            Register to enjoy complimentary express deliveries, private collections, and personalized atelier privileges.
          </p>
        </div>

        <div className="relative z-10 flex justify-between items-center text-[9px] tracking-[0.3em] uppercase text-neutral-500 border-t border-neutral-900 pt-6">
          <span>Edition 01</span>
          <span>Complimentary Membership</span>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-900/30 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Right: Clean Minimalist Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 fade-in">
        <div className="w-full max-w-md">
          {/* Mobile Brand Logo */}
          <div className="lg:hidden mb-12 text-center">
            <Link to="/products" className="inline-block">
              <span className="font-serif text-2xl tracking-[0.35em] font-light text-black uppercase">
                SHOPKART
              </span>
              <span className="text-[8px] tracking-[0.45em] text-neutral-400 uppercase block -mt-0.5">
                Edition 2026
              </span>
            </Link>
          </div>

          <div className="border-b border-neutral-200 pb-6 mb-8">
            <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-medium block mb-1">
              New Membership
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl tracking-[0.18em] font-light text-black uppercase">
              Client Registration
            </h2>
            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">
              Complete your atelier profile to begin shopping.
            </p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-neutral-50 border-l-2 border-black text-neutral-900 text-xs tracking-wide fade-in flex items-center gap-3">
              <span className="font-mono text-xs font-bold">!</span>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="reg-fullName" className="block text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-600 mb-1.5">
                Full Name
              </label>
              <input
                id="reg-fullName"
                name="fullName"
                type="text"
                placeholder="E.G. ALEXANDER VANCE"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border bg-neutral-50/50 hover:bg-white focus:bg-white text-xs tracking-wider uppercase placeholder:text-neutral-400 placeholder:normal-case text-neutral-900 focus:outline-none transition-colors ${borderClass('fullName')}`}
              />
              {fieldErrors.fullName && <p className="mt-1 text-[10px] text-red-600 font-medium">{fieldErrors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-600 mb-1.5">
                Email Address
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="CLIENT@DOMAIN.COM"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border bg-neutral-50/50 hover:bg-white focus:bg-white text-xs tracking-wider uppercase placeholder:text-neutral-400 placeholder:normal-case text-neutral-900 focus:outline-none transition-colors ${borderClass('email')}`}
              />
              {fieldErrors.email && <p className="mt-1 text-[10px] text-red-600 font-medium">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="reg-phone" className="block text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-600 mb-1.5">
                Mobile Number (10 Digits)
              </label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border bg-neutral-50/50 hover:bg-white focus:bg-white text-xs font-mono tracking-wider placeholder:text-neutral-400 text-neutral-900 focus:outline-none transition-colors ${borderClass('phone')}`}
              />
              {fieldErrors.phone && <p className="mt-1 text-[10px] text-red-600 font-medium">{fieldErrors.phone}</p>}
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-600 mb-1.5">
                Password (Min 6 Characters)
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border bg-neutral-50/50 hover:bg-white focus:bg-white text-xs tracking-wider text-neutral-900 focus:outline-none transition-colors ${borderClass('password')}`}
              />
              {fieldErrors.password && <p className="mt-1 text-[10px] text-red-600 font-medium">{fieldErrors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-black text-white hover:bg-neutral-800 active:bg-black font-medium text-xs uppercase tracking-[0.28em] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="spinner spinner-white"></span>
                  <span>Registering Profile…</span>
                </>
              ) : (
                'Create Atelier Account'
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-neutral-200 text-center">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Existing client?{' '}
              <Link to="/login" className="font-semibold text-black hover:underline underline-offset-4 ml-1">
                Access your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
