import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Download,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { cancelOrder } from '../redux/slices/orderSlice';
import { addToCart } from '../redux/slices/cartSlice';

export const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'transit', 'delivered'
  const [reorderedId, setReorderedId] = useState(null);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'transit') return order.status === 'Shipped' || order.status === 'Confirmed';
    if (activeTab === 'delivered') return order.status === 'Delivered';
    return true;
  });

  const handleBuyAgain = (item) => {
    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        variant: item.variant,
        price: item.price,
        mrp: Math.round(item.price * 1.3),
        image: item.image,
        isVeg: true
      })
    );
    setReorderedId(item.id);
    setTimeout(() => setReorderedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-slate-900 font-bold">Your Orders</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Page Title & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 tracking-tight">
              Your Orders & Trackings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Track shipments, review past supplements, or reorder with 1-click
            </p>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-gray-600 hover:text-black'
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('transit')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'transit' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-gray-600 hover:text-black'
              }`}
            >
              In Transit
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'delivered' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-gray-600 hover:text-black'
              }`}
            >
              Delivered
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">No Orders Found</h3>
            <p className="text-xs text-gray-500 mb-6">You haven't placed any orders in this section yet.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-black hover:bg-slate-900 text-amber-400 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isCancelled = order.status === 'Cancelled';
              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order Card Header */}
                  <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-6 text-gray-600">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-gray-400">Order Placed</span>
                        <span className="font-semibold text-slate-900">{order.date}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-gray-400">Total</span>
                        <span className="font-extrabold text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-gray-400">Ship To</span>
                        <span className="font-semibold text-slate-900">{order.shippingAddress?.fullName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-800">#{order.orderId}</span>
                      <button
                        onClick={() => alert(`Downloading Invoice for order ${order.orderId}`)}
                        className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" /> Invoice
                      </button>
                    </div>
                  </div>

                  {/* Order Body & Status */}
                  <div className="p-6">
                    {/* Status Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-100 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${isCancelled ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                          <h3 className="font-bold text-base text-slate-900">
                            {isCancelled ? 'Order Cancelled' : `Estimated Delivery: ${order.estimatedDelivery}`}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Paid via {order.paymentMethod} • Shipped with MachoBeast Express Logistics
                        </p>
                      </div>

                      {!isCancelled && order.status !== 'Delivered' && (
                        <button
                          onClick={() => dispatch(cancelOrder(order.orderId))}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors w-fit"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                    {/* Tracking Progress Bar */}
                    {!isCancelled && (
                      <div className="mb-8 px-2 sm:px-6">
                        <div className="relative">
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                            <div
                              style={{ width: `${(order.trackingStep / 3) * 100}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500"
                            />
                          </div>
                          <div className="flex justify-between text-[11px] font-bold text-gray-500">
                            <span className={order.trackingStep >= 0 ? 'text-emerald-700 font-extrabold' : ''}>Ordered</span>
                            <span className={order.trackingStep >= 1 ? 'text-emerald-700 font-extrabold' : ''}>Packed</span>
                            <span className={order.trackingStep >= 2 ? 'text-emerald-700 font-extrabold' : ''}>Shipped</span>
                            <span className={order.trackingStep >= 3 ? 'text-emerald-700 font-extrabold' : ''}>Delivered</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Items List */}
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 first:pt-0 border-t sm:border-t-0 border-gray-100">
                          <div className="flex gap-4 items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-contain rounded-xl border border-gray-200 p-1 shrink-0"
                            />
                            <div>
                              <Link
                                to={`/product/${item.id}`}
                                className="text-sm font-bold text-gray-900 hover:text-amber-600 transition-colors line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                              <p className="text-xs font-extrabold text-slate-900 mt-1">
                                ₹{item.price.toLocaleString('en-IN')} <span className="font-normal text-gray-400">× {item.quantity}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleBuyAgain(item)}
                              className="flex-1 sm:flex-initial bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              {reorderedId === item.id ? 'Added to Cart!' : 'Buy it Again'}
                            </button>
                            <Link
                              to={`/product/${item.id}`}
                              className="flex-1 sm:flex-initial bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors"
                            >
                              View Item
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default OrdersPage;
