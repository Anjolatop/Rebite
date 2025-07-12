import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Leaf, 
  Users, 
  Zap, 
  Award, 
  Globe,
  ArrowRight,
  Play,
  Star,
  CheckCircle
} from 'lucide-react';

import { Helmet } from 'react-helmet-async';

const HomePage = () => {
  const features = [
    {
      icon: Heart,
      title: 'Food Rescue',
      description: 'Save perfectly good food from going to waste while supporting local farmers and restaurants.',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Leaf,
      title: 'Sustainable',
      description: 'Reduce food waste and environmental impact with every purchase you make.',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with local vendors and build a stronger, more sustainable food ecosystem.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Smart recommendations tailored to your dietary needs and preferences.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Award,
      title: 'Gamified',
      description: 'Earn points, unlock achievements, and track your impact on food waste reduction.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Contribute to UN Sustainable Development Goals for zero hunger and responsible consumption.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    }
  ];

  const stats = [
    { number: '40%', label: 'Food Waste Reduction' },
    { number: '500+', label: 'Local Vendors' },
    { number: '10K+', label: 'Items Rescued' },
    { number: '50K+', label: 'Happy Users' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Local Farmer',
      content: 'Rebite has helped us reduce food waste by 60% while connecting us with amazing customers who appreciate fresh, local produce.',
      avatar: 'SJ'
    },
    {
      name: 'Mike Chen',
      role: 'Restaurant Owner',
      content: 'The platform is incredibly easy to use. We can list our surplus food quickly and customers love the great deals.',
      avatar: 'MC'
    },
    {
      name: 'Emma Davis',
      role: 'Conscious Consumer',
      content: 'I love knowing that my purchases help reduce food waste and support local businesses. The gamification makes it fun!',
      avatar: 'ED'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Rebite - Smart Food Rescue Platform</title>
        <meta name="description" content="AI-powered food rescue platform connecting farmers and restaurants with consumers. Reduce food waste, save money, and support local businesses." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600">
          <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                  Rescue Food.
                  <br />
                  <span className="text-accent-300">Respect Values.</span>
                  <br />
                  <span className="text-secondary-200">Reinvent Access.</span>
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  AI-powered food rescue platform connecting farmers and restaurants with consumers. 
                  Reduce waste, save money, and build a sustainable food ecosystem.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-200">
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-white/80 text-sm">Fresh tomatoes from Local Farm</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span className="text-white/80 text-sm">Organic bread from Artisan Bakery</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-white/80 text-sm">Local vegetables from Community Garden</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Total Saved</span>
                        <span className="text-white font-bold text-xl">$12.50</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-white/80">Food Rescued</span>
                        <span className="text-white font-bold">5 items</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Rebite?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're not just another food delivery app. We're building a sustainable future, one rescued meal at a time.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-200"
                >
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What Our Community Says
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of users who are making a difference
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-6"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium">
                      {testimonial.avatar}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-primary-600 to-secondary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are reducing food waste, saving money, and building a sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Start Rescuing Food
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;