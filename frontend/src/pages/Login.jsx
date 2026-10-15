import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCart } from '../features/cart/cartSlice';
import api from '../services/api';


const Login = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);

      
      await api.post('/customers/login', { email, password });
      dispatch(fetchCart());

      
      navigate('/home');
    } catch (err) {
      
      setError(err.response?.data?.message || 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

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
            Autumn / Winter 2026
          </span>
          <h1 className="font-serif text-4xl xl:text-5xl font-light tracking-[0.1em] uppercase leading-tight mb-6">
            Contemporary silhouettes for modern living.
          </h1>
          <p className="text-neutral-400 text-xs tracking-wider leading-relaxed uppercase font-light">
            Every piece curated with precision, architectural lines, and enduring material integrity.
          </p>
        </div>

        <div className="relative z-10 flex justify-between items-center text-[9px] tracking-[0.3em] uppercase text-neutral-500 border-t border-neutral-900 pt-6">
          <span>Edition 01</span>
          <span>All Rights Reserved</span>
        </div>

        {/* Minimalist ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-900/30 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Right: Clean Minimalist Sign In Form */}
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
              Client Portal
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl tracking-[0.18em] font-light text-black uppercase">
              Sign In
            </h2>
            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-wide">
              Enter your credentials to access your private atelier.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-neutral-50 border-l-2 border-black text-neutral-900 text-xs tracking-wide fade-in flex items-center gap-3">
              <span className="font-mono text-xs font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="block text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-600 mb-1.5">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="CLIENT@DOMAIN.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-neutral-200 hover:border-neutral-400 focus:border-black bg-neutral-50/50 hover:bg-white focus:bg-white text-xs tracking-wider uppercase placeholder:text-neutral-400 placeholder:normal-case text-neutral-900 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-[10px] uppercase tracking-[0.22em] font-medium text-neutral-600 mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 border border-neutral-200 hover:border-neutral-400 focus:border-black bg-neutral-50/50 hover:bg-white focus:bg-white text-xs tracking-wider text-neutral-900 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white hover:bg-neutral-800 active:bg-black font-medium text-xs uppercase tracking-[0.28em] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="spinner spinner-white"></span>
                  <span>Verifying Credentials…</span>
                </>
              ) : (
                'Access Account'
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-neutral-200 text-center">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              New client?{' '}
              <Link to="/register" className="font-semibold text-black hover:underline underline-offset-4 ml-1">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
