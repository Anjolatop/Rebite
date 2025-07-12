'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  User, 
  ShoppingBag, 
  Leaf, 
  Utensils, 
  Settings,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock user data - in real app this would come from authentication
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'buyer', // 'buyer', 'farmer', 'restaurant'
  avatar: '/api/placeholder/40/40',
  nutritionProfile: {
    dietaryGoals: ['weight-loss', 'heart-health'],
    allergies: ['nuts', 'gluten'],
    preferences: ['high-protein', 'low-carb'],
    fitnessTracker: 'fitbit'
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(mockUser);
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect to nutrition profile if not completed
  useEffect(() => {
    if (!user.nutritionProfile) {
      router.push('/nutrition-profile');
    }
  }, [user, router]);

  const renderBuyerDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-orange-100">Discover fresh, healthy food that matches your nutrition goals.</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Fresh Today</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Farm Fresh Produce</h3>
          <p className="text-gray-600 text-sm mb-4">Local farmers with surplus vegetables</p>
          <Link 
            href="/dashboard/farmers"
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            Browse Farms →
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Utensils className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Ready to Eat</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Restaurant Meals</h3>
          <p className="text-gray-600 text-sm mb-4">Fresh meals from local restaurants</p>
          <Link 
            href="/dashboard/restaurants"
            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            Browse Restaurants →
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Personalized</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Recommended for You</h3>
          <p className="text-gray-600 text-sm mb-4">Based on your nutrition profile</p>
          <Link 
            href="/dashboard/recommendations"
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            View Recommendations →
          </Link>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Ordered fresh vegetables from Green Valley Farm</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Utensils className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Reserved healthy meal from Fresh Bites Restaurant</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderFarmerDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}! 🌾</h1>
        <p className="text-green-100">Manage your farm listings and track your impact.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Listings</p>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Orders Today</p>
              <p className="text-2xl font-bold text-blue-600">8</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-purple-600">$1,240</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Food Saved</p>
              <p className="text-2xl font-bold text-orange-600">156kg</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              href="/dashboard/farmer/add-listing"
              className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">Add New Listing</span>
            </Link>
            <Link 
              href="/dashboard/farmer/inventory"
              className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Leaf className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium">Manage Inventory</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Fresh Tomatoes</p>
                <p className="text-xs text-gray-500">Ordered by Sarah M.</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Organic Carrots</p>
                <p className="text-xs text-gray-500">Ordered by Mike R.</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderRestaurantDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}! 🍽️</h1>
        <p className="text-orange-100">Manage your restaurant listings and reduce food waste.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Meals</p>
              <p className="text-2xl font-bold text-orange-600">15</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Utensils className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Orders Today</p>
              <p className="text-2xl font-bold text-blue-600">23</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-purple-600">$2,450</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Food Saved</p>
              <p className="text-2xl font-bold text-green-600">89kg</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              href="/dashboard/restaurant/add-meal"
              className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Plus className="w-5 h-5 text-orange-600" />
              <span className="text-orange-700 font-medium">Add New Meal</span>
            </Link>
            <Link 
              href="/dashboard/restaurant/inventory"
              className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Utensils className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium">Manage Inventory</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Grilled Salmon</p>
                <p className="text-xs text-gray-500">Ordered by John D.</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Vegetable Pasta</p>
                <p className="text-xs text-gray-500">Ordered by Lisa K.</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Preparing</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Rebite</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'buyer' && renderBuyerDashboard()}
        {user.role === 'farmer' && renderFarmerDashboard()}
        {user.role === 'restaurant' && renderRestaurantDashboard()}
      </div>
    </div>
  );
} 