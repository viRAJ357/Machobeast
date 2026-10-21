import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Star,
  Check,
  Zap,
  GripHorizontal,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { addToCart } from '../../redux/slices/cartSlice';
import { setDraggingProduct, clearDraggingProduct } from '../../redux/slices/productSlice';

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || {
      weight: '1 kg (2.2 lb)',
      flavor: 'Rich Chocolate',
      price: product?.price || 1349,
      mrp: product?.mrp || 1799
    }
  );
  const [added, setAdded] = useState(false);
  const [isThisDragging, setIsThisDragging] = useState(false);

  const discountPercent = Math.round(
    ((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100
  );

  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
    navigate('/checkout');
  };

  // 100% Reliable HTML5 Drag Handlers
  const handleDragStart = (e) => {
    setIsThisDragging(true);
    const itemData = {
      ...product,
      variants: [selectedVariant]
    };

    // Global fallback for total reliability across all browsers
    window.__MACHOBEAST_DRAGGED_ITEM__ = itemData;

    try {
      e.dataTransfer.setData('application/json', JSON.stringify(itemData));
      e.dataTransfer.setData('text/plain', JSON.stringify(itemData));
      e.dataTransfer.effectAllowed = 'copy';
    } catch (err) {}

    dispatch(setDraggingProduct(itemData));
  };

  const handleDragEnd = () => {
    setIsThisDragging(false);
    dispatch(clearDraggingProduct());
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-150 flex flex-col justify-between p-3.5 relative select-none cursor-grab active:cursor-grabbing ${
        isThisDragging ? 'opacity-40 scale-95 border-amber-500 shadow-2xl' : 'hover:border-amber-400'
      }`}
    >
      {/* Top Badges & Drag Grip */}
      <div className="flex items-center justify-between gap-1 mb-1.5 min-h-[24px]">
        {product.isBestseller ? (
          <span className="bg-[#e67a00] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-tight">
            #1 Best Seller
          </span>
        ) : (
          <span className="bg-[#1e293b] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-tight flex items-center gap-1">
            <span className="text-amber-400 font-extrabold">Macho's</span> Choice
          </span>
        )}

        {/* Drag to Cart Grip Handle */}
        <div
          title="Drag and drop this product into Cart!"
          className="flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded border border-amber-300 transition-colors shadow-xs"
        >
          <GripHorizontal className="w-3.5 h-3.5 text-amber-700" />
          <span>Drag to Cart</span>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square w-full bg-[#f8fafc] rounded-sm p-3 flex items-center justify-center overflow-hidden mb-2.5">
        <Link
          to={`/product/${product.id || product._id}`}
          draggable="false"
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src={product.image}
            alt={product.name}
            draggable="false"
            loading="lazy"
            className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-200 pointer-events-none"
          />
        </Link>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Brand */}
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            {product.brand}
          </span>

          {/* Product Title */}
          <Link to={`/product/${product.id || product._id}`} draggable="false">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 min-h-[36px] hover:text-[#c7511f] leading-snug cursor-pointer transition-colors mt-0.5">
              {product.name}
            </h3>
          </Link>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-[#de7921]">
              <Star className="w-3.5 h-3.5 fill-[#de7921]" />
              <Star className="w-3.5 h-3.5 fill-[#de7921]" />
              <Star className="w-3.5 h-3.5 fill-[#de7921]" />
              <Star className="w-3.5 h-3.5 fill-[#de7921]" />
              <Star className="w-3.5 h-3.5 fill-[#de7921]" />
            </div>
            <span className="text-[11px] text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer font-medium">
              {(product.numReviews || 1840).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-gray-400">| 100+ bought in past month</span>
          </div>

          {/* Deal Tag */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="bg-[#cc0c39] text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs">
              Limited time deal
            </span>
          </div>

          {/* Price Layout */}
          <div className="mt-1 flex items-baseline gap-2">
            {discountPercent > 0 && (
              <span className="text-base sm:text-lg font-light text-[#cc0c39]">
                -{discountPercent}%
              </span>
            )}
            <div className="flex items-start">
              <span className="text-xs font-normal text-gray-900 pt-0.5">₹</span>
              <span className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">
                {selectedVariant.price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-gray-500">
            M.R.P.: <span className="line-through">₹{selectedVariant.mrp.toLocaleString('en-IN')}</span>
          </div>

          {/* MachoPrime Delivery Line */}
          <div className="mt-2 text-xs text-gray-900 leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-amber-600 font-black italic text-xs">⚡ MachoPrime</span>
              <span className="font-bold">Tomorrow, 22 Oct</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5">
              FREE Express Delivery over ₹499 by MachoBeast
            </p>
          </div>

          {/* Variant Selector Dropdown if variants exist */}
          {product.variants && product.variants.length > 1 && (
            <div className="mt-2 relative">
              <select
                value={selectedVariant.weight}
                onChange={(e) => {
                  const found = product.variants.find((v) => v.weight === e.target.value);
                  if (found) setSelectedVariant(found);
                }}
                className="w-full bg-[#f0f2f2] hover:bg-[#e3e6e6] border border-[#d5d9d9] text-gray-900 text-[11px] font-medium rounded-md py-1 px-2 pr-6 appearance-none focus:outline-none cursor-pointer"
              >
                {product.variants.map((v, i) => (
                  <option key={i} value={v.weight}>
                    {v.weight} - {v.flavor} (₹{v.price})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-600 absolute right-2 top-2 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-2 space-y-1.5">
          <button
            onClick={handleAddToCart}
            className={`w-full py-1.5 px-3 rounded-full text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1 border cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 border-[#fcd200]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" /> Added to Cart
              </>
            ) : (
              'Add to Cart'
            )}
          </button>

          <button
            onClick={handleBuyNow}
            className="w-full py-1.5 px-3 rounded-full text-xs font-semibold bg-[#ffa41c] hover:bg-[#fa8900] text-slate-900 border border-[#ff8f00] shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
