import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="text-white text-xs select-none">
      {/* MachoBeast Back to Top Bar */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-white py-3.5 text-xs font-semibold text-center transition-colors block cursor-pointer"
      >
        Back to top
      </button>

      {/* Primary 4-Column Navigation Links (#232f3e) */}
      <div className="bg-[#232f3e] py-10 px-4 border-b border-[#3a4553]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Get to Know Us</h4>
            <ul className="space-y-2 text-[#dddddd] text-xs">
              <li><Link to="/about" className="hover:underline">About MachoBeast</Link></li>
              <li><Link to="/brands" className="hover:underline">Authorized Brand Partners</Link></li>
              <li><Link to="/science" className="hover:underline">Lab Purity & Science</Link></li>
              <li><Link to="/press" className="hover:underline">Press Releases</Link></li>
              <li><Link to="/admin/dashboard" className="text-[#febd69] font-bold hover:underline">Seller Central (Admin)</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Connect with Us</h4>
            <ul className="space-y-2 text-[#dddddd] text-xs">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Twitter / X</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">YouTube Fitness</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Make Money with Us</h4>
            <ul className="space-y-2 text-[#dddddd] text-xs">
              <li><Link to="/admin/dashboard" className="hover:underline">Sell on MachoBeast</Link></li>
              <li><Link to="/brands" className="hover:underline">Sell under Macho Accelerator</Link></li>
              <li><Link to="/affiliate" className="hover:underline">Become an Affiliate</Link></li>
              <li><Link to="/fulfillment" className="hover:underline">Fulfilment by MachoBeast</Link></li>
              <li><Link to="/advertise" className="hover:underline">Advertise Your Supplements</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Let Us Help You</h4>
            <ul className="space-y-2 text-[#dddddd] text-xs">
              <li><Link to="/profile" className="hover:underline">Your Account</Link></li>
              <li><Link to="/orders" className="hover:underline">Returns Centre & Tracking</Link></li>
              <li><Link to="/orders" className="hover:underline">Recalls and Safety Alerts</Link></li>
              <li><Link to="/protection" className="hover:underline">100% Purchase Protection</Link></li>
              <li><Link to="/help" className="hover:underline">Help & Customer Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Brand & Country Selector Strip */}
        <div className="max-w-[1200px] mx-auto pt-8 mt-8 border-t border-[#3a4553] flex flex-wrap items-center justify-center gap-6 text-xs text-[#cccccc]">
          <Link to="/" className="flex items-center gap-1 group">
            <span className="font-display font-black text-lg text-white">
              macho<span className="text-[#febd69]">beast</span>.in
            </span>
          </Link>
          <div className="flex items-center gap-2 border border-[#848688] rounded px-3 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <span>English</span>
          </div>
          <div className="flex items-center gap-2 border border-[#848688] rounded px-3 py-1 text-xs">
            <span>🇮🇳</span>
            <span>India</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip (#131921) */}
      <div className="bg-[#131921] py-8 px-4 text-center text-[11px] text-[#999999]">
        <div className="max-w-[1000px] mx-auto flex flex-wrap justify-center gap-x-4 gap-y-1 mb-2 font-medium">
          <Link to="/conditions" className="hover:underline">Conditions of Use & Sale</Link>
          <Link to="/privacy" className="hover:underline">Privacy Notice</Link>
          <Link to="/ads" className="hover:underline">Interest-Based Ads</Link>
        </div>
        <p>© 1996-2026, MachoBeast.in, Inc. or its affiliates</p>
        <p className="text-[10px] text-gray-500 mt-1">
          India's #1 Authentic Sports Nutrition & Fitness Supplements Marketplace
        </p>
      </div>
    </footer>
  );
};

export default Footer;
