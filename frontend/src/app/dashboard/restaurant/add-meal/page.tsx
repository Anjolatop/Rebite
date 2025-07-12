'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ArrowLeft, 
  Upload, 
  Camera,
  Calendar,
  Utensils,
  DollarSign,
  Package,
  Info,
  Clock,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddMealPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    servings: '',
    price: '',
    originalPrice: '',
    expiryDate: '',
    expiryTime: '',
    location: '',
    images: [] as File[],
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      sodium: '',
      allergens: [] as string[]
    },
    dietaryTags: [] as string[],
    ingredients: '',
    cookingMethod: '',
    servingSize: '',
    preparationTime: '',
    isHot: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    pickupTime: '',
    pickupLocation: ''
  });

  const categories = [
    { id: 'main-course', label: 'Main Course', icon: '🍽️' },
    { id: 'appetizer', label: 'Appetizer', icon: '🥗' },
    { id: 'dessert', label: 'Dessert', icon: '🍰' },
    { id: 'soup', label: 'Soup', icon: '🥣' },
    { id: 'salad', label: 'Salad', icon: '🥬' },
    { id: 'sandwich', label: 'Sandwich', icon: '🥪' },
    { id: 'pasta', label: 'Pasta', icon: '🍝' },
    { id: 'seafood', label: 'Seafood', icon: '🐟' },
    { id: 'meat', label: 'Meat', icon: '🥩' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥕' }
  ];

  const allergens = [
    { id: 'nuts', label: 'Tree Nuts', icon: '🥜' },
    { id: 'peanuts', label: 'Peanuts', icon: '🥜' },
    { id: 'dairy', label: 'Dairy', icon: '🥛' },
    { id: 'eggs', label: 'Eggs', icon: '🥚' },
    { id: 'soy', label: 'Soy', icon: '🫘' },
    { id: 'wheat', label: 'Wheat/Gluten', icon: '🌾' },
    { id: 'fish', label: 'Fish', icon: '🐟' },
    { id: 'shellfish', label: 'Shellfish', icon: '🦐' },
    { id: 'sesame', label: 'Sesame', icon: '🌱' },
    { id: 'sulfites', label: 'Sulfites', icon: '🍷' }
  ];

  const dietaryTags = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥕' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
    { id: 'dairy-free', label: 'Dairy Free', icon: '🥛' },
    { id: 'nut-free', label: 'Nut Free', icon: '🥜' },
    { id: 'low-carb', label: 'Low Carb', icon: '🥗' },
    { id: 'high-protein', label: 'High Protein', icon: '💪' },
    { id: 'keto-friendly', label: 'Keto Friendly', icon: '🥑' },
    { id: 'paleo', label: 'Paleo', icon: '🥩' },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🫒' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleAllergenToggle = (allergenId: string) => {
    setFormData(prev => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo,
        allergens: prev.nutritionalInfo.allergens.includes(allergenId)
          ? prev.nutritionalInfo.allergens.filter(id => id !== allergenId)
          : [...prev.nutritionalInfo.allergens, allergenId]
      }
    }));
  };

  const handleDietaryTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tagId)
        ? prev.dietaryTags.filter(id => id !== tagId)
        : [...prev.dietaryTags, tagId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting meal listing:', formData);
    alert('🎉 Meal listing created successfully! Your delicious food is now available to customers.');
    router.push('/dashboard/restaurant/listings');
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
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Meal</h1>
            <p className="text-gray-600">List your delicious meals and help reduce food waste</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Info className="w-5 h-5 mr-2 text-orange-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Grilled Salmon with Roasted Vegetables"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe your meal, cooking methods, flavors, etc."
                />
              </div>
            </div>

            {/* Pricing & Servings */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                Pricing & Servings
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Servings *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.servings}
                    onChange={(e) => setFormData(prev => ({ ...prev, servings: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Serving *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="8.50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="12.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-orange-600" />
                Meal Photos
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
                  <span className="text-orange-600 hover:text-orange-700 font-medium">
                    Click to upload photos
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
                <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                Expiry & Location
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.expiryTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryTime: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Fresh Bites Restaurant, Downtown"
                  />
                </div>
              </div>
            </div>

            {/* Nutritional Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2 text-orange-600" />
                Nutritional Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calories (per serving)
                  </label>
                  <input
                    type="number"
                    value={formData.nutritionalInfo.calories}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutritionalInfo: { ...prev.nutritionalInfo, calories: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="450"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="25.5"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="35.2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergens
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {allergens.map(allergen => (
                    <label key={allergen.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.nutritionalInfo.allergens.includes(allergen.id)}
                        onChange={() => handleAllergenToggle(allergen.id)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{allergen.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Dietary Tags</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {dietaryTags.map(tag => (
                  <label key={tag.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.dietaryTags.includes(tag.id)}
                      onChange={() => handleDietaryTagToggle(tag.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{tag.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients
                  </label>
                  <textarea
                    rows={3}
                    value={formData.ingredients}
                    onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="List main ingredients used in the meal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serving Size
                  </label>
                  <input
                    type="text"
                    value={formData.servingSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, servingSize: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., 1 plate, 300g"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preparation Time
                  </label>
                  <input
                    type="text"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., 20 minutes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={formData.isHot}
                        onChange={() => setFormData(prev => ({ ...prev, isHot: true }))}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Hot</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={!formData.isHot}
                        onChange={() => setFormData(prev => ({ ...prev, isHot: false }))}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Cold</span>
                    </label>
                  </div>
                </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., 6 PM - 9 PM"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Restaurant counter, Side entrance"
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
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
              >
                Create Meal Listing
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 