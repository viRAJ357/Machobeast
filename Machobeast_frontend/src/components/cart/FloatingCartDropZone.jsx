import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Check,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Truck
} from 'lucide-react';
import { addToCart, removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import { clearDraggingProduct } from '../../redux/slices/productSlice';

export const FloatingCartDropZone = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const { isDraggingProduct } = useSelector((state) => state.products);

  const [isOpen, setIsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [justAddedProduct, setJustAddedProduct] = useState(null);

  // Sound chime using Web Audio API on drop
  const playDropSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {}
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dispatch(clearDraggingProduct());

    let product = null;

    // 1. Try global window item (100% reliable)
    if (window.__MACHOBEAST_DRAGGED_ITEM__) {
      product = window.__MACHOBEAST_DRAGGED_ITEM__;
    }

    // 2. Try Redux state
    if (!product && isDraggingProduct) {
      product = isDraggingProduct;
    }

    // 3. Try dataTransfer
    if (!product) {
      try {
        const dataStr = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
        if (dataStr) {
          product = JSON.parse(dataStr);
        }
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

      playDropSound();
      setJustAddedProduct(product.name);
      setIsOpen(true);
      setTimeout(() => setJustAddedProduct(null), 3500);
      window.__MACHOBEAST_DRAGGED_ITEM__ = null;
    }
  };

  return (
    <>
      {/* Prominent Fullscreen Drop Banner when any product is being dragged */}
      {isDraggingProduct && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`fixed inset-x-0 bottom-0 z-50 p-6 flex items-center justify-center transition-all cursor-copy ${
            isDragOver
              ? 'bg-amber-400/95 text-slate-950 scale-102 shadow-2xl border-t-4 border-amber-600'
              : 'bg-slate-950/95 text-amber-400 border-t-4 border-dashed border-amber-400 animate-pulse'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
              <ShoppingCart className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <p className="font-black text-lg sm:text-xl tracking-tight uppercase">
                {isDragOver ? '🎉 RELEASE TO DROP IN MACHOBEAST CART!' : '📥 DROP ITEM ANYWHERE HERE TO ADD TO CART'}
              </p>
              <p className="text-xs text-slate-300 font-semibold">
                Dragging: {isDraggingProduct.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Widget Bottom-Right */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
        {/* Toast Alert when item dropped */}
        {justAddedProduct && (
          <div className="mb-3 bg-emerald-950 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-bounce">
            <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-black font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Added to MachoBeast Cart via Drag & Drop!
              </p>
              <p className="text-xs text-white line-clamp-1 max-w-[240px] font-medium">
                {justAddedProduct}
              </p>
            </div>
          </div>
        )}

        {/* Expanded Quick Cart Drawer */}
        {isOpen && (
          <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-amber-300 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                    MachoBeast Quick Cart
                    <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                    </span>
                  </h4>
                  <p className="text-[10px] text-amber-200/80">Drop items here anytime to add</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-md cursor-pointer"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="max-h-64 overflow-y-auto p-3 space-y-2.5 divide-y divide-gray-100">
              {items.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <ShoppingCart className="w-10 h-10 mx-auto text-gray-300 mb-2 stroke-1" />
                  <p className="text-xs font-semibold">Your MachoBeast cart is empty</p>
                  <p className="text-[11px] text-amber-600 font-medium mt-1">
                    💡 Drag any product card and drop here!
                  </p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={`${item.id}-${item.variant}-${idx}`} className="pt-2 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      draggable="false"
                      className="w-12 h-12 rounded-lg object-contain bg-gray-50 p-1 border border-gray-100 shrink-0 pointer-events-none"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h5>
                      <p className="text-[10px] text-gray-500 line-clamp-1">{item.variant}</p>
                      <span className="text-xs font-extrabold text-amber-700">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            dispatch(updateQuantity({ id: item.id, variant: item.variant, quantity: item.quantity - 1 }));
                          } else {
                            dispatch(removeFromCart({ id: item.id, variant: item.variant }));
                          }
                        }}
                        className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-sm text-gray-700 hover:text-red-600 cursor-pointer"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3" />}
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(updateQuantity({ id: item.id, variant: item.variant, quantity: item.quantity + 1 }))
                        }
                        className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-sm text-gray-700 hover:text-black cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Subtotal ({totalQuantity} items):</span>
                  <span className="font-black text-sm text-gray-900">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Eligible for FREE MachoPrime Delivery</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/cart"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2 px-3 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 rounded-lg text-xs font-extrabold transition-all shadow-md flex items-center justify-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Proceed to Buy
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Drag & Drop Zone Pill */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => setIsOpen(!isOpen)}
          className={`cursor-pointer transition-all duration-300 rounded-full flex items-center gap-3 px-4 py-3 shadow-2xl select-none ${
            isDragOver
              ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 ring-offset-2 scale-110 shadow-amber-500/50'
              : isDraggingProduct
              ? 'bg-slate-950 text-amber-400 border-2 border-dashed border-amber-400 animate-pulse scale-105'
              : 'bg-slate-950 hover:bg-black text-white border border-slate-800 hover:border-amber-500/50'
          }`}
        >
          {/* Animated Cart Icon */}
          <div className="relative">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-colors ${
                isDragOver ? 'bg-black text-amber-400' : 'bg-amber-400 text-black shadow-md'
              }`}
            >
              <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
            </div>
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow">
                {totalQuantity}
              </span>
            )}
          </div>

          {/* Text Prompt */}
          <div className="flex flex-col text-left pr-1">
            {isDragOver ? (
              <span className="font-black text-sm tracking-tight text-black flex items-center gap-1">
                🎉 RELEASE TO ADD TO CART!
              </span>
            ) : isDraggingProduct ? (
              <div>
                <span className="font-extrabold text-xs text-amber-400 tracking-wide flex items-center gap-1">
                  📥 DROP ITEM HERE
                </span>
                <span className="text-[10px] text-slate-300 block">MachoBeast Drag & Drop Ready</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white">Macho Cart</span>
                  <span className="text-xs font-black text-amber-400">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 block font-medium">
                  ✋ Drag products here to add
                </span>
              </div>
            )}
          </div>

          <div className="text-gray-400 hover:text-white pl-1">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingCartDropZone;
