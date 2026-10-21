import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
  ArrowRight,
  Sparkles,
  Flame,
  Truck,
  Check,
  Star
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';

const heroBanners = [
  {
    title: 'GREAT MACHO FESTIVAL',
    subtitle: 'MEGA DEALS ON TOP BRANDS',
    discount: 'UP TO 60% OFF',
    tag: 'Lowest Prices of the Season',
    bgGradient: 'from-[#0f172a] via-[#1e293b] to-[#0f172a]',
    textColor: 'text-[#febd69]',
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800',
    link: '/shop?sort=bestsellers'
  },
  {
    title: 'PRIME CREATINE FEST',
    subtitle: '100% PURE MICRONIZED CREATINE',
    discount: 'FLAT 40% OFF',
    tag: 'Wellcore, Divine Nutrition, Maxures',
    bgGradient: 'from-[#172554] via-[#1e3a8a] to-[#172554]',
    textColor: 'text-sky-300',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800',
    link: '/shop?category=creatine'
  },
  {
    title: 'HEALTHY SPREADS & OATS',
    subtitle: 'ALPINO & WELLX GOURMET',
    discount: 'BUY 1 GET 1 AT 50%',
    tag: 'High Protein Peanut Butter',
    bgGradient: 'from-[#2e1065] via-[#3b0764] to-[#2e1065]',
    textColor: 'text-amber-300',
    image: 'https://images.unsplash.com/photo-1612187209234-a73a1210e68c?w=800',
    link: '/shop?category=peanut-butter'
  }
];

