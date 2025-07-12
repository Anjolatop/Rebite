'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Target,
  Activity,
  Apple,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NutritionProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    dietaryGoals: [],
    allergies: [],
    preferences: [],
    fitnessTracker: '',
    activityLevel: '',
    age: '',
    weight: '',
    height: ''
  });

  const dietaryGoals = [
    { id: 'weight-loss', label: 'Weight Loss', icon: '🎯', description: 'Reduce calorie intake and increase activity' },
    { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪', description: 'High protein diet for muscle building' },
    { id: 'heart-health', label: 'Heart Health', icon: '❤️', description: 'Low sodium, heart-healthy foods' },
    { id: 'diabetic-friendly', label: 'Diabetic Friendly', icon: '🩸', description: 'Low glycemic index foods' },
    { id: 'energy-boost', label: 'Energy Boost', icon: '⚡', description: 'Foods that provide sustained energy' },
    { id: 'digestive-health', label: 'Digestive Health', icon: '🌱', description: 'High fiber, gut-friendly foods' }
  ];

  const allergies = [
    { id: 'nuts', label: 'Tree Nuts', icon: '🥜' },
    { id: 'peanuts', label: 'Peanuts', icon: '🥜' },
    { id: 'dairy', label: 'Dairy', icon: '🥛' },
    { id: 'eggs', label: 'Eggs', icon: '🥚' },
    { id: 'soy', label: 'Soy', icon: '🫘' },
    { id: 'wheat', label: 'Wheat/Gluten', icon: '🌾' },
    { id: 'fish', label: 'Fish', icon: '🐟' },
    { id: 'shellfish', label: 'Shellfish', icon: '🦐' }
  ];

  const preferences = [
    { id: 'vegan', label: 'Vegan', icon: '🌱', description: 'Plant-based diet only' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥬', description: 'No meat, includes dairy and eggs' },
    { id: 'keto', label: 'Keto', icon: '🥑', description: 'High fat, low carb diet' },
    { id: 'paleo', label: 'Paleo', icon: '🥩', description: 'Whole foods, no processed items' },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🫒', description: 'Olive oil, fish, vegetables' },
    { id: 'high-protein', label: 'High Protein', icon: '🍗', description: 'Protein-rich foods' },
    { id: 'low-carb', label: 'Low Carb', icon: '🥗', description: 'Reduced carbohydrate intake' },
    { id: 'organic', label: 'Organic Only', icon: '🌿', description: 'Certified organic products' }
  ];

  const fitnessTrackers = [
    { id: 'fitbit', label: 'Fitbit', icon: '📱' },
    { id: 'apple-health', label: 'Apple Health', icon: '🍎' },
    { id: 'google-fit', label: 'Google Fit', icon: '🤖' },
    { id: 'garmin', label: 'Garmin', icon: '⌚' },
    { id: 'none', label: 'None', icon: '❌' }
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { id: 'lightly-active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { id: 'moderately-active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { id: 'very-active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { id: 'extremely-active', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setProfile(prev => ({
      ...prev,
      dietaryGoals: prev.dietaryGoals.includes(goalId)
        ? prev.dietaryGoals.filter(id => id !== goalId)
        : [...prev.dietaryGoals, goalId]
    }));
  };

  const handleAllergyToggle = (allergyId: string) => {
    setProfile(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergyId)
        ? prev.allergies.filter(id => id !== allergyId)
        : [...prev.allergies, allergyId]
    }));
  };

  const handlePreferenceToggle = (prefId: string) => {
    setProfile(prev => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter(id => id !== prefId)
        : [...prev.preferences, prefId]
    }));
  };

  const handleSave = () => {
    // Save profile to backend
    console.log('Saving nutrition profile:', profile);
    alert('🎉 Nutrition profile saved! You\'ll now get personalized food recommendations.');
    router.push('/dashboard');
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your dietary goals?</h2>
        <p className="text-gray-600">Select all that apply to help us recommend the best food for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dietaryGoals.map((goal) => (
          <motion.button
            key={goal.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleGoalToggle(goal.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              profile.dietaryGoals.includes(goal.id)
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{goal.icon}</span>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">{goal.label}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
              {profile.dietaryGoals.includes(goal.id) && (
                <CheckCircle className="w-5 h-5 text-orange-600" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Link 
          href="/dashboard"
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Skip for now
        </Link>
        <button
          onClick={() => setStep(2)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Any food allergies?</h2>
        <p className="text-gray-600">This helps us avoid recommending foods that could be harmful to you.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {allergies.map((allergy) => (
          <motion.button
            key={allergy.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAllergyToggle(allergy.id)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              profile.allergies.includes(allergy.id)
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">{allergy.icon}</div>
              <div className="text-sm font-medium">{allergy.label}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep(1)}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Apple className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dietary preferences?</h2>
        <p className="text-gray-600">Select your preferred eating style and food choices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {preferences.map((pref) => (
          <motion.button
            key={pref.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePreferenceToggle(pref.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              profile.preferences.includes(pref.id)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{pref.icon}</span>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">{pref.label}</h3>
                <p className="text-sm text-gray-600">{pref.description}</p>
              </div>
              {profile.preferences.includes(pref.id) && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep(2)}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(4)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect your fitness tracker</h2>
        <p className="text-gray-600">This helps us understand your activity level and recommend appropriate meals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fitnessTrackers.map((tracker) => (
          <motion.button
            key={tracker.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setProfile(prev => ({ ...prev, fitnessTracker: tracker.id }))}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              profile.fitnessTracker === tracker.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{tracker.icon}</span>
              <span className="font-medium">{tracker.label}</span>
              {profile.fitnessTracker === tracker.id && (
                <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep(3)}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
        >
          Complete Setup
        </button>
      </div>
    </motion.div>
  );

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
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step {step} of 4</span>
            <span className="text-sm text-gray-600">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
} 