import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dumbbell, Lock, Mail, User, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { registerUserThunk, clearAuthError } from '../redux/slices/authSlice';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [validationErr, setValidationErr] = useState('');

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
    setValidationErr('');

    if (formData.password !== formData.confirmPassword) {
      setValidationErr('Passwords do not match');
      return;
    }

    dispatch(
      registerUserThunk({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
    );
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-amber-400 rounded-xl mb-3 shadow-md">
            <Dumbbell className="w-6 h-6 fill-amber-400" />
          </div>
          <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
            Create Your <span className="text-amber-500">MachoBeast</span> Account
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Join thousands of fitness enthusiasts & get 5% off your first order!
          </p>
        </div>

        {(error || validationErr) && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error || validationErr}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Vikram Singh"
                className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

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
              Mobile Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
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
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-slate-900 text-amber-400 font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-amber-600 hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
