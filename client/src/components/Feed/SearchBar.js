import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onChange(inputValue);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, onChange]);

  // Sync with external value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const suggestions = [
    'Fresh tomatoes',
    'Organic bread',
    'Local vegetables',
    'Artisan cheese',
    'Farm fresh eggs',
    'Homemade pasta',
    'Seasonal fruits'
  ];

  const recentSearches = [
    'Organic vegetables',
    'Fresh bread',
    'Local dairy'
  ];

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(inputValue.length > 0);
          }}
          onBlur={() => {
            setIsFocused(false);
            // Delay hiding suggestions to allow clicking on them
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder={placeholder}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center text-xs font-medium text-gray-500 mb-2">
                  <Clock className="w-3 h-3 mr-1" />
                  Recent searches
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors duration-200"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Suggestions */}
            <div className="p-3">
              <div className="flex items-center text-xs font-medium text-gray-500 mb-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                Popular searches
              </div>
              <div className="space-y-1">
                {suggestions
                  .filter(suggestion => 
                    suggestion.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;