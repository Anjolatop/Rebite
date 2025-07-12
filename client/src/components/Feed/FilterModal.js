import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, MapPin, DollarSign, Star, Leaf } from 'lucide-react';

const FilterModal = ({ isOpen, onClose, filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
    { id: 'vegan', label: 'Vegan', icon: Leaf },
    { id: 'gluten-free', label: 'Gluten-Free', icon: Leaf },
    { id: 'dairy-free', label: 'Dairy-Free', icon: Leaf },
    { id: 'organic', label: 'Organic', icon: Leaf },
    { id: 'local', label: 'Local', icon: MapPin }
  ];

  const vendorTypes = [
    { id: 'all', label: 'All Vendors' },
    { id: 'farmer', label: 'Farmers' },
    { id: 'restaurant', label: 'Restaurants' }
  ];

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      priceRange: [0, 100],
      distance: 10,
      rating: 0,
      dietary: [],
      vendorType: 'all'
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handlePriceChange = (index, value) => {
    const newPriceRange = [...localFilters.priceRange];
    newPriceRange[index] = parseInt(value);
    setLocalFilters({ ...localFilters, priceRange: newPriceRange });
  };

  const handleDietaryToggle = (dietaryId) => {
    const newDietary = localFilters.dietary.includes(dietaryId)
      ? localFilters.dietary.filter(id => id !== dietaryId)
      : [...localFilters.dietary, dietaryId];
    setLocalFilters({ ...localFilters, dietary: newDietary });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Sliders className="w-5 h-5 text-gray-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Filters
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Price Range
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">
                            Min Price
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={localFilters.priceRange[0]}
                            onChange={(e) => handlePriceChange(0, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">
                            Max Price
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={localFilters.priceRange[1]}
                            onChange={(e) => handlePriceChange(1, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <div className="h-2 bg-gray-200 rounded-lg">
                          <div
                            className="h-2 bg-primary-500 rounded-lg"
                            style={{
                              width: `${((localFilters.priceRange[1] - localFilters.priceRange[0]) / 100) * 100}%`,
                              marginLeft: `${(localFilters.priceRange[0] / 100) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Distance */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Distance (km)
                    </h4>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={localFilters.distance}
                      onChange={(e) => setLocalFilters({ ...localFilters, distance: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1km</span>
                      <span>{localFilters.distance}km</span>
                      <span>50km</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Minimum Rating
                    </h4>
                    <div className="flex space-x-2">
                      {[0, 1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setLocalFilters({ ...localFilters, rating })}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            localFilters.rating === rating
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {rating === 0 ? 'Any' : `${rating}+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dietary Preferences */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Leaf className="w-4 h-4 mr-2" />
                      Dietary Preferences
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {dietaryOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = localFilters.dietary.includes(option.id);
                        
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleDietaryToggle(option.id)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                              isSelected
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vendor Type */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Vendor Type
                    </h4>
                    <div className="space-y-2">
                      {vendorTypes.map((type) => (
                        <label
                          key={type.id}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="vendorType"
                            value={type.id}
                            checked={localFilters.vendorType === type.id}
                            onChange={(e) => setLocalFilters({ ...localFilters, vendorType: e.target.value })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <span className="text-sm text-gray-700">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleApplyFilters}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleReset}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;