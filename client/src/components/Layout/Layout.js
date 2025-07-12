import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  ShoppingBag, 
  User, 
  Heart, 
  Gift, 
  Search, 
  Menu, 
  X,
  ShoppingCart,
  TrendingUp,
  BookOpen,
  Settings,
  LogOut
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Feed', href: '/app/feed', icon: Home },
    { name: 'Search', href: '/app/search', icon: Search },
    { name: 'Cart', href: '/app/cart', icon: ShoppingCart, badge: itemCount },
    { name: 'Orders', href: '/app/orders', icon: ShoppingBag },
    { name: 'Points', href: '/app/points', icon: Gift },
    { name: 'Values', href: '/app/values', icon: TrendingUp },
    { name: 'Recipes', href: '/app/recipes', icon: BookOpen },
    { name: 'Profile', href: '/app/profile', icon: User },
  ];

  // Add vendor navigation if user is a vendor
  if (user?.role === 'vendor') {
    navigation.push(
      { name: 'Vendor Dashboard', href: '/app/vendor/dashboard', icon: Settings }
    );
  }

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        navigation={navigation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isActive={isActive}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          navigation={navigation}
          isActive={isActive}
        />

        {/* Page content */}
        <main className="min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;