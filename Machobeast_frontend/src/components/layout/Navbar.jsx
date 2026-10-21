import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  MapPin,
  Sparkles,
  Package,
  ShieldCheck,
  Check
} from 'lucide-react';
import { logoutUserThunk } from '../../redux/slices/authSlice';
import { setSearchQuery } from '../../redux/slices/uiSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { clearDraggingProduct } from '../../redux/slices/productSlice';

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { searchQuery } = useSelector((state) => state.ui);
  const { categories, isDraggingProduct } = useSelector((state) => state.products);

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNavbarDropOver, setIsNavbarDropOver] = useState(false);
  const [selectedSearchCategory, setSelectedSearchCategory] = useState('all');
  const [deliveryPincode, setDeliveryPincode] = useState('Mumbai 400001');
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [tempPincode, setTempPincode] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      let url = `/shop?search=${encodeURIComponent(searchQuery)}`;
      if (selectedSearchCategory !== 'all') {
        url += `&category=${selectedSearchCategory}`;
      }
      navigate(url);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUserThunk());
    setIsAccountOpen(false);
    navigate('/login');
  };

  const handleNavCartDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNavbarDropOver(false);
    dispatch(clearDraggingProduct());

    let product = null;

    if (window.__MACHOBEAST_DRAGGED_ITEM__) {
      product = window.__MACHOBEAST_DRAGGED_ITEM__;
    } else if (isDraggingProduct) {
      product = isDraggingProduct;
    } else {
      try {
        const dataStr = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
        if (dataStr) product = JSON.parse(dataStr);
      } catch (err) {}
    }

    if (product) {
      const selectedVariant = product.variants?.[0] || {
        weight: 'Standard',
        flavor: 'Regular',
        price: product.price || 999,
        mrp: product.mrp || 1499
      };

      dispatch(
        addToCart({
          id: product.id || product._id,
          name: product.name,
          variant: `${selectedVariant.weight}, ${selectedVariant.flavor}`,
          price: selectedVariant.price,
          mrp: selectedVariant.mrp,
          image: product.image,
          isVeg: product.isVeg !== false
        })
      );
      window.__MACHOBEAST_DRAGGED_ITEM__ = null;
    }
  };

  const handleUpdatePincode = (e) => {
    e.preventDefault();
    if (tempPincode.trim()) {
      setDeliveryPincode(`Deliver to ${tempPincode.trim()}`);
      setIsPincodeModalOpen(false);
    }
  };

  return (
    <>
      {/* Primary Header (#131921) */}
      <header className="bg-[#131921] text-white sticky top-0 z-50 text-xs select-none">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 flex items-center h-15 py-1 gap-2 sm:gap-4 justify-between">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-1 py-1.5 px-2 rounded-sm border border-transparent hover:border-white transition-all shrink-0 group"
          >
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="font-display font-black text-xl tracking-tight text-white leading-none">
                  macho<span className="text-[#febd69]">beast</span>
                </span>
                <span className="text-[10px] text-[#febd69] font-bold ml-0.5">.in</span>
              </div>
              <div className="w-12 h-1 bg-[#febd69] rounded-full mt-0.5 -rotate-2 transform group-hover:scale-105 transition-transform"></div>
            </div>
          </Link>

          {/* Location / Deliver to Pincode */}
          <button
            onClick={() => setIsPincodeModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 py-1 px-2 rounded-sm border border-transparent hover:border-white text-left transition-all shrink-0 cursor-pointer"
            title="Click to update delivery location"
          >
            <MapPin className="w-4 h-4 text-white shrink-0 mt-1" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] text-[#cccccc] font-normal">Delivering to</span>
              <span className="text-xs font-bold text-white truncate max-w-[110px]">
                {deliveryPincode}
              </span>
            </div>
          </button>

          {/* 3-Part Search Bar */}
          <div className="flex-1 max-w-3xl mx-1 sm:mx-2">
            <form onSubmit={handleSearchSubmit} className="flex h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#f3a847]">
              {/* Category Dropdown on Left */}
              <select
                value={selectedSearchCategory}
                onChange={(e) => setSelectedSearchCategory(e.target.value)}
                className="bg-[#e6e6e6] hover:bg-[#d4d4d4] text-slate-800 text-xs font-medium px-2.5 border-r border-[#cdcdcd] focus:outline-none cursor-pointer hidden sm:block shrink-0 max-w-[130px] truncate"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Main Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search MachoBeast supplements, proteins, creatine..."
                className="w-full px-3 text-sm text-slate-900 bg-white placeholder:text-gray-500 focus:outline-none font-normal"
              />

              {/* Orange Search Button */}
              <button
                type="submit"
                className="bg-[#febd69] hover:bg-[#f3a847] text-slate-900 px-5 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>
            </form>
          </div>

          {/* Right Header Navigation Items */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Language / India Flag Indicator */}
            <div className="hidden lg:flex items-center gap-1 py-1.5 px-2 rounded-sm border border-transparent hover:border-white cursor-pointer">
              <span className="text-sm">🇮🇳</span>
              <span className="text-xs font-bold uppercase text-white">EN</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>

            {/* MachoBeast Seller Central Access */}
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 py-1.5 px-2 rounded-sm border border-amber-400/40 bg-amber-400/10 hover:border-amber-400 text-[#febd69] transition-all"
              title="Add future items & manage inventory"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#febd69]" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-gray-300">Seller Central</span>
                <span className="text-xs font-bold text-[#febd69]">Admin</span>
              </div>
            </Link>

            {/* Account & Lists Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex flex-col text-left py-1 px-2 rounded-sm border border-transparent hover:border-white transition-all cursor-pointer"
              >
                <span className="text-[11px] text-[#cccccc] font-normal leading-tight">
                  Hello, {isAuthenticated ? user?.name.split(' ')[0] : 'sign in'}
                </span>
                <div className="flex items-center gap-0.5">
                  <span className="text-xs font-bold text-white leading-tight">
                    Account & Lists
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </button>

              {/* Account Dropdown Menu */}
              {isAccountOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-md shadow-2xl border border-gray-200 py-3 z-50 animate-in fade-in zoom-in-95">
                  {!isAuthenticated ? (
                    <div className="px-4 pb-3 border-b border-gray-200 text-center">
                      <Link
                        to="/login"
                        onClick={() => setIsAccountOpen(false)}
                        className="block w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded text-xs font-bold text-slate-900 shadow-sm"
                      >
                        Sign in
                      </Link>
                      <p className="text-[11px] text-gray-600 mt-2">
                        New to MachoBeast?{' '}
                        <Link
                          to="/register"
                          onClick={() => setIsAccountOpen(false)}
                          className="text-[#007185] hover:text-[#c7511f] hover:underline font-semibold"
                        >
                          Start here.
                        </Link>
                      </p>
                    </div>
                  ) : (
                    <div className="px-4 pb-2 border-b border-gray-200">
                      <p className="text-[11px] text-gray-500">Your Account</p>
                      <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                    </div>
                  )}

                  <div className="py-2 text-xs">
                    <p className="px-4 py-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Your Lists & Account
                    </p>
                    <Link
                      to="/orders"
                      onClick={() => setIsAccountOpen(false)}
                      className="block px-4 py-1.5 text-gray-700 hover:text-[#c7511f] hover:bg-gray-100"
                    >
                      Your Orders & Tracking
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsAccountOpen(false)}
                      className="block px-4 py-1.5 text-gray-700 hover:text-[#c7511f] hover:bg-gray-100"
                    >
                      Your Account & Addresses
                    </Link>
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsAccountOpen(false)}
                      className="block px-4 py-1.5 text-amber-700 font-bold bg-amber-50 hover:bg-amber-100"
                    >
                      ★ MachoBeast Seller Central
                    </Link>
                    {isAuthenticated && (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-1.5 text-red-600 hover:bg-red-50 font-semibold border-t border-gray-100 mt-1 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Returns & Orders */}
            <Link
              to="/orders"
              className="hidden sm:flex flex-col text-left py-1 px-2 rounded-sm border border-transparent hover:border-white transition-all shrink-0"
            >
              <span className="text-[11px] text-[#cccccc] font-normal leading-tight">Returns</span>
              <span className="text-xs font-bold text-white leading-tight">& Orders</span>
            </Link>

            {/* Drag & Drop Enabled Shopping Cart Drop Target */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
                if (!isNavbarDropOver) setIsNavbarDropOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsNavbarDropOver(false);
              }}
              onDrop={handleNavCartDrop}
              className={`relative py-1 px-2 rounded-sm transition-all cursor-pointer ${
                isNavbarDropOver
                  ? 'bg-[#febd69] text-black ring-4 ring-amber-400 scale-110 shadow-lg'
                  : isDraggingProduct
                  ? 'border-2 border-dashed border-[#febd69] animate-pulse bg-white/10'
                  : 'border border-transparent hover:border-white'
              }`}
            >
              <Link to="/cart" className="flex items-center gap-1">
                <div className="relative">
                  <ShoppingCart className={`w-7 h-7 ${isNavbarDropOver ? 'text-black' : 'text-white'}`} />
                  <span className="absolute -top-1 left-3 bg-[#f08804] text-white font-black text-[12px] px-1.5 rounded-full shadow leading-none py-0.5">
                    {totalQuantity}
                  </span>
                </div>
                <span className={`text-xs font-bold mt-2 hidden sm:inline ${isNavbarDropOver ? 'text-black font-black' : 'text-white'}`}>
                  {isNavbarDropOver ? 'Drop Here!' : 'Cart'}
                </span>
              </Link>
            </div>

          </div>

        </div>
      </header>

      {/* Pincode Location Modal */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-2xl text-slate-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <h4 className="font-bold text-sm text-gray-900">Choose your location</h4>
              <button
                onClick={() => setIsPincodeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Delivery options and speeds may vary based on your location.
            </p>
            <form onSubmit={handleUpdatePincode} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={tempPincode}
                  onChange={(e) => setTempPincode(e.target.value)}
                  placeholder="Enter a 6-digit Indian PIN code"
                  className="flex-1 bg-gray-50 border border-gray-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold px-4 py-2 rounded text-xs shadow-sm cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
