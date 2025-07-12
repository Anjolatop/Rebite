import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, User, Settings } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ navigation, isOpen, onClose, isActive }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <Link to="/app/feed" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rebite</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || 'consumer'}
                </p>
              </div>
            </div>
            
            <div className="mt-4 space-y-1">
              <Link
                to="/app/profile"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <Link to="/app/feed" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Rebite</span>
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={onClose}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* User profile */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role || 'consumer'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-1">
                  <Link
                    to="/app/profile"
                    onClick={onClose}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;