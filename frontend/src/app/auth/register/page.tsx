'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    console.log('Form submission started');
    e.preventDefault();
    console.log('Default prevented');
    // TODO: Implement registration logic
    console.log('Register:', formData);
    console.log('Form submitted successfully!');
    
    // Show success message and navigate to login
    alert('🎉 Registration successful! You will be redirected to the login page.');
    
    // Navigate to login page after a short delay
    setTimeout(() => {
      router.push('/auth/login');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const benefits = [
    "Join the food rescue movement",
    "Get exclusive vendor discounts",
    "Track your environmental impact",
    "Earn rewards for saving food"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Rebite</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-orange-600 transition-colors">
                Features
              </Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-orange-600 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="mb-8">
              <Link 
                href="/"
                className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Join the Food Rescue Movement
              </h1>
              <p className="text-gray-600">
                Create your account and start making a difference today.
              </p>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  console.log('Button clicked!');
                  alert('Button clicked!');
                }}
              >
                Create Account
              </motion.button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.form>
          </motion.div>
        </div>

        {/* Right Side - Benefits */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-500 to-red-500 items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-md text-white"
          >
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Join Thousands of Food Rescuers
              </h2>
              <p className="text-orange-100 text-lg leading-relaxed">
                Be part of a community dedicated to reducing food waste and building stronger, more sustainable communities.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-orange-200 flex-shrink-0" />
                  <span className="text-orange-100">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-2xl">
              <h3 className="font-semibold mb-2">Why Join Rebite?</h3>
              <p className="text-orange-100 text-sm">
                Connect with local vendors, discover fresh food at great prices, and make a positive impact on the environment - all in one platform.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 