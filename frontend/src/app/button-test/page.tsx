'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ButtonTestPage() {
  const handleTestClick = () => {
    alert('Test button clicked!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          🧪 Button Test Page
        </h1>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Navigation Links</h2>
            <div className="space-y-4">
              <Link 
                href="/"
                className="block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go to Homepage
              </Link>
              
              <Link 
                href="/auth/register"
                className="block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                Go to Registration
              </Link>
              
              <Link 
                href="/auth/login"
                className="block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Regular Buttons</h2>
            <div className="space-y-4">
              <button 
                onClick={handleTestClick}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                Test Button (Alert)
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTestClick}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Animated Test Button
              </motion.button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Form Test</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Form submitted!');
            }}>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  Submit Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 