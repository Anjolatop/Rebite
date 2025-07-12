'use client';

import { motion } from 'framer-motion';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            🎨 <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Styling Test Page
            </span>
          </h1>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-2">Gradient Background</h2>
              <p>This should have an orange-to-red gradient background with white text.</p>
            </div>
            
            <div className="bg-white border-2 border-orange-200 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">White Card</h2>
              <p className="text-gray-600">This should have a white background with orange border.</p>
            </div>
            
            <div className="flex gap-4">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                Gradient Button
              </button>
              <button className="border-2 border-orange-200 text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200">
                Outline Button
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-100 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800">Orange Card 1</h3>
              </div>
              <div className="bg-red-100 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800">Red Card 2</h3>
              </div>
              <div className="bg-amber-100 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800">Amber Card 3</h3>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>If you can see this styled content, Tailwind CSS is working correctly!</strong>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              If this looks plain or unstyled, there might be a CSS loading issue.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 