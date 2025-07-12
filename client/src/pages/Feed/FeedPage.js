import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  ShoppingCart,
  TrendingUp,
  Leaf,
  Award,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import ListingCard from '../../components/Listings/ListingCard';
import FilterModal from '../../components/Feed/FilterModal';
import SearchBar from '../../components/Feed/SearchBar';
import CategoryFilter from '../../components/Feed/CategoryFilter';
import ValueBarWidget from '../../components/Values/ValueBarWidget';
import PointsWidget from '../../components/Points/PointsWidget';

const FeedPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 100],
    distance: 10,
    rating: 0,
    dietary: [],
    vendorType: 'all'
  });

  const categories = [
    { id: 'all', name: 'All', icon: TrendingUp },
    { id: 'fruits', name: 'Fruits', icon: Leaf },
    { id: 'vegetables', name: 'Vegetables', icon: Leaf },
    { id: 'bakery', name: 'Bakery', icon: Award },
    { id: 'dairy', name: 'Dairy', icon: Zap },
    { id: 'meat', name: 'Meat & Fish', icon: Zap },
    { id: 'prepared', name: 'Prepared Food', icon: Award }
  ];

  // Fetch personalized feed
  const { data: feedData, isLoading, error, refetch } = useQuery(
    ['feed', searchQuery, selectedCategory, filters],
    () => api.get('/listings/feed', {
      params: {
        search: searchQuery,
        category: selectedCategory,
        ...filters
      }
    }),
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const listings = feedData?.data?.listings || [];
  const nearbyVendors = feedData?.data?.nearbyVendors || [];

  const handleAddToCart = async (listing) => {
    try {
      await addToCart(listing);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.profile?.first_name || 'Food Rescuer'}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Discover fresh food and support local vendors
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <ValueBarWidget />
              <PointsWidget />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar 
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search for food, vendors, or categories..."
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>

              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            {/* Listings Grid */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-soft p-6 animate-pulse"
                    >
                      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </motion.div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't load your feed. Please try again.
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Try Again
                  </button>
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No listings found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filters to find more food.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {listings.map((listing, index) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ListingCard
                          listing={listing}
                          onAddToCart={handleAddToCart}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Impact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Food Rescued</span>
                  <span className="text-lg font-semibold text-green-600">12 items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Money Saved</span>
                  <span className="text-lg font-semibold text-green-600">$45.20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CO₂ Saved</span>
                  <span className="text-lg font-semibold text-green-600">8.5 kg</span>
                </div>
              </div>
            </div>

            {/* Nearby Vendors */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Nearby Vendors
              </h3>
              <div className="space-y-3">
                {nearbyVendors.slice(0, 3).map((vendor) => (
                  <Link
                    key={vendor.id}
                    to={`/app/vendor/${vendor.id}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {vendor.display_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {vendor.display_name}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {vendor.distance}km away
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              {nearbyVendors.length > 3 && (
                <Link
                  to="/app/search?vendors=true"
                  className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-3"
                >
                  View all vendors
                </Link>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/app/recipes"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Recipe Suggestions
                  </span>
                </Link>
                <Link
                  to="/app/points"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Earn Points
                  </span>
                </Link>
                <Link
                  to="/app/values"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Value Bars
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default FeedPage;