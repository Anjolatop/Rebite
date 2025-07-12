'use client';

import { motion } from 'framer-motion';
import { 
  Globe, 
  Heart, 
  Leaf, 
  Users, 
  Star, 
  Award, 
  TrendingUp, 
  Shield,
  Smartphone,
  MapPin,
  Clock,
  Zap,
  Target,
  Gift,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Play,
  Download,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Impact",
      description: "Join millions reducing food waste worldwide",
      color: "from-blue-500 to-indigo-600",
      details: [
        "Real-time impact tracking",
        "Global community network",
        "Cross-border food rescue",
        "International partnerships"
      ]
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health First",
      description: "AI-powered nutrition recommendations",
      color: "from-rose-500 to-pink-600",
      details: [
        "Personalized nutrition insights",
        "Dietary preference matching",
        "Allergen detection",
        "Health impact scoring"
      ]
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Eco-Friendly",
      description: "Sustainable choices for a better planet",
      color: "from-emerald-500 to-green-600",
      details: [
        "Carbon footprint tracking",
        "Waste reduction metrics",
        "Sustainable packaging options",
        "Environmental impact reports"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Connect with local farmers and restaurants",
      color: "from-purple-500 to-violet-600",
      details: [
        "Local vendor network",
        "Community events",
        "Shared success stories",
        "Neighborhood partnerships"
      ]
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Quality Assured",
      description: "Rigorous quality checks and safety standards",
      color: "from-amber-500 to-orange-600",
      details: [
        "Food safety protocols",
        "Quality verification system",
        "Freshness guarantees",
        "Safety certifications"
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Security",
      description: "Secure transactions and data protection",
      color: "from-slate-500 to-gray-600",
      details: [
        "End-to-end encryption",
        "Secure payment processing",
        "Privacy protection",
        "Trust verification system"
      ]
    }
  ];

  const benefits = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Smart Notifications",
      description: "Get alerts for fresh food available in your area",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Local Discovery",
      description: "Find the best food deals near you with GPS tracking",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Updates",
      description: "Live inventory updates and availability tracking",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Booking",
      description: "Reserve and pay for food items in seconds",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Rewards Program",
      description: "Earn points for every meal saved and redeemed",
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Impact Tracking",
      description: "Monitor your contribution to food waste reduction",
      color: "from-teal-500 to-cyan-600"
    }
  ];

  const stats = [
    { number: "2.5M+", label: "Meals Saved", icon: <Heart className="w-5 h-5" /> },
    { number: "500+", label: "Vendors", icon: <Users className="w-5 h-5" /> },
    { number: "50K+", label: "Users", icon: <Globe className="w-5 h-5" /> },
    { number: "95%", label: "Satisfaction", icon: <Star className="w-5 h-5" /> }
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
              <Link href="/features" className="text-orange-600 font-medium">Features</Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-orange-600 transition-colors">
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Comprehensive Features
            </motion.div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Rescue Food
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive suite of features designed to make food rescue 
              effortless, efficient, and impactful for everyone involved.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/register"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                Start Using Features
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="border-2 border-orange-200 text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 flex items-center justify-center group">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mx-auto mb-4">
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with a mission to reduce food waste and build stronger communities.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                
                <ul className="space-y-3">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Smart Features for Smart Users
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to rescue food efficiently and make a positive impact.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex items-start space-x-4 p-6 rounded-xl hover:bg-orange-50 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and start making a difference today.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Set your preferences, dietary needs, and sustainability goals.",
                icon: <Target className="w-8 h-8" />
              },
              {
                step: "02",
                title: "Discover Local Food",
                description: "Browse AI-recommended rescued food from nearby vendors.",
                icon: <MapPin className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Order & Impact",
                description: "Place orders and track your positive impact on food waste.",
                icon: <TrendingUp className="w-8 h-8" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100"
              >
                <div className="absolute top-4 right-4 text-4xl font-bold text-orange-200">
                  {step.step}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-white">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already saving food and building stronger communities with our comprehensive features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/register"
                className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-all duration-200 flex items-center justify-center group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Rebite</span>
              </div>
              <p className="text-gray-400">
                Smart food rescue platform connecting communities and reducing waste.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">How it Works</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Safety</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Licenses</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rebite. All rights reserved. Making food rescue accessible to everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 