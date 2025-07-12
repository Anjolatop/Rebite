import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Search, Bell, ShoppingCart } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext';

const Header = ({ onMenuClick, navigation, isActive }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search bar */}
            <div className="hidden sm:block ml-4 flex-1 max-w-lg">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rescued food..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </form>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Mobile search button */}
            <button
              onClick={() => navigate('/app/search')}
              className="sm:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              to="/app/cart"
              className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Bell className="w-5 h-5" />
            </button>

            {/* User avatar */}
            <Link
              to="/app/profile"
              className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="sm:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rescued food..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
        </form>
      </div>
    </header>
  );
};

export default Header;