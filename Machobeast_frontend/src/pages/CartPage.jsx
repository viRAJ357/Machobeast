import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Check,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice';

// Available demo promo codes
const AVAILABLE_COUPONS = [
  {
    code: 'MACHOBEAST5',
    discountPercent: 5,
    minOrder: 0,
    description: 'Flat 5% OFF on all sports nutrition'
  },
  {
    code: 'BEAST10',
    discountPercent: 10,
    minOrder: 1999,
    description: '10% OFF on orders above ₹1,999'
  },
  {
    code: 'FIRSTBUY',
    flatDiscount: 150,
    minOrder: 999,
    description: 'Flat ₹150 OFF on orders above ₹999'
  }
];

export const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items = [] } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  // Local state for coupon input and application
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Calculations
  const FREE_DELIVERY_THRESHOLD = 999;
  const STANDARD_DELIVERY_FEE = 70;

  const {
    itemsCount,
    itemsSubtotal,
    itemsMrpTotal,
    catalogSavings,
    deliveryCharges,
    couponDiscount,
    finalTotal,
    totalSavings,
    freeDeliveryProgress,
    amountNeededForFreeDelivery
  } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    let mrpTotal = 0;

    items.forEach((item) => {
      const qty = item.quantity || 1;
      const price = Number(item.price) || 0;
      const mrp = Number(item.mrp) || price;

      count += qty;
      subtotal += price * qty;
      mrpTotal += mrp * qty;
    });

    const savingsFromMrp = Math.max(0, mrpTotal - subtotal);

    // Delivery calculation: Free above ₹999
    const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || items.length === 0;
    const delivery = isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;

    // Coupon discount calculation
    let discount = 0;
    if (appliedCoupon && subtotal > 0) {
      if (appliedCoupon.discountPercent) {
        discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
      } else if (appliedCoupon.flatDiscount) {
        discount = Math.min(subtotal, appliedCoupon.flatDiscount);
      }
    }

    const total = Math.max(0, subtotal - discount + delivery);
    const overallSavings = savingsFromMrp + discount;

    const progress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));
    const amountNeeded = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

    return {
      itemsCount: count,
      itemsSubtotal: subtotal,
      itemsMrpTotal: mrpTotal,
      catalogSavings: savingsFromMrp,
      deliveryCharges: delivery,
      couponDiscount: discount,
      finalTotal: total,
      totalSavings: overallSavings,
      freeDeliveryProgress: progress,
      amountNeededForFreeDelivery: amountNeeded
    };
  }, [items, appliedCoupon]);

  // Handlers for cart actions
  const handleIncreaseQty = (item) => {
    dispatch(
      updateQuantity({
        id: item.id,
        variant: item.variant,
        quantity: (item.quantity || 1) + 1
      })
    );
  };

  const handleDecreaseQty = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateQuantity({
          id: item.id,
          variant: item.variant,
          quantity: item.quantity - 1
        })
      );
    } else {
      // Remove when reducing from 1
      dispatch(removeFromCart({ id: item.id, variant: item.variant }));
    }
  };

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart({ id: item.id, variant: item.variant }));
  };

  const handleClearAll = () => {
    dispatch(clearCart());
    setAppliedCoupon(null);
    setShowClearConfirm(false);
  };

  // Coupon handlers
  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    setCouponError('');
    setCouponSuccess('');

    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const matchedCoupon = AVAILABLE_COUPONS.find(
      (c) => c.code.toUpperCase() === code
    );

    if (!matchedCoupon) {
      setCouponError('Invalid coupon code. Try MACHOBEAST5 or BEAST10');
      return;
    }

    if (itemsSubtotal < matchedCoupon.minOrder) {
      setCouponError(
        `Coupon ${matchedCoupon.code} requires a minimum order of ₹${matchedCoupon.minOrder.toLocaleString('en-IN')}`
      );
      return;
    }

    setAppliedCoupon(matchedCoupon);
    setCouponInput('');
    setCouponSuccess(`Coupon ${matchedCoupon.code} applied successfully!`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  // ------------------------------------------------------------
  // EMPTY CART STATE
  // ------------------------------------------------------------
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Link to="/" className="hover:text-amber-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-slate-900 font-bold">Shopping Cart</span>
            </nav>
          </div>
        </div>

        {/* Empty State Card */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 text-center">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 sm:p-14 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Illustration */}
            <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-amber-50 border-2 border-amber-200 text-amber-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShoppingCart className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.5]" />
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-black text-amber-400 flex items-center justify-center text-xs font-extrabold shadow-md">
                0
              </div>
            </div>

            {/* Heading & Subtitle */}
            <h2 className="relative z-10 font-display font-black text-2xl sm:text-3xl text-slate-950 tracking-tight mb-3">
              Your Shopping Cart is Empty
            </h2>
            <p className="relative z-10 text-sm sm:text-base text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
              Looks like you haven't fueled your cart yet. Explore our genuine whey proteins, creatine, and beast supplements to get started!
            </p>

            {/* Action Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto bg-black hover:bg-slate-900 text-amber-400 hover:text-amber-300 font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/brands"
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold px-6 py-3.5 rounded-xl transition-all text-sm text-center"
              >
                Explore Brands
              </Link>
            </div>

            {/* Quick Category Suggestions */}
            <div className="relative z-10 mt-12 pt-8 border-t border-gray-100">
              <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-4">
                Popular Categories To Explore
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { name: 'Whey Protein', link: '/shop?category=whey-protein' },
                  { name: 'Whey Isolate', link: '/shop?category=whey-isolate' },
                  { name: 'Creatine', link: '/shop?category=creatine' },
                  { name: 'Pre Workout', link: '/shop?category=pre-workout' },
                  { name: 'Mass Gainer', link: '/shop?category=mass-gainer' },
                  { name: 'Peanut Butter', link: '/shop?category=peanut-butter' }
                ].map((cat, i) => (
                  <Link
                    key={i}
                    to={cat.link}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-gray-200 hover:border-amber-300 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // FULL SHOPPING CART WITH ITEMS
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link to="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to="/shop" className="hover:text-amber-600 transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-slate-900 font-bold">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Page Title & Clear Cart Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 tracking-tight flex items-center gap-3">
              <span>Shopping Cart</span>
              <span className="text-sm font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review your selected authentic supplements before checkout
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-black py-2 px-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue Shopping
            </Link>

            {showClearConfirm ? (
              <div className="flex items-center gap-2 bg-red-50 p-1.5 rounded-lg border border-red-200 animate-in fade-in">
                <span className="text-xs text-red-700 font-bold pl-1">Clear all?</span>
                <button
                  onClick={handleClearAll}
                  className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded hover:bg-red-700 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 py-2 px-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Cart Items List                             */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free Delivery Tracker Banner */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  {deliveryCharges === 0 ? (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Congratulations! You unlocked FREE Delivery!
                    </span>
                  ) : (
                    <span className="text-slate-800 font-bold">
                      Add <span className="text-amber-600 font-extrabold">₹{amountNeededForFreeDelivery.toLocaleString('en-IN')}</span> more to get <span className="text-emerald-600 font-extrabold">FREE Express Delivery</span>
                    </span>
                  )}
                </div>
                <span className="text-gray-500 font-semibold">{freeDeliveryProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    deliveryCharges === 0 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'
                  }`}
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items Container */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
              {items.map((item, index) => {
                const itemPrice = Number(item.price) || 0;
                const itemMrp = Number(item.mrp) || itemPrice;
                const itemTotal = itemPrice * (item.quantity || 1);
                const itemMrpTotal = itemMrp * (item.quantity || 1);
                const itemDiscount = itemMrp > itemPrice ? Math.round(((itemMrp - itemPrice) / itemMrp) * 100) : 0;

                return (
                  <div
                    key={`${item.id}-${item.variant || index}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-slate-50/50"
                  >
                    {/* Product Image & Details */}
                    <div className="flex items-start gap-4 flex-1">
                      
                      {/* Product Image */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-gray-200 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=200';
                          }}
                        />
                      </div>

                      {/* Info & Variants */}
                      <div className="flex-1 min-w-0">
                        {/* Veg Badge & Rating */}
                        <div className="flex items-center gap-2 mb-1">
                          {item.isVeg !== false ? (
                            <span
                              title="100% Vegetarian"
                              className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center p-0.5 rounded-sm"
                            >
                              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                            </span>
                          ) : (
                            <span
                              title="Non-Vegetarian"
                              className="w-3.5 h-3.5 border border-red-600 flex items-center justify-center p-0.5 rounded-sm"
                            >
                              <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-red-600"></span>
                            </span>
                          )}

                          {itemDiscount > 0 && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                              {itemDiscount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Product Title */}
                        <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2 hover:text-amber-600 transition-colors">
                          {item.name}
                        </h3>

                        {/* Variant (Weight, Flavor) */}
                        {item.variant && (
                          <p className="text-xs text-gray-500 mt-1 font-medium flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            {item.variant}
                          </p>
                        )}

                        {/* Pricing (Mobile View Price Display) */}
                        <div className="sm:hidden flex items-baseline gap-2 mt-2">
                          <span className="font-extrabold text-base text-slate-950">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </span>
                          {itemMrpTotal > itemTotal && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{itemMrpTotal.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Desktop Price */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      
                      {/* Price (Desktop View) */}
                      <div className="hidden sm:block text-right">
                        <div className="font-extrabold text-lg text-slate-950">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </div>
                        {itemMrpTotal > itemTotal && (
                          <div className="text-xs text-gray-400 line-through">
                            MRP: ₹{itemMrpTotal.toLocaleString('en-IN')}
                          </div>
                        )}
                        <div className="text-[11px] text-gray-500">
                          (₹{itemPrice.toLocaleString('en-IN')} each)
                        </div>
                      </div>

                      {/* Quantity Selector + Remove Button */}
                      <div className="flex items-center gap-3">
                        {/* Quantity Counter */}
                        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl overflow-hidden shadow-inner">
                          <button
                            onClick={() => handleDecreaseQty(item)}
                            title={item.quantity === 1 ? 'Remove from cart' : 'Decrease quantity'}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          
                          <span className="w-9 text-center font-extrabold text-sm text-slate-900">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleIncreaseQty(item)}
                            title="Increase quantity"
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleRemoveItem(item)}
                          title="Remove item"
                          className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 flex items-center justify-center transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* MachoBeast Trust Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white rounded-xl p-3.5 border border-gray-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">100% Authentic</p>
                  <p className="text-[11px] text-gray-500">Direct Brand Sourcing</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-gray-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Free Express Shipping</p>
                  <p className="text-[11px] text-gray-500">Orders above ₹999</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3.5 border border-gray-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Easy Returns</p>
                  <p className="text-[11px] text-gray-500">7 Days Hassle-Free</p>
                </div>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Order Summary Card (Sticky)                */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            
            {/* Summary Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
              
              <h2 className="font-display font-black text-lg text-slate-950 pb-4 border-b border-gray-100 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-semibold text-gray-500">
                  {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                </span>
              </h2>

              {/* Price Breakdown */}
              <div className="py-4 space-y-3 text-sm">
                
                {/* Total MRP */}
                <div className="flex items-center justify-between text-gray-500">
                  <span>Total MRP</span>
                  <span className="font-semibold text-slate-800">
                    ₹{itemsMrpTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between text-gray-600">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    ₹{itemsSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Catalog Savings */}
                {catalogSavings > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-medium">
                    <span>Retail Discount</span>
                    <span className="font-bold">
                      -₹{catalogSavings.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {/* Coupon Discount */}
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Coupon: <strong>{appliedCoupon.code}</strong></span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove coupon"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Delivery Fee */}
                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span>Delivery Charges</span>
                    {itemsSubtotal < FREE_DELIVERY_THRESHOLD && (
                      <span className="text-[10px] text-gray-400">(Standard)</span>
                    )}
                  </div>
                  <span>
                    {deliveryCharges === 0 ? (
                      <span className="text-emerald-600 font-extrabold uppercase text-xs">
                        FREE
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-900">
                        ₹{deliveryCharges}
                      </span>
                    )}
                  </span>
                </div>

                {/* Free delivery callout note */}
                {deliveryCharges > 0 && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    Add ₹{amountNeededForFreeDelivery.toLocaleString('en-IN')} more to unlock FREE delivery
                  </p>
                )}

                <div className="pt-3 border-t border-gray-100">
                  {/* Grand Total */}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-display font-black text-lg text-slate-950">
                        Total Amount
                      </span>
                      <p className="text-[11px] text-gray-400">Inclusive of all taxes</p>
                    </div>
                    <div className="text-right">
                      <span className="font-display font-black text-2xl text-slate-950">
                        ₹{finalTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Total Savings Callout */}
                  {totalSavings > 0 && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-2.5 rounded-xl text-center flex items-center justify-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>You are saving ₹{totalSavings.toLocaleString('en-IN')} on this order!</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Coupon Code Section */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-2">
                  Apply Coupon Code
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      placeholder="Enter promo code"
                      className="w-full bg-gray-50 text-xs font-bold uppercase rounded-xl pl-9 pr-3 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyCoupon()}
                    className="bg-black hover:bg-slate-900 text-amber-400 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all uppercase tracking-wider"
                  >
                    Apply
                  </button>
                </div>

                {/* Error message */}
                {couponError && (
                  <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {couponError}
                  </p>
                )}

                {/* Success message */}
                {couponSuccess && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {couponSuccess}
                  </p>
                )}

                {/* Quick Coupon Suggestions */}
                <div className="mt-3">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Available Offers:
                  </p>
                  <div className="space-y-1.5">
                    {AVAILABLE_COUPONS.map((coupon) => (
                      <div
                        key={coupon.code}
                        onClick={() => handleApplyCoupon(coupon.code)}
                        className="p-2 rounded-lg bg-gray-50 hover:bg-amber-50/80 border border-dashed border-gray-300 hover:border-amber-400 flex items-center justify-between cursor-pointer transition-colors group"
                      >
                        <div>
                          <span className="font-mono font-extrabold text-xs text-slate-900 group-hover:text-amber-700">
                            {coupon.code}
                          </span>
                          <p className="text-[10px] text-gray-500 leading-tight">
                            {coupon.description}
                          </p>
                        </div>
                        <span className="text-[11px] font-extrabold text-amber-600 group-hover:underline">
                          Apply
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Proceed to Checkout CTA */}
              <div className="pt-6">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-extrabold text-sm py-4 px-6 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Safe Checkout</span>
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CartPage;
