import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Package,
  Search,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Dumbbell,
  Flame,
  Truck
} from 'lucide-react';

// Brand tagline and highlight metadata for enhanced presentation
const BRAND_METADATA = {
  'divine-nutrition': {
    tagline: 'Crafted for Champions & Elite Athletes',
    origin: 'India',
    popularCategory: 'Whey Protein & Isolate',
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    accentColor: 'text-amber-600',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
  },
  'maxures': {
    tagline: 'Advanced Clinical & Sports Nutrition',
    origin: 'India',
    popularCategory: 'Mass Gainers & Carbs',
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    accentColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
  },
  'muscle-doctor': {
    tagline: 'Lab Tested Science-Backed Formulas',
    origin: 'India',
    popularCategory: 'Creatine & Pre-Workouts',
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    accentColor: 'text-emerald-600',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
  },
  'absolute': {
    tagline: 'Uncompromising Quality & Pure Power',
    origin: 'India',
    popularCategory: 'Performance Gainers & Whey',
    gradient: 'from-red-500/10 via-orange-500/5 to-transparent',
    accentColor: 'text-red-600',
    badgeColor: 'bg-red-100 text-red-900 border-red-200'
  },
  'alpino': {
    tagline: '100% Roasted Natural Peanut Butter & Oats',
    origin: 'India',
    popularCategory: 'Healthy Spreads & Foods',
    gradient: 'from-amber-600/10 via-yellow-500/5 to-transparent',
    accentColor: 'text-amber-700',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
  },
  'wellcore': {
    tagline: 'Micronized Purity for Explosive Strength',
    origin: 'India',
    popularCategory: 'Creatine Monohydrate',
    gradient: 'from-cyan-500/10 via-blue-500/5 to-transparent',
    accentColor: 'text-cyan-600',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200'
  },
  'wellx': {
    tagline: 'Clean Everyday Protein & Nutrition',
    origin: 'India',
    popularCategory: 'Protein Oats & Butters',
    gradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
    accentColor: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
  },
  'hercules': {
    tagline: 'Legendary Muscle Building Heritage',
    origin: 'India',
    popularCategory: 'Mass Gainers & Amino Acids',
    gradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
    accentColor: 'text-orange-600',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-200'
  }
};

