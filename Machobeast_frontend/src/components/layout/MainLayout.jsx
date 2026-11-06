import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar } from './Navbar';
import { CategoryNav } from './CategoryNav';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { FloatingCartDropZone } from '../cart/FloatingCartDropZone';
import { fetchProductsThunk } from '../../redux/slices/productSlice';
import { fetchUserCart } from '../../redux/slices/cartSlice';

export const MainLayout = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProductsThunk());
    if (isAuthenticated) {
      dispatch(fetchUserCart());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-[#eaeded] pb-14 md:pb-0">
      <Navbar />
      <CategoryNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatingCartDropZone />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default MainLayout;
