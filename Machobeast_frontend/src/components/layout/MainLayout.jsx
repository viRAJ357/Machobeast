import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Navbar } from './Navbar';
import { CategoryNav } from './CategoryNav';
import { Footer } from './Footer';
import { FloatingCartDropZone } from '../cart/FloatingCartDropZone';
import { fetchProductsThunk } from '../../redux/slices/productSlice';

export const MainLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductsThunk());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#eaeded]">
      <Navbar />
      <CategoryNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatingCartDropZone />
      <Footer />
    </div>
  );
};
