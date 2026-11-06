import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Compass, ShoppingBag, User, Package } from 'lucide-react';

export const MobileBottomNav = () => {
  const { totalQuantity } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: Home,
      badge: null
    },
    {
      to: '/shop',
      label: 'Shop',
      icon: Compass,
      badge: null
    },
    {
      to: '/cart',
      label: 'Cart',
      icon: ShoppingBag,
      badge: totalQuantity > 0 ? totalQuantity : null
    },
    {
      to: '/orders',
      label: 'Orders',
      icon: Package,
      badge: null
    },
    {
      to: isAuthenticated ? '/profile' : '/login',
      label: isAuthenticated ? (user?.name ? user.name.split(' ')[0] : 'Account') : 'Sign In',
      icon: User,
      badge: null
    }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#131921]/95 backdrop-blur-md border-t border-slate-800 text-slate-300 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
    >
      <div className="grid grid-cols-5 h-14 items-center max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 relative text-[10px] font-semibold transition-all ${
                  isActive
                    ? 'text-[#febd69] scale-105'
                    : 'text-gray-400 hover:text-white'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== null && (
                  <span className="absolute -top-1 -right-2.5 bg-[#f08804] text-white font-black text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center leading-none shadow">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="truncate max-w-[64px] mt-0.5 tracking-tight">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;

