import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
  Check,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { logoutUserThunk, updateDeliveryLocationThunk } from '../../redux/slices/authSlice';
import { setSearchQuery } from '../../redux/slices/uiSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { clearDraggingProduct } from '../../redux/slices/productSlice';
import { useCartSync } from '../../hooks/useCartSync';
import { getGuestLocation } from '../../utils/locationUtils';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const searchContainerRef = useRef(null);

  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search');

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { searchQuery } = useSelector((state) => state.ui);
  const { items: allProducts = [], categories = [], isDraggingProduct } = useSelector((state) => state.products);
  const { addItem } = useCartSync();

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isNavbarDropOver, setIsNavbarDropOver] = useState(false);
  const [selectedSearchCategory, setSelectedSearchCategory] = useState(() => urlCategory || 'all');
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [tempPincode, setTempPincode] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  // Synchronize category dropdown with active URL query when navigating or on /shop
  useEffect(() => {
    if (location.pathname === '/shop') {
      setSelectedSearchCategory(urlCategory || 'all');
    }
  }, [urlCategory, location.pathname]);

  // Compute effective location: database user profile takes priority, else guest localStorage
  const effectivePincode = user?.deliveryPincode || getGuestLocation().pincode || '400001';
  const effectiveCity = user?.deliveryCity || getGuestLocation().city || 'Mumbai';

  // Live Autocomplete Suggestions based on current search query and selected category
  const searchSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    const tokens = q.split(/[\s,]+/).filter(Boolean);

    return allProducts
      .filter((p) => {
        // If specific category is selected, scope suggestions to that category
        if (selectedSearchCategory && selectedSearchCategory !== 'all') {
          const matchCat =
            p.category?.toLowerCase() === selectedSearchCategory.toLowerCase() ||
            p.category?.toLowerCase().replace(/[-_]/g, ' ') === selectedSearchCategory.toLowerCase().replace(/[-_]/g, ' ');
          if (!matchCat) return false;
        }

        const combined = `${p.name} ${p.brand || ''} ${p.category || ''}`.toLowerCase().replace(/[-_]/g, ' ');
        return tokens.every((token) => {
          const cleanToken = token.replace(/[-_]/g, ' ');
          return combined.includes(cleanToken);
        });
      })
      .slice(0, 5);
  }, [searchQuery, selectedSearchCategory, allProducts]);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When user selects a category from the dropdown, immediately apply category to shop search
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedSearchCategory(newCategory);
    setIsSearchFocused(false);

    const params = new URLSearchParams();
    const currentQuery = searchQuery ? searchQuery.trim() : '';

    if (currentQuery) {
      params.set('search', currentQuery);
    }
    if (newCategory && newCategory !== 'all') {
      params.set('category', newCategory);
    }

    if (location.pathname === '/shop') {
      const currentSort = searchParams.get('sort');
      const currentRating = searchParams.get('rating');
      if (currentSort) params.set('sort', currentSort);
      if (currentRating) params.set('rating', currentRating);
    }

    const queryString = params.toString();
    navigate(queryString ? `/shop?${queryString}` : '/shop');
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setIsSearchFocused(false);

    const trimmed = searchQuery ? searchQuery.trim() : '';
    const params = new URLSearchParams();

    if (trimmed) {
      params.set('search', trimmed);
    }
    if (selectedSearchCategory && selectedSearchCategory !== 'all') {
      params.set('category', selectedSearchCategory);
    }

    const queryString = params.toString();
    navigate(queryString ? `/shop?${queryString}` : '/shop');
  };

  const handleSelectSuggestion = (product) => {
    setIsSearchFocused(false);
    navigate(`/product/${product.id || product._id}`);
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

      addItem({
        id: product.id || product._id,
        name: product.name,
        variant: `${selectedVariant.weight}, ${selectedVariant.flavor}`,
        price: selectedVariant.price,
        mrp: selectedVariant.mrp,
        image: product.image,
        isVeg: product.isVeg !== false
      });
      window.__MACHOBEAST_DRAGGED_ITEM__ = null;
    }
  };

  // Sync Pincode with Database (or Guest LocalStorage)
  const handleUpdatePincode = async (e) => {
    e.preventDefault();
    const pin = tempPincode.trim();
    if (pin) {
      setIsUpdatingLocation(true);
      try {
        await dispatch(updateDeliveryLocationThunk({ pincode: pin })).unwrap();
      } catch (err) {
        console.warn('Pincode sync warning:', err);
      } finally {
        setIsUpdatingLocation(false);
        setIsPincodeModalOpen(false);
        setTempPincode('');
      }
    }
  };

  return (
    <>
      {/* Primary Header (#131921) */}
      <header className="bg-[#131921] text-white sticky top-0 z-50 text-xs select-none shadow-md">
        <div className="max-w-[1500px] mx-auto px-2.5 sm:px-4 flex items-center h-14 sm:h-15 py-1 gap-2 sm:gap-4 justify-between">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-1 py-1 px-1.5 sm:px-2 rounded-sm border border-transparent hover:border-white transition-all shrink-0 group"
          >
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white leading-none">
                  macho<span className="text-[#febd69]">beast</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#febd69] font-bold ml-0.5">.in</span>
              </div>
              <div className="w-10 sm:w-12 h-0.5 sm:h-1 bg-[#febd69] rounded-full mt-0.5 -rotate-2 transform group-hover:scale-105 transition-transform"></div>
            </div>
          </Link>

          {/* Location / Deliver to Pincode (Desktop: Syncs with Database) */}
          <button
            onClick={() => {
              setTempPincode(effectivePincode);
              setIsPincodeModalOpen(true);
            }}
            className="hidden md:flex items-center gap-1.5 py-1 px-2 rounded-sm border border-transparent hover:border-white text-left transition-all shrink-0 cursor-pointer group"
            title="Click to update delivery location in database"
          >
            <MapPin className="w-4 h-4 text-[#febd69] shrink-0 mt-1 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] text-[#cccccc] font-normal">Delivering to</span>
              <span className="text-xs font-bold text-white truncate max-w-[125px]">
                {effectiveCity} {effectivePincode}
              </span>
            </div>
          </button>

          {/* 3-Part Search Bar (Desktop: md & up) */}
          <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-3xl mx-1 sm:mx-2 relative">
            <form onSubmit={handleSearchSubmit} className="flex h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#f3a847]">
              {/* Category Dropdown on Left */}
              <div className="relative shrink-0 flex items-center bg-[#e6e6e6] hover:bg-[#d4d4d4] border-r border-[#cdcdcd] transition-colors">
                <select
                  value={selectedSearchCategory}
                  onChange={handleCategoryChange}
                  aria-label="Select Search Category"
                  className="h-full bg-transparent text-slate-800 text-xs font-semibold pl-2.5 pr-6 focus:outline-none cursor-pointer hidden sm:block shrink-0 max-w-[145px] truncate appearance-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-600 absolute right-1.5 pointer-events-none hidden sm:block" />
              </div>

              {/* Main Search Input */}
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search MachoBeast supplements, proteins, creatine..."
                className="w-full px-3 text-sm text-slate-900 bg-white placeholder:text-gray-500 focus:outline-none font-normal"
              />

              {/* Clear button if query exists */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => dispatch(setSearchQuery(''))}
                  className="bg-white text-gray-400 hover:text-gray-700 px-2 flex items-center justify-center cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Orange Search Button */}
              <button
                type="submit"
                className="bg-[#febd69] hover:bg-[#f3a847] text-slate-900 px-5 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="Search Products"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
              </button>
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-11 bg-white text-slate-900 rounded-b-md shadow-2xl border border-gray-200 z-50 overflow-hidden divide-y divide-gray-100">
                <div className="bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Product Suggestions</span>
                  <span className="text-[10px] text-amber-600 font-medium">Press Enter for all</span>
                </div>
                {searchSuggestions.map((product) => (
                  <div
                    key={product.id || product._id}
                    onClick={() => handleSelectSuggestion(product)}
                    className="p-2.5 flex items-center gap-3 hover:bg-amber-50/70 cursor-pointer transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-8 h-8 object-contain bg-white rounded border border-gray-100 p-0.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-[10px] text-gray-500 capitalize">{product.brand} • {product.category}</p>
                    </div>
                    <span className="text-xs font-extrabold text-amber-700">₹{product.price || 999}</span>
                  </div>
                ))}
                <button
                  onClick={handleSearchSubmit}
                  className="w-full text-left p-2.5 bg-gray-50 hover:bg-amber-100 text-xs font-bold text-amber-800 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>
                    See all results for "{searchQuery}"
                    {selectedSearchCategory !== 'all' && (
                      <span className="text-gray-500 font-normal">
                        {' '}in {categories.find((c) => c.id === selectedSearchCategory)?.name || selectedSearchCategory}
                      </span>
                    )}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Header Navigation Items */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Pincode Trigger Button */}
            <button
              onClick={() => {
                setTempPincode(effectivePincode);
                setIsPincodeModalOpen(true);
              }}
              className="flex md:hidden items-center gap-1 py-1 px-1.5 text-gray-300 hover:text-white rounded border border-transparent hover:border-gray-600 cursor-pointer"
              title="Deliver to pincode"
            >
              <MapPin className="w-3.5 h-3.5 text-[#febd69]" />
              <span className="text-[10px] font-medium truncate max-w-[65px]">
                {effectivePincode}
              </span>
            </button>

            {/* Language / India Flag Indicator (Large screens only) */}
            <div className="hidden lg:flex items-center gap-1 py-1.5 px-2 rounded-sm border border-transparent hover:border-white cursor-pointer">
              <span className="text-sm">🇮🇳</span>
              <span className="text-xs font-bold uppercase text-white">EN</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>

            {/* MachoBeast Seller Central — Admin only */}
            {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 px-1.5 sm:px-2 rounded-sm border border-amber-400/40 bg-amber-400/10 hover:border-amber-400 text-[#febd69] transition-all"
              title="Add future items & manage inventory"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#febd69]" />
              <div className="flex flex-col leading-none">
                <span className="hidden sm:inline text-[10px] text-gray-300">Seller Central</span>
                <span className="text-[10px] sm:text-xs font-bold text-[#febd69]">Admin</span>
              </div>
            </Link>
            )}

            {/* Account & Lists Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex flex-col text-left py-1 px-1.5 sm:px-2 rounded-sm border border-transparent hover:border-white transition-all cursor-pointer"
              >
                <span className="text-[10px] sm:text-[11px] text-[#cccccc] font-normal leading-tight truncate max-w-[75px] sm:max-w-none">
                  Hello, {isAuthenticated ? user?.name.split(' ')[0] : 'Sign in'}
                </span>
                <div className="flex items-center gap-0.5">
                  <span className="text-[11px] sm:text-xs font-bold text-white leading-tight hidden sm:inline">
                    Account & Lists
                  </span>
                  <span className="text-[11px] font-bold text-white leading-tight sm:hidden">
                    Account
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
                      <p className="text-[10px] text-amber-700 font-semibold mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>Saved location: {effectiveCity} {effectivePincode}</span>
                      </p>
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
                    {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsAccountOpen(false)}
                      className="block px-4 py-1.5 text-amber-700 font-bold bg-amber-50 hover:bg-amber-100"
                    >
                      ★ MachoBeast Seller Central
                    </Link>
                    )}
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

            {/* Returns & Orders (Tablet & Desktop) */}
            <Link
              to="/orders"
              className="hidden md:flex flex-col text-left py-1 px-2 rounded-sm border border-transparent hover:border-white transition-all shrink-0"
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
              className={`relative py-1 px-1.5 sm:px-2 rounded-sm transition-all cursor-pointer ${
                isNavbarDropOver
                  ? 'bg-[#febd69] text-black ring-4 ring-amber-400 scale-110 shadow-lg'
                  : isDraggingProduct
                  ? 'border-2 border-dashed border-[#febd69] animate-pulse bg-white/10'
                  : 'border border-transparent hover:border-white'
              }`}
            >
              <Link to="/cart" className="flex items-center gap-1">
                <div className="relative">
                  <ShoppingCart className={`w-6 h-6 sm:w-7 sm:h-7 ${isNavbarDropOver ? 'text-black' : 'text-white'}`} />
                  <span className="absolute -top-1.5 left-2.5 sm:left-3 bg-[#f08804] text-white font-black text-[11px] sm:text-[12px] px-1.5 rounded-full shadow leading-none py-0.5">
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

        {/* Dedicated Full-Width Search Bar on Mobile (< 768px) */}
        <div className="md:hidden px-3 pb-2.5 pt-0.5">
          <form onSubmit={handleSearchSubmit} className="flex h-9 rounded-md overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-[#f3a847]">
            {/* Mobile Category Dropdown attached to search bar */}
            <div className="relative shrink-0 flex items-center bg-[#e6e6e6] hover:bg-[#d4d4d4] border-r border-[#cdcdcd] transition-colors">
              <select
                value={selectedSearchCategory}
                onChange={handleCategoryChange}
                aria-label="Select Category"
                className="h-full bg-transparent text-slate-800 text-[11px] font-bold pl-2 pr-5 focus:outline-none cursor-pointer max-w-[95px] truncate appearance-none"
              >
                <option value="all">All</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-2.5 h-2.5 text-gray-600 absolute right-1 pointer-events-none" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search supplements, proteins..."
              className="w-full px-2.5 text-xs text-slate-900 bg-white placeholder:text-gray-400 focus:outline-none font-normal"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => dispatch(setSearchQuery(''))}
                className="bg-white text-gray-400 hover:text-gray-700 px-2 flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] text-slate-900 px-3.5 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </header>

      {/* Pincode Location Modal — Database Synchronized */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl text-slate-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-sm text-gray-900">Choose your delivery location</h4>
              </div>
              <button
                onClick={() => setIsPincodeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-gray-600 mb-2">
              Enter your Indian PIN code to see delivery availability, speeds, and genuine MachoPrime shipping rates.
            </p>

            {isAuthenticated ? (
              <div className="bg-amber-50 border border-amber-200 rounded p-2 text-[11px] text-amber-900 mb-3 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Syncs with your authenticated account database profile.</span>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded p-2 text-[11px] text-gray-600 mb-3">
                Saved for your current browser session. Sign in to sync across devices.
              </div>
            )}

            <form onSubmit={handleUpdatePincode} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={tempPincode}
                  onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 110001 or 400001"
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold tracking-wider"
                />
                <button
                  type="submit"
                  disabled={isUpdatingLocation}
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold px-4 py-2 rounded-lg text-xs shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingLocation ? 'Saving...' : 'Apply'}
                </button>
              </div>

              {/* Quick Popular City Pincode Pills */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Popular Delivery Hubs:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { city: 'Mumbai', pin: '400001' },
                    { city: 'Delhi', pin: '110001' },
                    { city: 'Bengaluru', pin: '560001' },
                    { city: 'Hyderabad', pin: '500001' },
                    { city: 'Pune', pin: '411001' }
                  ].map((hub) => (
                    <button
                      key={hub.pin}
                      type="button"
                      onClick={() => setTempPincode(hub.pin)}
                      className="text-[10px] bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-900 px-2 py-0.5 rounded font-medium transition-colors"
                    >
                      {hub.city} ({hub.pin})
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
