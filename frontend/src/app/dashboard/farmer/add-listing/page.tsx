'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ArrowLeft, 
  Upload, 
  Camera,
  Calendar,
  Leaf,
  DollarSign,
  Package,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    unit: 'kg',
    price: '',
    originalPrice: '',
    expiryDate: '',
    location: '',
    images: [] as File[],
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      vitamins: [] as string[]
    },
    organic: false,
    locallyGrown: false,
    pickupTime: '',
    pickupLocation: ''
  });

  const categories = [
    { id: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { id: 'fruits', label: 'Fruits', icon: '🍎' },
    { id: 'herbs', label: 'Herbs', icon: '🌿' },
    { id: 'grains', label: 'Grains', icon: '🌾' },
    { id: 'legumes', label: 'Legumes', icon: '🫘' },
    { id: 'nuts', label: 'Nuts & Seeds', icon: '🥜' }
  ];

  const units = [
    { id: 'kg', label: 'Kilograms (kg)' },
    { id: 'lb', label: 'Pounds (lb)' },
    { id: 'pieces', label: 'Pieces' },
    { id: 'bunches', label: 'Bunches' },
    { id: 'bags', label: 'Bags' }
  ];

  const vitamins = [
    { id: 'vitamin-a', label: 'Vitamin A' },
    { id: 'vitamin-c', label: 'Vitamin C' },
    { id: 'vitamin-d', label: 'Vitamin D' },
    { id: 'vitamin-e', label: 'Vitamin E' },
    { id: 'vitamin-k', label: 'Vitamin K' },
    { id: 'vitamin-b12', label: 'Vitamin B12' },
    { id: 'iron', label: 'Iron' },
    { id: 'calcium', label: 'Calcium' },
    { id: 'zinc', label: 'Zinc' },
    { id: 'magnesium', label: 'Magnesium' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleVitaminToggle = (vitaminId: string) => {
    setFormData(prev => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo,
        vitamins: prev.nutritionalInfo.vitamins.includes(vitaminId)
          ? prev.nutritionalInfo.vitamins.filter(id => id !== vitaminId)
          : [...prev.nutritionalInfo.vitamins, vitaminId]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting listing:', formData);
    alert('🎉 Listing created successfully! Your produce is now available to buyers.');
    router.push('/dashboard/farmer/listings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Rebite</span>
              </Link>
            </div>
            
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Listing</h1>
            <p className="text-gray-600">List your surplus produce and help reduce food waste</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Info className="w-5 h-5 mr-2 text-green-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Fresh Organic Tomatoes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Describe your produce, growing methods, freshness, etc."
                />
              </div>
            </div>

            {/* Pricing & Quantity */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Pricing & Quantity
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <select
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Unit *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="2.50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (for comparison)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="4.00"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-green-600" />
                Product Images
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-green-600 hover:text-green-700 font-medium">
                    Click to upload images
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                </label>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB each</p>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Expiry & Location */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Expiry & Location
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Green Valley Farm, Springfield"
                  />
                </div>
              </div>
            </div>

            {/* Nutritional Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                Nutritional Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calories (per 100g)
                  </label>
                  <input
                    type="number"
                    value={formData.nutritionalInfo.calories}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutritionalInfo: { ...prev.nutritionalInfo, calories: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.nutritionalInfo.protein}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutritionalInfo: { ...prev.nutritionalInfo, protein: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="2.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.nutritionalInfo.carbs}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutritionalInfo: { ...prev.nutritionalInfo, carbs: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="4.6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vitamins & Minerals
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {vitamins.map(vitamin => (
                    <label key={vitamin.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.nutritionalInfo.vitamins.includes(vitamin.id)}
                        onChange={() => handleVitaminToggle(vitamin.id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{vitamin.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.organic}
                    onChange={(e) => setFormData(prev => ({ ...prev, organic: e.target.checked }))}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">Certified Organic</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.locallyGrown}
                    onChange={(e) => setFormData(prev => ({ ...prev, locallyGrown: e.target.checked }))}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">Locally Grown</span>
                </label>
              </div>
            </div>

            {/* Pickup Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Pickup Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Time
                  </label>
                  <input
                    type="text"
                    value={formData.pickupTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, pickupTime: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., 9 AM - 6 PM, Monday to Friday"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Farm gate, Local market"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link
                href="/dashboard"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium"
              >
                Create Listing
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 