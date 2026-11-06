import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { OAuthCallbackPage } from '../pages/OAuthCallbackPage';
import { ShopPage } from '../pages/ShopPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { BrandsPage } from '../pages/BrandsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Core Shopping Routes */}
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />

        {/* Auth Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="oauth-callback" element={<OAuthCallbackPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />

        {/* Admin Routes — requires login + admin role */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
