import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { VendorLayout } from '../layouts/VendorLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

import { HomePage } from '../pages/user/HomePage';
import { LoginPage } from '../pages/user/LoginPage';
import { RegisterPage } from '../pages/user/RegisterPage';
import { ProductDetailPage } from '../pages/user/ProductDetailPage';
import { CartPage } from '../pages/user/CartPage';
import { CheckoutPage } from '../pages/user/CheckoutPage';
import { MyOrdersPage } from '../pages/user/MyOrdersPage';

import { VendorDashboardPage } from '../pages/vendor/VendorDashboardPage';
import { VendorOrdersPage } from '../pages/vendor/VendorOrdersPage';
import { VendorProductsPage } from '../pages/vendor/VendorProductsPage';

import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminTransfersPage } from '../pages/admin/AdminTransfersPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminProductFormPage } from '../pages/admin/AdminProductFormPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminPaymentMethodsPage } from '../pages/admin/AdminPaymentMethodsPage';
import { AdminCartsPage } from '../pages/admin/AdminCartsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminVendorsPage } from '../pages/admin/AdminVendorsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
      { path: 'orders', element: <ProtectedRoute><MyOrdersPage /></ProtectedRoute> },
    ]
  },
  {
    path: '/vendor',
    element: <ProtectedRoute allowedRoles={['VENDEDOR']}><VendorLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <VendorDashboardPage /> },
      { path: 'orders', element: <VendorOrdersPage /> },
      { path: 'products', element: <VendorProductsPage /> },
      { path: 'warehouse', element: <VendorProductsPage /> },
      { path: 'transfers', element: <VendorProductsPage /> },
    ]
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['SUPERADMIN']}><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'transfers', element: <AdminTransfersPage /> },
      { path: 'products', element: <AdminProductsPage /> },
      { path: 'products/new', element: <AdminProductFormPage /> },
      { path: 'products/edit/:id', element: <AdminProductFormPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'payment-methods', element: <AdminPaymentMethodsPage /> },
      { path: 'carts', element: <AdminCartsPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'vendors', element: <AdminVendorsPage /> },
    ]
  }
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
