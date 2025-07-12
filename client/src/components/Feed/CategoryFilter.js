import React from 'react';
import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="mt-4">
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const Icon = category.icon;

          return (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{category.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;