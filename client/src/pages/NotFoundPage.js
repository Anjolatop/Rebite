import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Rebite</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 404 Illustration */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-8"
            >
              <span className="text-white font-bold text-4xl">404</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Oops! Page not found
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-600 mb-8"
            >
              The page you're looking for doesn't exist or has been moved. 
              Don't worry, there's plenty of delicious food to discover!
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Link>
                
                <Link
                  to="/app/feed"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Browse Food
                </Link>
              </div>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Go back
              </button>
            </motion.div>

            {/* Fun Facts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 p-6 bg-white rounded-xl shadow-soft"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                While you're here...
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>🌱 Every rescued food item saves 2.5kg of CO₂</p>
                <p>💰 Users save an average of $45 per month</p>
                <p>🏆 Join thousands making a difference</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;