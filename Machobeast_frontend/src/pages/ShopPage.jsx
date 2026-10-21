import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Grid,
  SlidersHorizontal,
  Star,
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  ShoppingBag,
  ArrowUpDown
} from 'lucide-react';
import ProductCard from '../components/product/ProductCard';

// Helper to get minimum variant price for a product
const getProductMinPrice = (p) => {
  if (p.variants && p.variants.length > 0) {
    return Math.min(...p.variants.map((v) => v.price));
  }
  return p.price || 0;
};

// Helper to get max variant price
const getProductMaxPrice = (p) => {
  if (p.variants && p.variants.length > 0) {
    return Math.max(...p.variants.map((v) => v.price));
  }
  return p.price || 0;
};

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: allProducts, brands, categories } = useSelector((state) => state.products);

  const getProductsByCategory = (catId) => allProducts.filter((p) => p.category === catId);
  const getProductsByBrand = (brandId) => allProducts.filter((p) => p.brand === brandId);

  // URL Query Parameters
  const urlCategory = searchParams.get('category');
  const urlBrand = searchParams.get('brand');
  const urlSearch = searchParams.get('search');
  const urlSort = searchParams.get('sort');
  const urlMinPrice = searchParams.get('minPrice');
  const urlMaxPrice = searchParams.get('maxPrice');
  const urlRating = searchParams.get('rating');

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState(() =>
    urlCategory ? urlCategory.split(',').filter(Boolean) : []
  );
  const [selectedBrands, setSelectedBrands] = useState(() =>
    urlBrand ? urlBrand.split(',').filter(Boolean) : []
  );
  const [searchQuery, setSearchQuery] = useState(() => urlSearch || '');
  const [minPrice, setMinPrice] = useState(() => urlMinPrice || '');
  const [maxPrice, setMaxPrice] = useState(() => urlMaxPrice || '');
  const [selectedRating, setSelectedRating] = useState(() => (urlRating ? Number(urlRating) : 0));
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [isBestsellerOnly, setIsBestsellerOnly] = useState(false);

  // Layout & UI States
  const [sortBy, setSortBy] = useState(() => urlSort || 'featured');
  const [gridCols, setGridCols] = useState(4); // 3, 4, or 5 columns
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Mobile drawer filter visibility
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Accordion toggle states for sidebar sections
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
    rating: true,
    preferences: true
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Sync state if URL changes from outside (e.g. Navbar search or Header link click)
  useEffect(() => {
    if (urlSearch !== null && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
      setCurrentPage(1);
    }
  }, [urlSearch]);

  useEffect(() => {
    if (urlCategory !== null) {
      const cats = urlCategory ? urlCategory.split(',').filter(Boolean) : [];
      setSelectedCategories(cats);
      setCurrentPage(1);
    }
  }, [urlCategory]);

  useEffect(() => {
    if (urlBrand !== null) {
      const brs = urlBrand ? urlBrand.split(',').filter(Boolean) : [];
      setSelectedBrands(brs);
      setCurrentPage(1);
    }
  }, [urlBrand]);

  // Update URL Search Params whenever primary filters change
  const updateUrl = (newCats, newBrands, newSearch, newSort, newMin, newMax, newRating) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newCats && newCats.length > 0) params.set('category', newCats.join(','));
    if (newBrands && newBrands.length > 0) params.set('brand', newBrands.join(','));
    if (newSort && newSort !== 'featured') params.set('sort', newSort);
    if (newMin) params.set('minPrice', newMin);
    if (newMax) params.set('maxPrice', newMax);
    if (newRating) params.set('rating', newRating.toString());
    setSearchParams(params, { replace: true });
  };

  // Category Toggle Handler
  const handleCategoryToggle = (catId) => {
    const updated = selectedCategories.includes(catId)
      ? selectedCategories.filter((id) => id !== catId)
      : [...selectedCategories, catId];
    setSelectedCategories(updated);
    setCurrentPage(1);
    updateUrl(updated, selectedBrands, searchQuery, sortBy, minPrice, maxPrice, selectedRating);
  };

  // Brand Toggle Handler
  const handleBrandToggle = (brandId) => {
    const updated = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];
    setSelectedBrands(updated);
    setCurrentPage(1);
    updateUrl(selectedCategories, updated, searchQuery, sortBy, minPrice, maxPrice, selectedRating);
  };

  // Rating Select Handler
  const handleRatingSelect = (rating) => {
    const updated = selectedRating === rating ? 0 : rating;
    setSelectedRating(updated);
    setCurrentPage(1);
    updateUrl(selectedCategories, selectedBrands, searchQuery, sortBy, minPrice, maxPrice, updated);
  };

  // Price apply handler
  const handleApplyPrice = (minVal, maxVal) => {
    setMinPrice(minVal);
    setMaxPrice(maxVal);
    setCurrentPage(1);
    updateUrl(selectedCategories, selectedBrands, searchQuery, sortBy, minVal, maxVal, selectedRating);
  };

  // Sort change handler
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    updateUrl(selectedCategories, selectedBrands, searchQuery, newSort, minPrice, maxPrice, selectedRating);
  };

  // Reset / Clear all filters
  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedRating(0);
    setIsVegOnly(false);
    setIsBestsellerOnly(false);
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  // Count products per category & brand dynamically
  const categoryCounts = useMemo(() => {
    const counts = {};
    categories.forEach((c) => {
      counts[c.id] = getProductsByCategory(c.id).length;
    });
    return counts;
  }, [allProducts, categories]);

  const brandCounts = useMemo(() => {
    const counts = {};
    brands.forEach((b) => {
      counts[b.id] = getProductsByBrand(b.id).length;
    });
    return counts;
  }, [allProducts, brands]);

  // Filtered and Sorted Products computation
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search query filter (matches name, description, brand, category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category filter (OR logic among selected categories)
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Brand filter (OR logic among selected brands)
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Price range filter
    if (minPrice !== '') {
      const min = Number(minPrice);
      if (!isNaN(min)) {
        result = result.filter((p) => getProductMinPrice(p) >= min);
      }
    }
    if (maxPrice !== '') {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        result = result.filter((p) => getProductMinPrice(p) <= max);
      }
    }

    // Rating filter
    if (selectedRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= selectedRating);
    }

    // Veg Only filter
    if (isVegOnly) {
      result = result.filter((p) => p.isVeg !== false);
    }

    // Bestseller Only filter
    if (isBestsellerOnly) {
      result = result.filter((p) => Boolean(p.isBestseller));
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => getProductMinPrice(a) - getProductMinPrice(b));
        break;
      case 'price-high':
        result.sort((a, b) => getProductMinPrice(b) - getProductMinPrice(a));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'bestsellers':
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.reverse();
        break;
      case 'featured':
      default:
        // Default ranking: bestsellers first, then rating
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    return result;
  }, [
    searchQuery,
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
    selectedRating,
    isVegOnly,
    isBestsellerOnly,
    sortBy,
    allProducts
  ]);

  // Pagination calculation
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, startIndex, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Active filters count
  const activeFiltersCount =
    selectedCategories.length +
    selectedBrands.length +
    (searchQuery ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (selectedRating > 0 ? 1 : 0) +
    (isVegOnly ? 1 : 0) +
    (isBestsellerOnly ? 1 : 0);

  // Dynamic grid classes
  const gridClasses = {
    3: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
    4: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5',
    5: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5'
  }[gridCols];

  // Helper labels
  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || id;
  const getBrandName = (id) => brands.find((b) => b.id === id)?.name || id;

  // Render Sidebar Filters Content (used in both desktop sidebar & mobile slide-over)
  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Header & Clear All */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-amber-500" />
          <h2 className="font-display font-black text-gray-900 text-lg uppercase tracking-wider">
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <span className="bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter: Categories */}
      <div className="border-b border-gray-200 pb-5">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-left py-1 text-sm font-bold text-gray-900 uppercase tracking-wide group"
        >
          <span className="group-hover:text-amber-600 transition-colors">Categories</span>
          {openSections.categories ? (
            <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
          )}
        </button>

        {openSections.categories && (
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1 text-sm scrollbar-thin">
            {categories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-amber-50/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-400 cursor-pointer accent-amber-500"
                    />
                    <span className="text-base select-none">{cat.icon}</span>
                    <span
                      className={`text-xs truncate transition-colors ${
                        isChecked ? 'font-bold text-gray-950' : 'text-gray-700 group-hover:text-gray-900'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 group-hover:bg-amber-100 group-hover:text-amber-800 px-1.5 py-0.5 rounded ml-2">
                    {categoryCounts[cat.id] || 0}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter: Brands */}
      <div className="border-b border-gray-200 pb-5">
        <button
          onClick={() => toggleSection('brands')}
          className="w-full flex items-center justify-between text-left py-1 text-sm font-bold text-gray-900 uppercase tracking-wide group"
        >
          <span className="group-hover:text-amber-600 transition-colors">Brands</span>
          {openSections.brands ? (
            <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
          )}
        </button>

        {openSections.brands && (
          <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1 text-sm scrollbar-thin">
            {brands.map((brand) => {
              const isChecked = selectedBrands.includes(brand.id);
              return (
                <label
                  key={brand.id}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-amber-50/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleBrandToggle(brand.id)}
                      className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-400 cursor-pointer accent-amber-500"
                    />
                    <span className="text-base select-none">{brand.logo}</span>
                    <span
                      className={`text-xs truncate transition-colors ${
                        isChecked ? 'font-bold text-gray-950' : 'text-gray-700 group-hover:text-gray-900'
                      }`}
                    >
                      {brand.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 group-hover:bg-amber-100 group-hover:text-amber-800 px-1.5 py-0.5 rounded ml-2">
                    {brandCounts[brand.id] || 0}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter: Price Range */}
      <div className="border-b border-gray-200 pb-5">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-left py-1 text-sm font-bold text-gray-900 uppercase tracking-wide group"
        >
          <span className="group-hover:text-amber-600 transition-colors">Price Range</span>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
          )}
        </button>

        {openSections.price && (
          <div className="mt-3 space-y-3">
            {/* Quick Price Range Presets */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'Under ₹1,000', min: '', max: '1000' },
                { label: '₹1,000 - ₹2,500', min: '1000', max: '2500' },
                { label: '₹2,500 - ₹5,000', min: '2500', max: '5000' },
                { label: '₹5,000 & Above', min: '5000', max: '' }
              ].map((range, idx) => {
                const isActive = minPrice === range.min && maxPrice === range.max;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (isActive) {
                        handleApplyPrice('', '');
                      } else {
                        handleApplyPrice(range.min, range.max);
                      }
                    }}
                    className={`text-[11px] font-semibold py-1.5 px-2 rounded-md border text-center transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Min / Max Inputs */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 relative">
                <span className="absolute left-2.5 top-2 text-xs text-gray-400">₹</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <span className="text-gray-400 text-xs font-bold">to</span>
              <div className="flex-1 relative">
                <span className="absolute left-2.5 top-2 text-xs text-gray-400">₹</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleApplyPrice(minPrice, maxPrice)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-black text-amber-400 text-xs font-bold rounded-md transition-colors"
              >
                Go
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter: Customer Rating */}
      <div className="border-b border-gray-200 pb-5">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between text-left py-1 text-sm font-bold text-gray-900 uppercase tracking-wide group"
        >
          <span className="group-hover:text-amber-600 transition-colors">Customer Rating</span>
          {openSections.rating ? (
            <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
          )}
        </button>

        {openSections.rating && (
          <div className="mt-3 space-y-1.5">
            {[4, 3, 2, 1].map((stars) => {
              const isSelected = selectedRating === stars;
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => handleRatingSelect(stars)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? 'bg-amber-100/70 text-slate-950 font-bold border border-amber-300'
                      : 'hover:bg-amber-50/50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < stars
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-200 fill-gray-100'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-800">{stars} Stars & Above</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-700 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter: Badges & Dietary */}
      <div>
        <button
          onClick={() => toggleSection('preferences')}
          className="w-full flex items-center justify-between text-left py-1 text-sm font-bold text-gray-900 uppercase tracking-wide group"
        >
          <span className="group-hover:text-amber-600 transition-colors">Dietary & Specials</span>
          {openSections.preferences ? (
            <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
          )}
        </button>

        {openSections.preferences && (
          <div className="mt-3 space-y-2.5 text-xs">
            {/* Veg Only Toggle */}
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50/50 cursor-pointer border border-gray-100 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border border-emerald-600 flex items-center justify-center p-0.5 rounded-sm">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                </span>
                <span className="font-semibold text-gray-800">100% Vegetarian Only</span>
              </div>
              <input
                type="checkbox"
                checked={isVegOnly}
                onChange={(e) => {
                  setIsVegOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-400 cursor-pointer accent-emerald-600"
              />
            </label>

            {/* Bestseller Only Toggle */}
            <label className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50/50 cursor-pointer border border-gray-100 transition-colors">
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 font-extrabold text-[10px] px-1.5 py-0.5 rounded uppercase">
                  Bestseller
                </span>
                <span className="font-semibold text-gray-800">Bestsellers Only</span>
              </div>
              <input
                type="checkbox"
                checked={isBestsellerOnly}
                onChange={(e) => {
                  setIsBestsellerOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-400 cursor-pointer accent-purple-600"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Breadcrumb & Page Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Link to="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Shop Catalog</span>
            {selectedCategories.length === 1 && (
              <>
                <span>/</span>
                <span className="text-amber-600 font-semibold">
                  {getCategoryName(selectedCategories[0])}
                </span>
              </>
            )}
            {selectedBrands.length === 1 && (
              <>
                <span>/</span>
                <span className="text-amber-600 font-semibold">
                  {getBrandName(selectedBrands[0])}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-gray-950 tracking-tight">
                {selectedCategories.length === 1
                  ? getCategoryName(selectedCategories[0])
                  : selectedBrands.length === 1
                  ? getBrandName(selectedBrands[0])
                  : searchQuery
                  ? `Search: "${searchQuery}"`
                  : 'MachoBeast Supplement Shop'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>100% Authentic Supplements, Protein Powders, Creatine & Sports Nutrition</span>
              </p>
            </div>

            {/* Quick in-shop search input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search supplements in shop..."
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  setCurrentPage(1);
                  updateUrl(
                    selectedCategories,
                    selectedBrands,
                    val,
                    sortBy,
                    minPrice,
                    maxPrice,
                    selectedRating
                  );
                }}
                className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                    updateUrl(
                      selectedCategories,
                      selectedBrands,
                      '',
                      sortBy,
                      minPrice,
                      maxPrice,
                      selectedRating
                    );
                  }}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Shop Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex gap-8">
          
          {/* ========================================================= */}
          {/* DESKTOP LEFT SIDEBAR FILTERS                              */}
          {/* ========================================================= */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm sticky top-24">
              {renderFilterContent()}
            </div>
          </aside>

          {/* ========================================================= */}
          {/* MAIN PRODUCT LISTING AREA                                 */}
          {/* ========================================================= */}
          <main className="flex-1 min-w-0">
            
            {/* TOP BAR: Controls, Sorting, Grid Toggle */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Result count & Mobile filter trigger */}
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-amber-400 rounded-lg text-xs font-bold hover:bg-black transition-all shadow-sm"
                  >
                    <Filter className="w-3.5 h-3.5 text-amber-400" />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  <p className="text-xs sm:text-sm font-semibold text-gray-700">
                    Showing{' '}
                    <span className="font-extrabold text-gray-900">
                      {totalProducts === 0
                        ? 0
                        : `${startIndex + 1}–${Math.min(startIndex + itemsPerPage, totalProducts)}`}
                    </span>{' '}
                    of <span className="font-extrabold text-gray-900">{totalProducts}</span> products
                  </p>
                </div>

                {/* Right controls: Sorting and Grid view buttons */}
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  
                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 hidden sm:inline" />
                    <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                      Sort:
                    </span>
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-xs font-bold rounded-lg py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 cursor-pointer shadow-sm hover:bg-gray-100 transition-colors"
                      >
                        <option value="featured">Featured / Recommended</option>
                        <option value="bestsellers">Bestsellers</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Customer Rating</option>
                        <option value="newest">Newest</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Grid View Columns Toggle (Desktop & Tablet) */}
                  <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <span className="px-1 text-gray-400">
                      <Grid className="w-3.5 h-3.5" />
                    </span>
                    <button
                      type="button"
                      onClick={() => setGridCols(3)}
                      title="3 Columns"
                      className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${
                        gridCols === 3
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      3 Col
                    </button>
                    <button
                      type="button"
                      onClick={() => setGridCols(4)}
                      title="4 Columns"
                      className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${
                        gridCols === 4
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      4 Col
                    </button>
                    <button
                      type="button"
                      onClick={() => setGridCols(5)}
                      title="5 Columns"
                      className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 transition-all ${
                        gridCols === 5
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      5 Col
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filter Chips / Pills */}
              {activeFiltersCount > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                    Active Filters:
                  </span>

                  {/* Search query chip */}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Query: "{searchQuery}"
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          updateUrl(
                            selectedCategories,
                            selectedBrands,
                            '',
                            sortBy,
                            minPrice,
                            maxPrice,
                            selectedRating
                          );
                        }}
                        className="hover:text-red-600 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Category Chips */}
                  {selectedCategories.map((catId) => (
                    <span
                      key={catId}
                      className="inline-flex items-center gap-1 bg-amber-100/70 border border-amber-300 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full"
                    >
                      {getCategoryName(catId)}
                      <button
                        onClick={() => handleCategoryToggle(catId)}
                        className="hover:text-red-600 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Brand Chips */}
                  {selectedBrands.map((brandId) => (
                    <span
                      key={brandId}
                      className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full"
                    >
                      {getBrandName(brandId)}
                      <button
                        onClick={() => handleBrandToggle(brandId)}
                        className="hover:text-red-600 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Price Chip */}
                  {(minPrice || maxPrice) && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Price: ₹{minPrice || '0'} – ₹{maxPrice || '∞'}
                      <button
                        onClick={() => handleApplyPrice('', '')}
                        className="hover:text-red-600 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Rating Chip */}
                  {selectedRating > 0 && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      {selectedRating}★ & Above
                      <button
                        onClick={() => handleRatingSelect(0)}
                        className="hover:text-red-600 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Veg Only Chip */}
                  {isVegOnly && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                      Veg Only
                      <button onClick={() => setIsVegOnly(false)} className="hover:text-red-600 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Bestseller Only Chip */}
                  {isBestsellerOnly && (
                    <span className="inline-flex items-center gap-1 bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold px-2 py-0.5 rounded-full">
                      Bestsellers
                      <button
                        onClick={() => setIsBestsellerOnly(false)}
                        className="hover:text-red-600 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Reset All Button */}
                  <button
                    onClick={handleClearAll}
                    className="text-xs font-bold text-red-600 hover:text-red-800 underline ml-2 cursor-pointer"
                  >
                    Reset all
                  </button>
                </div>
              )}
            </div>

            {/* PRODUCT GRID OR EMPTY STATE */}
            {paginatedProducts.length > 0 ? (
              <div className={gridClasses}>
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display font-black text-xl text-gray-900 mb-2">
                  No Supplements Found
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  We couldn't find any products matching your active filters or search terms. Try
                  loosening your criteria or resetting filters.
                </p>
                <button
                  onClick={handleClearAll}
                  className="bg-slate-900 hover:bg-black text-amber-400 font-bold px-6 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset All Filters
                </button>
              </div>
            )}

            {/* PAGINATION SECTION */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">
                  Page <span className="font-bold text-gray-900">{currentPage}</span> of{' '}
                  <span className="font-bold text-gray-900">{totalPages}</span>
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isCurrent = currentPage === pageNum;

                    // Display page 1, last page, and pages around current page
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }

                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return (
                        <span key={pageNum} className="px-1 text-gray-400 text-xs">
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE SLIDE-OVER FILTER DRAWER                           */}
      {/* ========================================================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-500" />
                <h3 className="font-display font-black text-gray-900 text-base uppercase tracking-wider">
                  Filter Supplements
                </h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable filter controls */}
            <div className="p-4 overflow-y-auto flex-1">{renderFilterContent()}</div>

            {/* Sticky footer with apply & results count */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
              <button
                onClick={handleClearAll}
                className="w-1/3 py-2.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-2/3 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md"
              >
                Show {totalProducts} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
