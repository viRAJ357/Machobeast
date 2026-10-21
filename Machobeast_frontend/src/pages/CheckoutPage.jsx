import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ChevronRight,
  ArrowRight,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  AlertCircle,
  Package,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { clearCart } from '../redux/slices/cartSlice';
import { placeOrder } from '../redux/slices/orderSlice';

export const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // Address Form State
  const [address, setAddress] = useState({
    fullName: user?.name || 'Nikhil Kumar',
    phone: user?.phone || '9876543210',
    pincode: '201301',
    flat: 'Flat 402, Royal Residency',
    area: 'Sector 18',
    city: 'Noida',
    state: 'Uttar Pradesh',
    landmark: 'Near Metro Station',
    type: 'Home'
  });

  const [deliverySpeed, setDeliverySpeed] = useState('express'); // 'express' (free) or 'priority' (₹49)
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'cod', 'card', 'netbanking'
  const [upiId, setUpiId] = useState('nikhil@okhdfcbank');
  const [cardDetails, setCardDetails] = useState({ number: '4532 •••• •••• 8821', name: 'Nikhil Kumar', expiry: '08/28', cvv: '•••' });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Calculations
  const deliveryCharge = totalAmount > 999 || deliverySpeed === 'express' ? 0 : 49;
  const discountAmount = totalAmount > 1999 ? 200 : 0;
  const finalPayable = Math.max(0, totalAmount - discountAmount + deliveryCharge);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderData = {
        totalAmount: finalPayable,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          variant: item.variant,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          address: `${address.flat}, ${address.area}${address.landmark ? ', ' + address.landmark : ''}`,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Net Banking',
      };

      dispatch(placeOrder(orderData));
      dispatch(clearCart());
      setIsSubmitting(false);
      setOrderConfirmed({
        orderId: `MB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        estimatedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }, 1500);
  };

  // If cart is empty and no confirmation yet
  if (items.length === 0 && !orderConfirmed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display font-black text-2xl text-slate-900 mb-2">No Items in Checkout</h2>
        <p className="text-sm text-gray-500 mb-6">Your shopping cart is empty. Please add items to proceed with checkout.</p>
        <Link to="/shop" className="bg-black hover:bg-slate-900 text-amber-400 font-bold px-6 py-3 rounded-lg shadow-md flex items-center gap-2 text-sm uppercase">
          Explore Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // ORDER SUCCESS MODAL / SCREEN
  if (orderConfirmed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Order Placed Successfully!
          </span>
          <h1 className="font-display font-black text-3xl text-slate-950 mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            We have received your order and our warehouse is packing your authentic supplements.
          </p>

          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 mb-8 text-left space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">Order Number:</span>
              <span className="font-mono font-bold text-slate-900">{orderConfirmed.orderId}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">Estimated Delivery:</span>
              <span className="font-bold text-emerald-700">{orderConfirmed.estimatedDate}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">Delivery Address:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[240px]">{address.flat}, {address.city}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/orders"
              className="bg-black hover:bg-slate-900 text-amber-400 font-bold px-6 py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all"
            >
              <Package className="w-4 h-4" /> Track in My Orders
            </Link>
            <Link
              to="/shop"
              className="bg-white hover:bg-gray-100 text-slate-800 border border-gray-300 font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to="/cart" className="hover:text-amber-600">Cart</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-slate-900 font-bold">Secure Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 tracking-tight">
              MachoBeast <span className="text-amber-600">Checkout</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Complete your order with 100% Genuine Direct Brand Guarantee
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            256-Bit SSL Encrypted
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Shipping & Payment Steps (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Step 1: Delivery Address */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-black font-extrabold text-sm flex items-center justify-center">
                      1
                    </span>
                    <h2 className="font-bold text-lg text-slate-900">Delivery Address</h2>
                  </div>
                  <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Fast Dispatch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={address.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={address.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Flat, House no., Building, Apartment *</label>
                    <input
                      type="text"
                      name="flat"
                      required
                      value={address.flat}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Area, Street, Sector, Village *</label>
                    <input
                      type="text"
                      name="area"
                      required
                      value={address.area}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      value={address.landmark}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={address.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City / District *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={address.city}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={address.state}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Speed */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-7 h-7 rounded-full bg-amber-500 text-black font-extrabold text-sm flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-bold text-lg text-slate-900">Delivery Speed</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    onClick={() => setDeliverySpeed('express')}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                      deliverySpeed === 'express'
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliverySpeed"
                      checked={deliverySpeed === 'express'}
                      onChange={() => setDeliverySpeed('express')}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">Standard Free Express</span>
                        <span className="text-xs font-extrabold text-emerald-700 uppercase">FREE</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Delivered within 2–3 business days</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setDeliverySpeed('priority')}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                      deliverySpeed === 'priority'
                        ? 'border-amber-500 bg-amber-50/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliverySpeed"
                      checked={deliverySpeed === 'priority'}
                      onChange={() => setDeliverySpeed('priority')}
                      className="text-amber-500 focus:ring-amber-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          Beast Priority Air
                        </span>
                        <span className="text-xs font-extrabold text-slate-900">₹49</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Guaranteed next day delivery</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 3: Payment Options */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="w-7 h-7 rounded-full bg-amber-500 text-black font-extrabold text-sm flex items-center justify-center">
                    3
                  </span>
                  <h2 className="font-bold text-lg text-slate-900">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'upi' ? 'border-amber-500 bg-amber-50/30' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="text-amber-500 focus:ring-amber-400"
                        />
                        <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-900">Instant UPI (GPay, PhonePe, Paytm, QR)</span>
                          <p className="text-xs text-gray-500">Zero transaction fees • Instant verification</p>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Fastest</span>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-4 pt-4 border-t border-amber-200/60 pl-8 flex flex-col sm:flex-row gap-3 items-center">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="w-full sm:w-64 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                        <span className="text-xs text-emerald-700 font-semibold">✓ Verified UPI Address</span>
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery Option */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod' ? 'border-amber-500 bg-amber-50/30' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-amber-500 focus:ring-amber-400"
                      />
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900">Cash on Delivery (COD)</span>
                        <p className="text-xs text-gray-500">Pay cash or UPI to delivery agent at your doorstep</p>
                      </div>
                    </div>
                  </div>

                  {/* Credit / Debit Card Option */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-amber-500 bg-amber-50/30' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-amber-500 focus:ring-amber-400"
                      />
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900">Credit / Debit Cards (Visa, Mastercard, RuPay)</span>
                        <p className="text-xs text-gray-500">All major Indian banks supported with OTP</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Order Summary & Place Order (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-28 space-y-5">
                <h3 className="font-display font-bold text-lg text-slate-900 pb-3 border-b border-gray-100">
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h3>

                {/* Items Preview */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-gray-100">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 pt-2 first:pt-0">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded-lg border border-gray-100 p-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-gray-500 truncate">{item.variant}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-slate-900">Qty: {item.quantity}</span>
                          <span className="text-xs font-extrabold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span className="font-semibold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Beast Coupon Savings:</span>
                      <span className="font-bold">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span className="font-semibold text-emerald-700">
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>GST (Included):</span>
                    <span>18% Inclusive</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                    <span className="font-display font-bold text-base text-slate-900">Total Payable:</span>
                    <span className="font-display font-black text-2xl text-slate-950">
                      ₹{finalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-60 cursor-pointer active:scale-98"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Order...</span>
                    </div>
                  ) : (
                    <>
                      <span>Place Your Order</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-around text-center text-[10px] text-gray-500">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>100% Authentic</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Fast Express</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span>Safe Payment</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
