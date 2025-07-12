'use client';

import { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Impact",
      description: "Join millions reducing food waste worldwide",
      color: "from-primary-500 to-primary-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health First",
      description: "AI-powered nutrition recommendations",
      color: "from-success-500 to-success-600"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Eco-Friendly",
      description: "Sustainable choices for a better planet",
      color: "from-mindfulness-500 to-mindfulness-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Connect with local farmers and restaurants",
      color: "from-empathy-500 to-empathy-600"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-secondary-600/10" />
        <div className="container-responsive relative z-10 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-6"
              >
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Food Rescue
                </span>
              </motion.div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-6">
                Rescue Food.
                <br />
                <span className="gradient-text">Respect Values.</span>
                <br />
                Reinvent Access.
              </h1>
              
              <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
                Connect with local farmers and restaurants to rescue surplus food while 
                building healthy habits and making a positive impact on the planet.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary btn-lg"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline btn-lg"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                  <div className="aspect-square relative overflow-hidden rounded-2xl">
                    <Image
                      src="/hero-app-mockup.png"
                      alt="Rebite App Interface"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Rebite?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with sustainable values 
              to create a better food system for everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-neutral-50">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Get started in minutes and start making a difference today.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Set your nutrition goals, dietary preferences, and sustainability values.",
                icon: <Target className="w-8 h-8" />
              },
              {
                step: "02",
                title: "Discover Local Food",
                description: "Browse AI-recommended rescued food from nearby farmers and restaurants.",
                icon: <MapPin className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Order & Impact",
                description: "Place orders and track your positive impact on food waste and community.",
                icon: <TrendingUp className="w-8 h-8" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="card-hover p-8 text-center h-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-6">
                    {step.icon}
                  </div>
                  <div className="absolute top-4 right-4 text-4xl font-bold text-primary-200">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value-Based Tracking */}
      <section className="py-20 bg-white">
        <div className="container-responsive">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6">
                Track Your Values
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                Our unique value-based tracking system helps you build healthy habits 
                while making sustainable choices. Watch your values grow as you make 
                positive food decisions.
              </p>
              
              <div className="space-y-6">
                {[
                  { name: "Discipline", color: "discipline", progress: 75 },
                  { name: "Mindfulness", color: "mindfulness", progress: 60 },
                  { name: "Prudence", color: "prudence", progress: 85 },
                  { name: "Empathy", color: "empathy", progress: 45 }
                ].map((value, index) => (
                  <div key={value.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-neutral-700">{value.name}</span>
                      <span className="text-sm text-neutral-500">{value.progress}%</span>
                    </div>
                    <div className="value-bar">
                      <div 
                        className={`value-bar-${value.color}`}
                        style={{ width: `${value.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card p-8">
                <div className="text-center mb-6">
                  <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    Earn Rewards
                  </h3>
                  <p className="text-neutral-600">
                    Level up your values and unlock exclusive rewards
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <Gift className="w-6 h-6" />, text: "Gift Points" },
                    { icon: <Star className="w-6 h-6" />, text: "Badges" },
                    { icon: <Zap className="w-6 h-6" />, text: "Streaks" },
                    { icon: <Shield className="w-6 h-6" />, text: "Challenges" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-50">
                      <div className="text-primary-600">{item.icon}</div>
                      <span className="text-sm font-medium text-neutral-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="container-responsive text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users already reducing food waste and building 
              sustainable habits with Rebite.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn bg-white text-primary-600 hover:bg-neutral-100 btn-lg"
                >
                  Start Your Journey
                </motion.button>
              </Link>
              <Link href="/vendors">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 btn-lg"
                >
                  Become a Vendor
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="container-responsive">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Rebite</h3>
              <p className="text-neutral-400">
                Making food rescue smart, sustainable, and accessible for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/vendors" className="hover:text-white transition-colors">For Vendors</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 Rebite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 