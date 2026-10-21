import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dumbbell, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { loginUserThunk, clearAuthError } from '../redux/slices/authSlice';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUserThunk(formData));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-amber-400 rounded-xl mb-3 shadow-md">
            <Dumbbell className="w-6 h-6 fill-amber-400" />
          </div>
          <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
            Welcome Back to <span className="text-amber-500">MachoBeast</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to access your orders, wishlist, and exclusive discounts.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="athlete@machobeast.com"
                className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-slate-900 text-amber-400 font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-amber-600 hover:underline">
              Create One Now
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