export const HomePage = () => {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const allProducts = useSelector((state) => state.products.items);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const bestsellers = useMemo(() => allProducts.filter((p) => p.isBestseller).slice(0, 10), [allProducts]);
  const proteinProducts = useMemo(
    () => allProducts.filter((p) => p.category === 'whey-protein' || p.category === 'whey-isolate').slice(0, 8),
    [allProducts]
  );
  const creatineProducts = useMemo(
    () => allProducts.filter((p) => p.category === 'creatine').slice(0, 8),
    [allProducts]
  );
  const massGainerProducts = useMemo(
    () => allProducts.filter((p) => p.category === 'mass-gainer').slice(0, 8),
    [allProducts]
  );
  const peanutButterProducts = useMemo(
    () => allProducts.filter((p) => p.category === 'peanut-butter' || p.category === 'protein-foods').slice(0, 8),
    [allProducts]
  );

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  const activeBanner = heroBanners[currentBanner];

  return (
    <div className="bg-[#eaeded] min-h-screen pb-16 select-none">
      
      {/* 1. MachoBeast Hero Carousel with Gradient Fade */}
      <div className="relative w-full max-w-[1500px] mx-auto overflow-hidden">
        <div
          className={`relative h-[280px] sm:h-[380px] md:h-[460px] bg-gradient-to-r ${activeBanner.bgGradient} flex items-center justify-between px-6 sm:px-14 text-white transition-all duration-700`}
        >
          {/* Hero Text */}
          <div className="max-w-xl z-10 space-y-3">
            <span className="inline-block bg-[#febd69] text-slate-900 font-extrabold text-[11px] px-3 py-1 rounded-xs uppercase tracking-wider shadow-sm">
              {activeBanner.tag}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white drop-shadow-md">
              {activeBanner.title}
            </h1>
            <p className={`text-base sm:text-xl font-bold ${activeBanner.textColor}`}>
              {activeBanner.subtitle} • {activeBanner.discount}
            </p>
            <div className="pt-2">
              <Link
                to={activeBanner.link}
                className="inline-flex items-center gap-2 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Shop the Sale</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Hero Product Graphic */}
          <div className="hidden sm:flex items-center justify-center max-w-sm max-h-[360px] z-10">
            <img
              src={activeBanner.image}
              alt={activeBanner.title}
              draggable="false"
              className="max-h-[320px] object-contain drop-shadow-2xl rounded-xl pointer-events-none"
            />
          </div>

          {/* Carousel Arrows */}
          <button
            onClick={prevBanner}
            className="absolute left-2 top-1/3 -translate-y-1/2 w-10 h-16 bg-white/20 hover:bg-white/40 text-white rounded-r flex items-center justify-center transition-all z-20 cursor-pointer"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-2 top-1/3 -translate-y-1/2 w-10 h-16 bg-white/20 hover:bg-white/40 text-white rounded-l flex items-center justify-center transition-all z-20 cursor-pointer"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Gradient Mask that fades into the 4-card grid */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#eaeded] via-[#eaeded]/70 to-transparent pointer-events-none z-10"></div>
        </div>

        {/* 2. MachoBeast 4-Quadrant Card Grid Overlapping Hero */}
        <div className="relative -mt-20 sm:-mt-36 z-20 px-3 sm:px-4 max-w-[1500px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: 4-Quadrant Whey & Protein */}
          <div className="bg-white p-4 rounded-xs shadow-md border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-3">
                Up to 55% off | Whey Protein & Isolates
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {proteinProducts.slice(0, 4).map((p, i) => (
                  <Link
                    key={i}
                    to={`/product/${p.id}`}
                    className="group flex flex-col text-left"
                  >
                    <div className="aspect-square bg-[#f7f7f7] rounded-sm p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] text-gray-800 line-clamp-1 mt-1 font-medium group-hover:text-[#c7511f]">
                      {p.name}
                    </span>
                    <span className="text-[10px] font-bold text-[#cc0c39]">
                      Up to 50% off
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/shop?category=whey-protein"
              className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline mt-4 block"
            >
              See all protein deals
            </Link>
          </div>

          {/* Card 2: Featured Hero Creatine Deal */}
          <div className="bg-white p-4 rounded-xs shadow-md border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                Today's Deal | Creatine Power Fest
              </h3>
              {creatineProducts[0] && (
                <Link to={`/product/${creatineProducts[0].id}`} className="group block">
                  <div className="aspect-[4/3] bg-[#f7f7f7] rounded-sm p-4 flex items-center justify-center overflow-hidden mb-3">
                    <img
                      src={creatineProducts[0].image}
                      alt={creatineProducts[0].name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#cc0c39] text-white text-[11px] font-black px-2 py-0.5 rounded-xs">
                      Up to 45% off
                    </span>
                    <span className="text-xs font-bold text-[#cc0c39]">Limited time deal</span>
                  </div>
                  <p className="text-xs font-medium text-gray-900 line-clamp-2 mt-1.5 group-hover:text-[#c7511f]">
                    {creatineProducts[0].name}
                  </p>
                </Link>
              )}
            </div>
            <Link
              to="/shop?category=creatine"
              className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline mt-4 block"
            >
              Explore all creatine brands
            </Link>
          </div>

          {/* Card 3: 4-Quadrant Peanut Butter & Superfoods */}
          <div className="bg-white p-4 rounded-xs shadow-md border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-3">
                Healthy Foods & Peanut Butter
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {peanutButterProducts.slice(0, 4).map((p, i) => (
                  <Link
                    key={i}
                    to={`/product/${p.id}`}
                    className="group flex flex-col text-left"
                  >
                    <div className="aspect-square bg-[#f7f7f7] rounded-sm p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] text-gray-800 line-clamp-1 mt-1 font-medium group-hover:text-[#c7511f]">
                      {p.name}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">
                      High Protein
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/shop?category=peanut-butter"
              className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline mt-4 block"
            >
              See all healthy snacks
            </Link>
          </div>

          {/* Card 4: Sign In & Admin Seller Central Card */}
          <div className="bg-white p-4 rounded-xs shadow-md border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                {isAuthenticated ? `Welcome back, ${user?.name.split(' ')[0]}` : 'Sign in for your best experience'}
              </h3>
              
              {!isAuthenticated ? (
                <div className="my-4">
                  <Link
                    to="/login"
                    className="block w-full py-2.5 text-center bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold rounded-full text-xs shadow-sm"
                  >
                    Sign in securely
                  </Link>
                </div>
              ) : (
                <div className="my-2 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-medium">
                  ✓ Active Prime Member • FREE One-Day Delivery Enabled
                </div>
              )}

              {/* Admin Direct Access */}
              <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-sm">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span className="font-bold text-xs text-amber-950">Macho Seller Central</span>
                </div>
                <p className="text-[11px] text-amber-800 mb-2">
                  Future items add karein, inventory manage karein, ya catalog reset karein.
                </p>
                <Link
                  to="/admin/dashboard"
                  className="inline-block text-xs font-bold text-slate-900 bg-[#febd69] hover:bg-[#f3a847] px-3 py-1.5 rounded-sm shadow-xs"
                >
                  Open Admin Dashboard →
                </Link>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#007185]">
              <Link to="/orders" className="hover:underline">Your Orders</Link>
              <Link to="/brands" className="hover:underline">Brands Store</Link>
            </div>
          </div>

        </div>

      </div>

      {/* 3. MachoBeast Horizontal Product Rail: Today's Deals */}
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 mt-6">
        <div className="bg-white p-5 rounded-xs shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Today's Deals in Sports Nutrition
              </h2>
              <span className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer hidden sm:inline">
                See all deals
              </span>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-[#007185] hover:text-[#c7511f] hover:underline flex items-center gap-1"
            >
              <span>Explore 200+ Products</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {bestsellers.slice(0, 5).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* 4. MachoPrime Express Banner Strip */}
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 mt-6">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-4 sm:p-6 rounded-xs shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-amber-500/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center font-black text-slate-950 text-sm shadow-md shrink-0">
              ⚡ PRIME
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                FREE Fast Delivery on All MachoPrime Orders
              </h3>
              <p className="text-xs text-amber-200 mt-0.5">
                Enjoy unlimited FREE One-Day and Two-Day delivery with 100% genuine supplements guarantee.
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 font-bold px-6 py-2.5 rounded-full text-xs shadow-md transition-all whitespace-nowrap cursor-pointer"
          >
            Shop MachoPrime Eligible Items
          </Link>
        </div>
      </div>

      {/* 5. Best Sellers in Whey Protein Rail */}
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 mt-6">
        <div className="bg-white p-5 rounded-xs shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Best Sellers in Whey Protein & Isolate
              </h2>
              <p className="text-xs text-gray-500">
                Most popular customer choices based on verified purchase sales
              </p>
            </div>
            <Link
              to="/shop?category=whey-protein"
              className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              See more
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {proteinProducts.slice(0, 5).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      {/* 6. Mass Gainers & Muscle Growth Rail */}
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 mt-6">
        <div className="bg-white p-5 rounded-xs shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Trending Mass Gainers & Muscle Growth Series
              </h2>
              <p className="text-xs text-gray-500">
                High calorie clean carbohydrate formulas for bulking and size
              </p>
            </div>
            <Link
              to="/shop?category=mass-gainer"
              className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              See more
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {massGainerProducts.slice(0, 5).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
