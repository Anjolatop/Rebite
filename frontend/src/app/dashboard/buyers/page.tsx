'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ArrowLeft, 
  Search,
  Filter,
  MapPin,
  Clock,
  Star,
  Leaf,
  Utensils,
  ShoppingBag,
  Eye,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

// Mock data - in real app this would come from API
const mockListings = [
  {
    id: '1',
    type: 'farmer',
    title: 'Fresh Organic Tomatoes',
    description: 'Locally grown organic tomatoes, perfect for salads and cooking',
    price: 2.50,
    originalPrice: 4.00,
    quantity: '5kg',
    location: 'Green Valley Farm',
    distance: '2.3 km',
    rating: 4.8,
    reviews: 24,
    expiryDate: '2024-01-15',
    image: '/api/placeholder/300/200',
    category: 'vegetables',
    organic: true,
    locallyGrown: true,
    nutritionalInfo: {
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fiber: 1.2
    }
  },
  {
    id: '2',
    type: 'restaurant',
    title: 'Grilled Salmon with Vegetables',
    description: 'Fresh grilled salmon with seasonal roasted vegetables',
    price: 8.50,
    originalPrice: 15.00,
    quantity: '2 servings',
    location: 'Fresh Bites Restaurant',
    distance: '1.8 km',
    rating: 4.9,
    reviews: 156,
    expiryDate: '2024-01-14',
    expiryTime: '20:00',
    image: '/api/placeholder/300/200',
    category: 'main-course',
    isHot: true,
    isVegetarian: false,
    nutritionalInfo: {
      calories: 450,
      protein: 35,
      carbs: 25,
      fat: 22
    }
  },
  {
    id: '3',
    type: 'farmer',
    title: 'Mixed Organic Greens',
    description: 'Fresh mixed salad greens including spinach, kale, and arugula',
    price: 3.00,
    originalPrice: 5.50,
    quantity: '3 bunches',
    location: 'Sunny Meadows Farm',
    distance: '4.1 km',
    rating: 4.7,
    reviews: 18,
    expiryDate: '2024-01-16',
    image: '/api/placeholder/300/200',
    category: 'vegetables',
    organic: true,
    locallyGrown: true,
    nutritionalInfo: {
      calories: 25,
      protein: 2.1,
      carbs: 4.2,
      fiber: 2.8
    }
  },
  {
    id: '4',
    type: 'restaurant',
    title: 'Vegetarian Pasta Primavera',
    description: 'Fresh pasta with seasonal vegetables in light cream sauce',
    price: 6.50,
    originalPrice: 12.00,
    quantity: '3 servings',
    location: 'Garden Fresh Eatery',
    distance: '3.2 km',
    rating: 4.6,
    reviews: 89,
    expiryDate: '2024-01-14',
    expiryTime: '19:30',
    image: '/api/placeholder/300/200',
    category: 'pasta',
    isHot: true,
    isVegetarian: true,
    nutritionalInfo: {
      calories: 380,
      protein: 12,
      carbs: 45,
      fat: 15
    }
  }
];

export default function BuyersPage() {
  const [listings, setListings] = useState(mockListings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { id: 'fruits', label: 'Fruits', icon: '🍎' },
    { id: 'main-course', label: 'Main Course', icon: '🍽️' },
    { id: 'pasta', label: 'Pasta', icon: '🍝' },
    { id: 'salad', label: 'Salad', icon: '🥗' },
    { id: 'dessert', label: 'Dessert', icon: '🍰' }
  ];

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'farmer', label: 'Farm Produce', icon: '🌾' },
    { id: 'restaurant', label: 'Restaurant Meals', icon: '🍽️' }
  ];

  const sortOptions = [
    { id: 'distance', label: 'Distance' },
    { id: 'price', label: 'Price' },
    { id: 'rating', label: 'Rating' },
    { id: 'expiry', label: 'Expiry Date' }
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || listing.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'expiry':
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      default:
        return 0;
    }
  });

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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Fresh Food</h1>
          <p className="text-gray-600">Discover local farmers and restaurants with surplus food</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for food..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedListings.map((listing, index) => (
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
                  {listing.type === 'farmer' ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Leaf className="w-3 h-3 mr-1" />
                      Farm Fresh
                    </span>
                  ) : (
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Utensils className="w-3 h-3 mr-1" />
                      Restaurant
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExpiryColor(getDaysUntilExpiry(listing.expiryDate))}`}>
                    {getDaysUntilExpiry(listing.expiryDate)} days left
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {listing.title}
                  </h3>
                  <div className="flex items-center text-yellow-500 ml-2">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{listing.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {listing.description}
                </p>

                {/* Nutritional Info */}
                <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                  <span>Calories: {listing.nutritionalInfo.calories}</span>
                  <span>Protein: {listing.nutritionalInfo.protein}g</span>
                  <span>Carbs: {listing.nutritionalInfo.carbs}g</span>
                </div>

                {/* Location and Distance */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{listing.location}</span>
                  </div>
                  <span className="text-sm text-gray-500">{listing.distance}</span>
                </div>

                {/* Price and Quantity */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-green-600">${listing.price}</span>
                    {listing.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${listing.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{listing.quantity}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Order Now
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {sortedListings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 