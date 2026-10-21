import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Star,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Minus,
  Plus,
  Heart,
  Share2,
  Check,
  Zap,
  Tag,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  Info,
  ChevronDown,
  Lock,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { getProductById, getBrandName, getCategoryName } from '../data/products.js';
import { addToCart } from '../redux/slices/cartSlice';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products.items);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Find product by id from dynamic products first
  const product = useMemo(() => {
    return allProducts.find((p) => p.id === id || p._id === id) || getProductById(id);
  }, [id, allProducts]);

  // Active variant state
  const variants = useMemo(() => {
    if (product?.variants && product.variants.length > 0) {
      return product.variants;
    }
    return [
      {
        weight: 'Standard',
        flavor: 'Regular',
        price: product?.price || 1499,
        mrp: product?.mrp || 1999,
        unitPrice: '₹150 / 100 g'
      }
    ];
  }, [product]);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = variants[selectedVariantIndex] || variants[0];

  // Reset selected variant on product change
  useEffect(() => {
    setSelectedVariantIndex(0);
    setQuantity(1);
    setSelectedImageIndex(0);
  }, [id]);

  // Quantity state
  const [quantity, setQuantity] = useState(1);

  // Image zoom state
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  // UI interaction states
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Compute discount percentage
  const discountPercent = useMemo(() => {
    if (!selectedVariant?.mrp || !selectedVariant?.price) return 0;
    return Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100);
  }, [selectedVariant]);

  const savingsAmount = (selectedVariant?.mrp || 0) - (selectedVariant?.price || 0);

  // Gallery images (simulate product angles)
  const productImages = useMemo(() => {
    if (!product?.image) return [];
    return [
      product.image,
      // Variant/supplement preview variations with high quality supplement angles
      'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600',
      'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600',
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600'
    ];
  }, [product]);

  // Related products from same category (excluding current)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const sameCategory = allProducts.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
    if (sameCategory.length >= 4) {
      return sameCategory.slice(0, 5);
    }
    // If not enough in same category, supplement with top products
    const others = allProducts.filter(
      (p) => p.id !== product.id && p.category !== product.category
    );
    return [...sameCategory, ...others].slice(0, 5);
  }, [product]);

  // Handlers
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > 10) return 10;
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        variant: `${selectedVariant.weight}, ${selectedVariant.flavor}`,
        price: selectedVariant.price,
        mrp: selectedVariant.mrp,
        image: product.image,
        quantity: quantity,
        isVeg: product.isVeg !== false
      })
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  // If product not found
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Product Not Found</h1>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          The supplement or product you are looking for does not exist or may have been discontinued.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-black hover:bg-slate-900 text-amber-400 font-bold px-6 py-3 rounded-lg shadow-md transition-all text-sm uppercase tracking-wider"
        >
          Back to Homepage
        </Link>
      </div>
    );
  }

  const brandName = getBrandName(product.brand);
  const categoryName = getCategoryName(product.category);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 sm:pb-16">
      {/* Toast Notifications */}
      {showShareToast && (
        <div className="fixed top-20 right-4 z-50 bg-black text-amber-400 px-4 py-2.5 rounded-lg shadow-xl border border-amber-500/30 flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          Product link copied to clipboard!
        </div>
      )}

      {addedToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-950 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 text-sm font-bold animate-bounce">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <span>Added {quantity} item(s) to Cart!</span>
          <Link to="/cart" className="text-amber-400 underline ml-2 hover:text-amber-300">
            View Cart
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* MachoBeast Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap py-1">
          <Link to="/" className="hover:text-amber-600 font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <Link
            to={`/shop?category=${product.category}`}
            className="hover:text-amber-600 font-medium transition-colors"
          >
            {categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-800 font-semibold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Main Product Layout: 2 Columns (Image + Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200/80 shadow-sm">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Large Product Image with Zoom-on-Hover       */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnail Gallery (Left on SM screens, below on XS) */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {productImages.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  onMouseEnter={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 p-1.5 bg-white transition-all overflow-hidden flex items-center justify-center shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Main Interactive Zoomable Image Box */}
            <div className="flex-1 relative flex flex-col items-center">
              <div
                className="relative w-full aspect-square max-h-[480px] bg-white rounded-2xl border border-gray-200/80 overflow-hidden flex items-center justify-center p-6 cursor-crosshair group shadow-inner"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                {/* Product Badges on Image */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                  {discountPercent > 0 && (
                    <span className="bg-emerald-600 text-white font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                      {discountPercent}% OFF
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="bg-purple-700 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                      #1 Bestseller
                    </span>
                  )}
                </div>

                {/* Wishlist & Share Action Buttons */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border flex items-center justify-center shadow-md transition-all ${
                      isWishlisted
                        ? 'border-red-300 text-red-500 bg-red-50'
                        : 'border-gray-200 text-gray-500 hover:text-red-500 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    title="Share Product"
                    className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-500 hover:text-black hover:bg-white flex items-center justify-center shadow-md transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Image with Zoom Transform */}
                <img
                  src={productImages[selectedImageIndex] || product.image}
                  alt={product.name}
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                    transition: isZoomed ? 'none' : 'transform 0.25s ease-out'
                  }}
                  className="max-h-full max-w-full object-contain pointer-events-none select-none"
                />

                {/* Zoom Helper Indicator */}
                {!isZoomed && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[11px] font-medium px-3 py-1 rounded-full pointer-events-none backdrop-blur-xs flex items-center gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity">
                    <span>Roll over image to zoom in</span>
                  </div>
                )}
              </div>

              {/* Lab Tested Authenticity Guarantee Note below image */}
              <div className="mt-4 w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">100% Original Brand Guarantee</span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium">Batch Tested & Certified</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Product Details & Purchase Actions         */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Brand Link + Veg/Non-Veg Tag */}
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <Link
                  to={`/shop?brand=${product.brand}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1 rounded-md transition-colors"
                >
                  <span>Visit the {brandName} Store</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>

                {/* Veg / Non-Veg Indicator */}
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md text-xs font-semibold text-gray-700">
                  {product.isVeg !== false ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center p-0.5 rounded-xs">
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                      </span>
                      <span className="text-emerald-700">100% Vegetarian</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-red-600 flex items-center justify-center p-0.5 rounded-xs">
                        <span className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[7px] border-b-red-600"></span>
                      </span>
                      <span className="text-red-700">Non-Veg</span>
                    </>
                  )}
                </div>
              </div>

              {/* Product Name (Large Heading) */}
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating Stars + Review Count */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 flex-wrap">
                <div className="flex items-center gap-1.5 bg-amber-500 text-black px-2.5 py-0.5 rounded-md text-xs font-extrabold shadow-xs">
                  <span>{product.rating || '4.6'}</span>
                  <Star className="w-3.5 h-3.5 fill-black text-black" />
                </div>

                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 4.5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                  {(product.numReviews || 1240).toLocaleString('en-IN')} ratings
                </span>

                <span className="text-gray-300">|</span>

                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> In Stock
                </span>
              </div>

              {/* Price Section */}
              <div className="py-4 border-b border-gray-200">
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  {discountPercent > 0 && (
                    <span className="text-xl sm:text-2xl font-black text-red-600">
                      -{discountPercent}%
                    </span>
                  )}
                  <span className="font-display font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
                    ₹{selectedVariant.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    M.R.P.: <span className="line-through">₹{selectedVariant.mrp.toLocaleString('en-IN')}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                  <span className="font-semibold text-gray-800">
                    Inclusive of all taxes
                  </span>
                  {selectedVariant.unitPrice && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="font-medium text-gray-500">
                        ({selectedVariant.unitPrice})
                      </span>
                    </>
                  )}
                  {savingsAmount > 0 && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="font-bold text-emerald-700">
                        You Save: ₹{savingsAmount.toLocaleString('en-IN')} ({discountPercent}%)
                      </span>
                    </>
                  )}
                </div>

                {/* Coupon Callout Promo Box */}
                <div className="mt-3 bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-amber-900 font-medium">
                      Use code <strong className="font-black text-slate-900 bg-amber-200/60 px-1.5 py-0.5 rounded">MACHOBEAST5</strong> for additional 5% off!
                    </span>
                  </div>
                </div>
              </div>

              {/* Variant Selector: Dropdown & Quick Selection */}
              <div className="py-4 border-b border-gray-200">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Size & Flavor Variant
                </label>

                {/* Dropdown for weight/flavor combinations */}
                <div className="relative mb-3">
                  <select
                    value={selectedVariantIndex}
                    onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
                    className="w-full bg-white border-2 border-amber-400/80 text-gray-900 font-bold text-sm rounded-xl py-3 px-3.5 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-sm hover:border-amber-500 transition-all"
                  >
                    {variants.map((v, idx) => (
                      <option key={idx} value={idx}>
                        {v.weight} — {v.flavor} (₹{v.price.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-700 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>

                {/* Quick Interactive Variant Pills */}
                {variants.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v, idx) => {
                      const isSelected = selectedVariantIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedVariantIndex(idx)}
                          className={`text-xs px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-400/40 shadow-sm'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span>{v.weight}</span>
                          <span className="text-gray-400">•</span>
                          <span className="truncate max-w-[120px]">{v.flavor}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quantity Selector + Actions */}
              <div className="py-5 border-b border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Quantity:
                  </span>
                  <div className="inline-flex items-center border border-gray-300 rounded-lg bg-gray-50 overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                      title="Decrease Quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-sm text-gray-900 select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                      className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                      title="Increase Quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    Max 10 units per order
                  </span>
                </div>

                {/* Big Buttons: Add to Cart (Amber/Gold) & Buy Now (Black) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
                  >
                    <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full bg-black hover:bg-slate-900 text-amber-400 font-black text-sm uppercase tracking-wider py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
                  >
                    <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

              {/* Key Product Description */}
              <div className="py-4">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  About this item
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  {product.description ||
                    'Engineered with premium sports nutrition ingredients for rapid post-workout recovery, lean muscle growth, and maximum stamina. Fortified with essential enzymes for smooth digestion and superior nutrient bio-availability.'}
                </p>

                {/* Bullet highlights */}
                <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                  <li>Formulated with ultra-filtered raw ingredients sourced directly from certified importers.</li>
                  <li>Zero added sugars, banned substance tested & 100% compliant with FSSAI standards.</li>
                  <li>Smooth mixability with water or milk with zero clumps or digestive discomfort.</li>
                </ul>
              </div>
            </div>

            {/* Trust Badges (Authentic, Free Shipping, Easy Returns, Secure Payment) */}
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5">
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-bold text-slate-900">100% Authentic</span>
                <span className="text-[10px] text-gray-500">Direct Brand Sourcing</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5">
                  <Truck className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-bold text-slate-900">Free Shipping</span>
                <span className="text-[10px] text-gray-500">On orders over ₹499</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-1.5">
                  <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-bold text-slate-900">Easy Returns</span>
                <span className="text-[10px] text-gray-500">7-Day Replacement</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SPECIFICATIONS & REVIEWS SECTION TABS                     */}
        {/* ======================================================== */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3.5 px-6 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-amber-500 text-amber-900 bg-amber-50/40'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Product Overview
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-3.5 px-6 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'specs'
                  ? 'border-amber-500 text-amber-900 bg-amber-50/40'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3.5 px-6 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'reviews'
                  ? 'border-amber-500 text-amber-900 bg-amber-50/40'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Ratings & Reviews ({(product.numReviews || 1240).toLocaleString()})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h4 className="font-bold text-base text-slate-900">Product Information</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {product.name} is formulated for athletes, gym-goers, and fitness enthusiasts who demand peak performance. Every batch is rigorously certified for label accuracy and free from prohibited substances.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-200">
                    <span className="block text-xs font-bold text-gray-500 uppercase">Brand</span>
                    <span className="font-extrabold text-slate-900 text-sm">{brandName}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-200">
                    <span className="block text-xs font-bold text-gray-500 uppercase">Category</span>
                    <span className="font-extrabold text-slate-900 text-sm">{categoryName}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-200">
                    <span className="block text-xs font-bold text-gray-500 uppercase">Diet Type</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {product.isVeg !== false ? 'Vegetarian' : 'Non-Vegetarian'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                  <tbody>
                    <tr className="border-b bg-gray-50">
                      <th className="py-2.5 px-4 font-semibold text-gray-600 w-1/3">Item Weight</th>
                      <td className="py-2.5 px-4 text-gray-900">{selectedVariant.weight}</td>
                    </tr>
                    <tr className="border-b bg-white">
                      <th className="py-2.5 px-4 font-semibold text-gray-600">Flavor</th>
                      <td className="py-2.5 px-4 text-gray-900">{selectedVariant.flavor}</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <th className="py-2.5 px-4 font-semibold text-gray-600">Country of Origin</th>
                      <td className="py-2.5 px-4 text-gray-900">India</td>
                    </tr>
                    <tr className="border-b bg-white">
                      <th className="py-2.5 px-4 font-semibold text-gray-600">Form</th>
                      <td className="py-2.5 px-4 text-gray-900">Powder</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="py-2.5 px-4 font-semibold text-gray-600">FSSAI Certified</th>
                      <td className="py-2.5 px-4 text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4 stroke-[3]" /> Yes (100% Genuine)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-4 bg-slate-50 p-6 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">Customer Feedback</h4>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-black text-slate-950">{product.rating || '4.6'}</span>
                    <span className="text-sm font-semibold text-gray-500">out of 5 stars</span>
                  </div>
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Based on {(product.numReviews || 1240).toLocaleString()} verified customer ratings.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-12 font-medium text-gray-600">5 star</span>
                      <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[78%]"></div>
                      </div>
                      <span className="w-8 text-right font-semibold text-gray-700">78%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 font-medium text-gray-600">4 star</span>
                      <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[14%]"></div>
                      </div>
                      <span className="w-8 text-right font-semibold text-gray-700">14%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 font-medium text-gray-600">3 star</span>
                      <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[5%]"></div>
                      </div>
                      <span className="w-8 text-right font-semibold text-gray-700">5%</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900">Rahul Sharma</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Verified Purchase
                      </span>
                    </div>
                    <div className="flex text-amber-400 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <h5 className="font-semibold text-xs text-slate-900 mb-1">
                      Outstanding quality & rich taste!
                    </h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Mixes completely without a shaker ball. No bloating or aftertaste. Fast delivery from MachoBeast with authentic scratch code. Highly recommend!
                    </p>
                  </div>

                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900">Ankit Verma</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Verified Purchase
                      </span>
                    </div>
                    <div className="flex text-amber-400 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <h5 className="font-semibold text-xs text-slate-900 mb-1">
                      Great pump and fast recovery
                    </h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      I have been using this brand for 6 months. Genuine product delivered in 2 days. The flavor is spot-on.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RELATED PRODUCTS SECTION                                 */}
        {/* ======================================================== */}
        <section className="mt-12 sm:mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
                <Sparkles className="w-4 h-4" />
                <span>Frequently Bought Together</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
                Related Products in {categoryName}
              </h2>
            </div>
            <Link
              to={`/shop?category=${product.category}`}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      </div>

      {/* ======================================================== */}
      {/* MOBILE STICKY BOTTOM BAR */}
      {/* ======================================================== */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-500 font-medium">Total Price:</span>
          <span className="font-black text-lg text-slate-950 leading-none">
            ₹{(selectedVariant.price * quantity).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="bg-amber-400 active:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-black active:bg-slate-900 text-amber-400 font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
