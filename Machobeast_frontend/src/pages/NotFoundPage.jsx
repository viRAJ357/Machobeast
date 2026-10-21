import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
        <Dumbbell className="w-8 h-8" />
      </div>
      <h1 className="font-display font-black text-6xl text-slate-900 mb-2">404</h1>
      <h2 className="font-display font-bold text-xl text-gray-800 mb-3">
        Page Not Found
      </h2>
      <p className="text-sm text-gray-500 max-w-md mb-8">
        The page or supplement category you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-black hover:bg-slate-900 text-amber-400 font-bold px-6 py-3 rounded-lg shadow-md flex items-center gap-2 text-sm uppercase tracking-wider transition-all"
      >
        <Home className="w-4 h-4" /> Return to Homepage
      </Link>
    </div>
  );
};
