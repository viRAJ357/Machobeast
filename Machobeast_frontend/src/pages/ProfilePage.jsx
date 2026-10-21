import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  ShieldCheck,
  CreditCard,
  Heart,
  Award,
  ChevronRight,
  LogOut,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { logoutUserThunk } from '../redux/slices/authSlice';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.order);

  const displayName = user?.name || 'Nikhil Kumar';
  const displayEmail = user?.email || 'nikhil@machobeast.com';
  const displayPhone = user?.phone || '+91 98765 43210';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-slate-900 font-bold">My Account</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-amber-500 text-black flex items-center justify-center font-display font-black text-3xl shadow-lg border-2 border-amber-300">
              {displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">{displayName}</h1>
                <span className="bg-amber-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  MachoBeast VIP
                </span>
              </div>
              <p className="text-xs text-gray-300">{displayEmail} • {displayPhone}</p>
              <p className="text-xs text-emerald-400 font-semibold mt-1">✓ 100% Genuine Nutrition Member</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
              <span className="block font-display font-black text-2xl text-amber-400">{orders.length}</span>
              <span className="text-[11px] text-gray-300 uppercase font-semibold">Orders</span>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
              <span className="block font-display font-black text-2xl text-emerald-400">1,250</span>
              <span className="text-[11px] text-gray-300 uppercase font-semibold">Beast Coins</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Orders */}
          <Link
            to="/orders"
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Your Orders</h3>
              <p className="text-xs text-gray-500 mt-1">Track, return, or buy again from your order history</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Card 2: Shopping Cart */}
          <Link
            to="/cart"
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Shopping Cart</h3>
              <p className="text-xs text-gray-500 mt-1">Manage supplements in your cart ready for checkout</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Card 3: Brands Catalog */}
          <Link
            to="/brands"
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Verified Brands</h3>
              <p className="text-xs text-gray-500 mt-1">Browse 100% genuine products by authorized brands</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>

        {/* Saved Addresses Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-base text-slate-900">Saved Addresses</h2>
            </div>
            <span className="text-xs text-amber-600 font-bold cursor-pointer hover:underline">+ Add New Address</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-amber-300 bg-amber-50/30 rounded-xl p-4 relative">
              <span className="absolute top-3 right-3 text-[10px] font-extrabold bg-amber-500 text-black px-2 py-0.5 rounded uppercase">Default</span>
              <p className="font-bold text-sm text-slate-900">{displayName}</p>
              <p className="text-xs text-gray-600 mt-1">Flat 402, Royal Residency, Sector 18</p>
              <p className="text-xs text-gray-600">Noida, Uttar Pradesh - 201301</p>
              <p className="text-xs text-gray-500 mt-2">Mobile: {displayPhone}</p>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <span className="text-[10px] font-extrabold bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase mb-1 inline-block">Work</span>
              <p className="font-bold text-sm text-slate-900">{displayName}</p>
              <p className="text-xs text-gray-600 mt-1">Cyber City, Tower B, 5th Floor</p>
              <p className="text-xs text-gray-600">Gurugram, Haryana - 122002</p>
              <p className="text-xs text-gray-500 mt-2">Mobile: {displayPhone}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
