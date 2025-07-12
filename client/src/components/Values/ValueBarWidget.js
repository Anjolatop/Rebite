import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Leaf, Heart, Star } from 'lucide-react';

const ValueBarWidget = () => {
  // Mock data - in real app this would come from API
  const valueBars = {
    sustainability: { level: 75, progress: 75, icon: Leaf, color: 'green' },
    health: { level: 60, progress: 60, icon: Heart, color: 'red' },
    community: { level: 85, progress: 85, icon: Star, color: 'yellow' },
    impact: { level: 90, progress: 90, icon: TrendingUp, color: 'blue' }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'blue':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-soft p-3 border border-gray-100"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Value Bars</span>
            <span className="text-xs text-gray-500">Avg: 77%</span>
          </div>
          
          <div className="space-y-1">
            {Object.entries(valueBars).map(([key, value]) => {
              const Icon = value.icon;
              const colorClass = getColorClasses(value.color);
              
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Icon className="w-3 h-3 text-gray-400" />
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className={`h-full ${colorClass} rounded-full`}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">
                    {value.level}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ValueBarWidget;