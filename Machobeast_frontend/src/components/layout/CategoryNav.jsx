import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, ChevronRight, Sparkles, Flame, Tag, ShieldCheck } from 'lucide-react';

export const CategoryNav = () => {
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const { categories, brands } = useSelector((state) => state.products);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const machoQuickLinks = [
    { label: 'All Supplements', path: '/shop' },
    { label: "Today's Deals", path: '/shop?sort=bestsellers' },
    { label: 'Best Sellers', path: '/shop?sort=bestsellers' },
    { label: 'Whey Protein', path: '/shop?category=whey-protein' },
    { label: 'Creatine Fest', path: '/shop?category=creatine' },
    { label: 'Mass Gainers', path: '/shop?category=mass-gainer' },
    { label: 'Peanut Butter', path: '/shop?category=peanut-butter' },
    { label: 'All Brands', path: '/brands' },
    { label: 'MachoPrime Delivery', path: '/shop' },
    { label: 'Customer Service', path: '/orders' },
  ];

  return (
    <>
      {/* MachoBeast Secondary Header (#232f3e) */}
      <nav className="bg-[#232f3e] text-white text-xs select-none border-b border-[#1b2531]">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 flex items-center justify-between h-9">
          
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {/* MachoBeast "All" Hamburger Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1 py-1 px-2 rounded-sm border border-transparent hover:border-white font-bold shrink-0 text-white cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>All</span>
            </button>

            {/* Sub-header Links */}
            {machoQuickLinks.map((item, idx) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={`py-1 px-2 rounded-sm border transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-white font-bold text-[#febd69]'
                      : 'border-transparent hover:border-white font-medium text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Festival / Prime Banner */}
          <div className="hidden xl:flex items-center gap-2 shrink-0 text-[11px] text-[#febd69] font-bold">
            <span className="animate-pulse">⚡ Great Macho Festival | Live Deals</span>
          </div>

        </div>
      </nav>

      {/* MachoBeast Full Category Sidebar Drawer ("All" Menu) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-in fade-in">
          <div className="w-80 sm:w-96 bg-white h-full shadow-2xl flex flex-col text-slate-900 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  👤
                </div>
                <h3 className="font-bold text-sm">Hello, Sign In</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 text-xs">
              {/* Trending Section */}
              <div className="p-4 space-y-2">
                <p className="font-black text-gray-900 text-xs uppercase tracking-wider">
                  Trending & Deals
                </p>
                <Link
                  to="/shop?sort=bestsellers"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center justify-between py-1.5 text-gray-700 hover:text-[#c7511f]"
                >
                  <span>Best Sellers</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center justify-between py-1.5 text-gray-700 hover:text-[#c7511f]"
                >
                  <span>New Releases</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
                <Link
                  to="/shop?sort=bestsellers"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center justify-between py-1.5 text-gray-700 hover:text-[#c7511f]"
                >
                  <span>Movers & Shakers</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
              </div>

              {/* Shop by Department */}
              <div className="p-4 space-y-2">
                <p className="font-black text-gray-900 text-xs uppercase tracking-wider">
                  Shop by Category
                </p>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/shop?category=${c.id}`}
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between py-1.5 text-gray-700 hover:text-[#c7511f]"
                  >
                    <span>{c.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>
                ))}
              </div>

              {/* Shop by Brand */}
              <div className="p-4 space-y-2">
                <p className="font-black text-gray-900 text-xs uppercase tracking-wider">
                  Top Supplement Brands
                </p>
                {brands.slice(0, 8).map((b) => (
                  <Link
                    key={b.id}
                    to={`/shop?brand=${b.id}`}
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between py-1.5 text-gray-700 hover:text-[#c7511f]"
                  >
                    <span>{b.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>
                ))}
              </div>

              {/* Help & Settings */}
              <div className="p-4 space-y-2">
                <p className="font-black text-gray-900 text-xs uppercase tracking-wider">
                  Help & Settings
                </p>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block py-1.5 text-amber-700 font-bold"
                >
                  Admin Seller Central (Manage Items)
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block py-1.5 text-gray-700 hover:text-[#c7511f]"
                >
                  Your Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block py-1.5 text-gray-700 hover:text-[#c7511f]"
                >
                  Your Account
                </Link>
              </div>
            </div>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setIsDrawerOpen(false)}></div>
        </div>
      )}
    </>
  );
};

export default CategoryNav;
