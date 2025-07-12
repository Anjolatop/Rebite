import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';

const PointsWidget = () => {
  // Mock data - in real app this would come from API
  const pointsData = {
    balance: 1250,
    todayEarned: 45,
    weeklyGoal: 200,
    weeklyProgress: 180
  };

  const progressPercentage = (pointsData.weeklyProgress / pointsData.weeklyGoal) * 100;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg shadow-soft p-3 border border-gray-100"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Points</span>
            <span className="text-xs text-green-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{pointsData.todayEarned}
            </span>
          </div>
          
          <div className="text-lg font-bold text-gray-900">
            {pointsData.balance.toLocaleString()}
          </div>
          
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Weekly Goal</span>
              <span>{pointsData.weeklyProgress}/{pointsData.weeklyGoal}</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PointsWidget;