export const BrandsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { items: allProducts, brands } = useSelector((state) => state.products);

  // Compute product counts and enrich brands list
  const enrichedBrands = useMemo(() => {
    return brands.map((brand) => {
      const brandProducts = allProducts.filter((p) => p.brand === brand.id);
      const meta = BRAND_METADATA[brand.id] || {
        tagline: 'Official Authorized Brand Partner',
        origin: 'India',
        popularCategory: 'Sports Nutrition',
        gradient: 'from-amber-500/10 via-slate-500/5 to-transparent',
        accentColor: 'text-amber-600',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
      };

      // Extract unique categories for this brand
      const categoriesSet = new Set(brandProducts.map((p) => p.category).filter(Boolean));
      const categoriesList = Array.from(categoriesSet);

      return {
        ...brand,
        productCount: brandProducts.length,
        products: brandProducts,
        meta,
        categories: categoriesList
      };
    });
  }, [allProducts, brands]);

  // Filtered brands based on user search and quick filter
  const filteredBrands = useMemo(() => {
    return enrichedBrands.filter((brand) => {
      const matchesSearch =
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.meta.popularCategory.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === 'all') return matchesSearch;
      if (selectedFilter === 'protein') {
        return matchesSearch && brand.categories.some((c) => c.includes('whey') || c.includes('protein'));
      }
      if (selectedFilter === 'creatine') {
        return matchesSearch && brand.categories.some((c) => c.includes('creatine'));
      }
      if (selectedFilter === 'foods') {
        return matchesSearch && brand.categories.some((c) => c.includes('peanut') || c.includes('foods'));
      }
      return matchesSearch;
    });
  }, [enrichedBrands, searchQuery, selectedFilter]);

  const handleBrandClick = (brandId) => {
    navigate(`/shop?brand=${encodeURIComponent(brandId)}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link to="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-slate-900 font-bold">Brands</span>
          </nav>
        </div>
      </div>

      {/* Hero Section: Our Trusted Brands */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white overflow-hidden py-14 sm:py-20 border-b border-amber-500/20">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-6 backdrop-blur-sm shadow-sm">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            100% Genuine Direct Brand Partnerships
          </div>

          {/* Main Title */}
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none mb-4">
            Our Trusted <span className="text-amber-400">Brands</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-8">
            Fuel your fitness journey with India’s most certified and respected sports nutrition names.
            Every brand is directly sourced with authentic holograms, batch verification, and lab-tested purity.
          </p>

          {/* Quick Value Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4 text-left">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 backdrop-blur-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Direct Sourcing</p>
                <p className="text-[11px] text-slate-400">Zero Middlemen</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 backdrop-blur-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Lab Certified</p>
                <p className="text-[11px] text-slate-400">Tested Quality</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 backdrop-blur-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Fast Delivery</p>
                <p className="text-[11px] text-slate-400">Free Above ₹999</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 sm:p-4 backdrop-blur-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Best Prices</p>
                <p className="text-[11px] text-slate-400">Exclusive Deals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name or category..."
              className="w-full bg-gray-50 text-sm text-gray-900 rounded-xl pl-10 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs font-extrabold uppercase text-gray-400 whitespace-nowrap hidden sm:inline mr-1">
              Filter:
            </span>
            {[
              { id: 'all', label: 'All Brands' },
              { id: 'protein', label: 'Proteins' },
              { id: 'creatine', label: 'Creatine' },
              { id: 'foods', label: 'Health Foods' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSelectedFilter(btn.id)}
                className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                  selectedFilter === btn.id
                    ? 'bg-black text-amber-400 shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-slate-900'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Brand Count Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Showing <span className="text-slate-900 font-extrabold">{filteredBrands.length}</span> of {brands.length} Brands
          </div>
        </div>

        {/* Brands Grid */}
        <div className="mt-8">
          {filteredBrands.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 mb-2">
                No Brands Found
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                We couldn't find any brand matching "{searchQuery}". Try searching for another name or reset your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                className="bg-black hover:bg-slate-900 text-amber-400 font-bold px-5 py-2.5 rounded-lg text-sm transition-all"
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBrands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => handleBrandClick(brand.id)}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative"
                >
                  {/* Decorative background gradient */}
                  <div
                    className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${brand.meta.gradient} opacity-80 pointer-events-none`}
                  />

                  {/* Card Content Top */}
                  <div className="p-6 relative z-10">
                    
                    {/* Top Row: Logo & Short Badge */}
                    <div className="flex items-start justify-between mb-4">
                      {/* Brand Logo Box */}
                      <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-md flex items-center justify-center text-3xl group-hover:scale-110 group-hover:shadow-amber-500/20 group-hover:border-amber-200 transition-all duration-300">
                        {brand.logo}
                      </div>

                      {/* Brand Tag / Code */}
                      <span className="text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-900 text-amber-400 shadow-sm">
                        {brand.shortName}
                      </span>
                    </div>

                    {/* Brand Name */}
                    <h3 className="font-display font-black text-xl text-slate-950 group-hover:text-amber-600 transition-colors mb-1.5 leading-snug">
                      {brand.name}
                    </h3>

                    {/* Tagline */}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                      {brand.meta.tagline}
                    </p>

                    {/* Product Count Pill */}
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 group-hover:bg-amber-50 border border-gray-200 group-hover:border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-slate-700 group-hover:text-amber-800 transition-colors mb-3">
                      <Package className="w-3.5 h-3.5 text-amber-500" />
                      <span>{brand.productCount} Products Available</span>
                    </div>

                    {/* Highlight Category Tag */}
                    <div className="text-[11px] text-gray-500 font-medium">
                      Speciality: <span className="text-slate-800 font-bold">{brand.meta.popularCategory}</span>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-6 pt-0 relative z-10 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBrandClick(brand.id);
                      }}
                      className="w-full bg-slate-900 group-hover:bg-amber-500 text-amber-400 group-hover:text-black font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm group-hover:shadow-md"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Authenticity Guarantee Ribbon */}
        <div className="mt-16 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-8 sm:p-10 border border-amber-500/30 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-2">
                <Dumbbell className="w-4 h-4 text-amber-400" />
                MachoBeast Authenticity Guarantee
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
                100% Genuine Products Or 200% Money Back
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We partner exclusively with brand brand owners and authorized national importers. 
                Every protein tub, creatine jar, and supplement carries verifiable scratch codes and seal tags.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                to="/shop"
                className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-6 py-3.5 rounded-xl text-center text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <span>Browse All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default BrandsPage;
