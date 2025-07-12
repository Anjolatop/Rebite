import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings, 
  Award, 
  Star, 
  Leaf, 
  TrendingUp,
  Edit,
  Camera
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - in real app this would come from API
  const stats = {
    totalOrders: 24,
    totalSpent: 156.80,
    foodRescued: 48,
    co2Saved: 120.5,
    pointsEarned: 1250,
    favoriteVendors: 8
  };

  const achievements = [
    { id: 1, name: 'First Rescue', description: 'Completed your first food rescue', icon: Award, earned: true },
    { id: 2, name: 'Eco Warrior', description: 'Saved 100kg of CO₂', icon: Leaf, earned: true },
    { id: 3, name: 'Local Hero', description: 'Supported 10 local vendors', icon: Star, earned: false },
    { id: 4, name: 'Value Master', description: 'Reached 90% in all value bars', icon: TrendingUp, earned: false }
  ];

  return (
    <>
      <Helmet>
        <title>Profile - Rebite</title>
        <meta name="description" content="Manage your Rebite profile and view your impact statistics." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-soft p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.profile?.first_name?.charAt(0) || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.profile?.first_name} {user?.profile?.last_name}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active Member
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    Member since {new Date(user?.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        defaultValue={user?.profile?.first_name}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        defaultValue={user?.profile?.last_name}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-500 bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      defaultValue={user?.profile?.phone}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.foodRescued}</div>
                    <div className="text-sm text-gray-600">Items Rescued</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.co2Saved}kg</div>
                    <div className="text-sm text-gray-600">CO₂ Saved</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">${stats.totalSpent}</div>
                    <div className="text-sm text-gray-600">Money Saved</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.pointsEarned}</div>
                    <div className="text-sm text-gray-600">Points Earned</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stats.totalOrders}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{stats.favoriteVendors}</div>
                    <div className="text-sm text-gray-600">Favorite Vendors</div>
                  </div>
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.earned
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            achievement.earned
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-500'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                          {achievement.earned && (
                            <Award className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Account Settings</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">View Badges</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Favorite Vendors</span>
                    </div>
                  </button>
                </div>
              </motion.div>

              {/* Preferences */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-soft p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Email Notifications</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">SMS Notifications</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Push Notifications</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;