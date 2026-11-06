import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, Home, LogIn } from 'lucide-react';
import { useSelector } from 'react-redux';

export const UnauthorizedPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center">
            <ShieldX className="w-12 h-12 text-red-400" />
          </div>
        </div>

        {/* Badge */}
        <span className="inline-block bg-red-900/40 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/30 uppercase tracking-wider mb-4">
          403 — Access Denied
        </span>

        {/* Title */}
        <h1 className="text-3xl font-black text-white mb-3">
          Admins Only
        </h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          You don't have permission to access this page.
          This area is restricted to MachoBeast administrators only.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm px-6 py-3 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          {!isAuthenticated && (
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm px-6 py-3 rounded-xl border border-slate-700 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

