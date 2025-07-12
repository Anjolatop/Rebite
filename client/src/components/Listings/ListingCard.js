import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  ShoppingCart,
  Leaf,
  Award,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const ListingCard = ({ listing, onAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const formatPrice = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatOriginalPrice = (cents) => {
    if (!cents) return null;
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'fruits':
      case 'vegetables':
        return Leaf;
      case 'bakery':
      case 'prepared':
        return Award;
      default:
        return Zap;
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'fruits':
      case 'vegetables':
        return 'text-green-600 bg-green-100';
      case 'bakery':
        return 'text-yellow-600 bg-yellow-100';
      case 'dairy':
        return 'text-blue-600 bg-blue-100';
      case 'meat':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await onAddToCart(listing);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const CategoryIcon = getCategoryIcon(listing.category);
  const categoryColor = getCategoryColor(listing.category);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-200"
    >
      {/* Image Section */}
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          {listing.image_urls && listing.image_urls.length > 0 ? (
            <img
              src={listing.image_urls[0]}
              alt={listing.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <CategoryIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {listing.rescue_score > 0 && (
            <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {listing.rescue_score}% OFF
            </div>
          )}
          {listing.quantity_available <= 3 && (
            <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Limited
            </div>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
        >
          <Heart
            className={`w-5 h-5 ${
              isLiked ? 'text-red-500 fill-current' : 'text-gray-400'
            }`}
          />
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
            <CategoryIcon className="w-3 h-3 mr-1" />
            {listing.category}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Vendor */}
        <div className="mb-3">
          <Link
            to={`/app/listing/${listing.id}`}
            className="block"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors duration-200">
              {listing.title}
            </h3>
          </Link>
          
          <Link
            to={`/app/vendor/${listing.vendor_id}`}
            className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <MapPin className="w-3 h-3 mr-1" />
            {listing.vendor?.display_name || 'Local Vendor'}
          </Link>
        </div>

        {/* Description */}
        {listing.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {listing.description}
          </p>
        )}

        {/* Tags */}
        {listing.tags && listing.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Rating and Distance */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {listing.vendor?.rating || 4.5}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Expires in {Math.ceil((new Date(listing.expires_at) - new Date()) / (1000 * 60 * 60 * 24))} days</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(listing.price_cents)}
            </span>
            {listing.original_price_cents && (
              <span className="text-sm text-gray-500 line-through">
                {formatOriginalPrice(listing.original_price_cents)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || listing.quantity_available === 0}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isAddingToCart ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add
              </>
            )}
          </button>
        </div>

        {/* Quantity Available */}
        {listing.quantity_available <= 5 && (
          <div className="mt-2 text-xs text-orange-600">
            Only {listing.quantity_available} left!
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ListingCard;