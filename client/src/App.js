import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import FeedPage from './pages/Feed/FeedPage';
import ListingDetailPage from './pages/Listings/ListingDetailPage';
import ProfilePage from './pages/Profile/ProfilePage';
import VendorDashboardPage from './pages/Vendor/VendorDashboardPage';
import VendorProfilePage from './pages/Vendor/VendorProfilePage';
import OrdersPage from './pages/Orders/OrdersPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import PointsPage from './pages/Points/PointsPage';
import ValuesPage from './pages/Values/ValuesPage';
import RecipesPage from './pages/Recipes/RecipesPage';
import SearchPage from './pages/Search/SearchPage';
import NotFoundPage from './pages/NotFoundPage';

import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Rebite - Smart Food Rescue Platform</title>
        <meta name="description" content="AI-powered food rescue platform connecting farmers and restaurants with consumers" />
        <meta name="keywords" content="food rescue, sustainability, local food, food waste, farmers, restaurants" />
        <meta property="og:title" content="Rebite - Smart Food Rescue Platform" />
        <meta property="og:description" content="AI-powered food rescue platform connecting farmers and restaurants with consumers" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rebite.com" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rebite - Smart Food Rescue Platform" />
        <meta name="twitter:description" content="AI-powered food rescue platform connecting farmers and restaurants with consumers" />
        <meta name="twitter:image" content="/og-image.jpg" />
      </Helmet>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route path="/app" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/app/feed" replace />} />
          <Route path="feed" element={<FeedPage />} />
          <Route path="listing/:id" element={<ListingDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="points" element={<PointsPage />} />
          <Route path="values" element={<ValuesPage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="search" element={<SearchPage />} />
          
          {/* Vendor Routes */}
          <Route path="vendor" element={<ProtectedRoute requireRole="vendor" />}>
            <Route index element={<Navigate to="/app/vendor/dashboard" replace />} />
            <Route path="dashboard" element={<VendorDashboardPage />} />
            <Route path="profile" element={<VendorProfilePage />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;