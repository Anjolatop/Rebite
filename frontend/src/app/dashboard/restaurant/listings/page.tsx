'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ArrowLeft, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Utensils,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import Link from 'next/link';

// Mock data - in real app this would come from API
const mockListings = [
  {
    id: '1',
    title: 'Grilled Salmon with Vegetables',
    description: 'Fresh grilled salmon with seasonal roasted vegetables',
    price: 8.50,
    originalPrice: 15.00,
    servings: 2,
    soldServings: 1,
    location: 'Fresh Bites Restaurant',
    expiryDate: '2024-01-14',
    expiryTime: '20:00',
    status: 'active',
    views: 89,
    orders: 5,
    image: '/api/placeholder/300/200',
    category: 'main-course',
    isHot: true,
    isVegetarian: false
  },
  {
    id: '2',
    title: 'Vegetarian Pasta Primavera',
    description: 'Fresh pasta with seasonal vegetables in light cream sauce',
    price: 6.50,
    originalPrice: 12.00,
    servings: 3,
    soldServings: 2,
    location: 'Fresh Bites Restaurant',
    expiryDate: '2024-01-14',
    expiryTime: '19:30',
    status: 'active',
    views: 67,
    orders: 3,
    image: '/api/placeholder/300/200',
    category: 'pasta',
    isHot: true,
    isVegetarian: true
  },
  {
    id: '3',
    title: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
    price: 4.50,
    originalPrice: 8.00,
    servings: 4,
    soldServings: 0,
    location: 'Fresh Bites Restaurant',
    expiryDate: '2024-01-13',
    expiryTime: '21:00',
    status: 'expired',
    views: 34,
    orders: 0,
    image: '/api/placeholder/300/200',
    category: 'dessert',
    isHot: false,
    isVegetarian: true
  }
];

export default function RestaurantListingsPage() {
  const [listings, setListings] = useState(mockListings);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryColor = (days: number) => {
    if (days <= 1) return 'text-red-600 bg-red-100';
    if (days <= 3) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredListings = selectedStatus === 'all' 
    ? listings 
    : listings.filter(listing => listing.status === selectedStatus);

  const handleDeleteListing = (id: string) => {
    if (confirm('Are you sure you want to delete this meal listing?')) {
      setListings(prev => prev.filter(listing => listing.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Rebite</span>
              </Link>
            </div>
            
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Meal Listings</h1>
            <p className="text-gray-600">Manage your restaurant meal listings</p>
          </div>
          <Link
            href="/dashboard/restaurant/add-meal"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Meal
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Meals</p>
                <p className="text-2xl font-bold text-orange-600">
                  {listings.filter(l => l.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Utensils className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-2xl font-bold text-blue-600">
                  {listings.reduce((sum, l) => sum + l.views, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-purple-600">
                  {listings.reduce((sum, l) => sum + l.orders, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${listings.reduce((sum, l) => sum + (l.price * l.orders), 0).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({listings.length})
            </button>
            <button
              onClick={() => setSelectedStatus('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'active'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active ({listings.filter(l => l.status === 'active').length})
            </button>
            <button
              onClick={() => setSelectedStatus('expired')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'expired'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expired ({listings.filter(l => l.status === 'expired').length})
            </button>
          </div>
        </motion.div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                    {listing.status === 'active' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                    {listing.status === 'expired' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                    {listing.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExpiryColor(getDaysUntilExpiry(listing.expiryDate))}`}>
                    {getDaysUntilExpiry(listing.expiryDate)} days left
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    listing.isHot ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {listing.isHot ? 'Hot' : 'Cold'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {listing.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {listing.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="text-sm font-semibold text-gray-900">{listing.views}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Orders</p>
                    <p className="text-sm font-semibold text-gray-900">{listing.orders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sold</p>
                    <p className="text-sm font-semibold text-gray-900">{listing.soldServings}</p>
                  </div>
                </div>

                {/* Price and Servings */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xl font-bold text-orange-600">${listing.price}</span>
                    {listing.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${listing.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{listing.servings} servings</span>
                </div>

                {/* Expiry Time */}
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Expires at {listing.expiryTime}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteListing(listing.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredListings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meal listings found</h3>
            <p className="text-gray-600 mb-4">Create your first meal listing to start reducing food waste</p>
            <Link
              href="/dashboard/restaurant/add-meal"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Meal
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
} 