import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

import {
  FiDollarSign,
  FiPieChart,
  FiTrendingUp,
  FiBarChart2,
  FiShield,
  FiSmartphone,
  FiZap,
  FiArrowRight,
  FiCheck,
  FiMenu,
  FiX
} from 'react-icons/fi';

const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });

  const handleFeatureClick = () => {
    navigate('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const features = [
    {
      icon: FiDollarSign,
      title: 'Track Expenses',
      description: 'Record and categorize every transaction with detailed history and smart categorization.',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30'
    },
    {
      icon: FiPieChart,
      title: 'Budget Management',
      description: 'Create monthly budgets by category with real-time tracking and smart alerts.',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30'
    },
    {
      icon: FiTrendingUp,
      title: 'Analytics & Insights',
      description: 'Beautiful charts and graphs to visualize spending patterns and financial trends.',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      icon: FiBarChart2,
      title: 'Budget History',
      description: 'Complete archive of past budgets with performance analysis and comparisons.',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30'
    },
    {
      icon: FiZap,
      title: 'AI Assistant',
      description: 'Get personalized financial advice and optimization tips from our AI chatbot.',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30'
    },
    {
      icon: FiSmartphone,
      title: 'Mobile Ready',
      description: 'Fully responsive design that works perfectly on all devices and screen sizes.',
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30'
    }
  ];

  const benefits = [
    'Free forever plan',
    'Bank-level security',
    'Real-time sync',
    'Export data anytime',
    '24/7 support',
    'No credit card required'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b-2 border-slate-200 dark:border-slate-800 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Finance Tracker
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl border-2 border-purple-600 dark:border-pink-500 text-purple-700 dark:text-pink-400 font-bold bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-pink-950/20 transition-all shadow-lg"
              >
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[73px] left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden md:hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center px-6 py-3 rounded-xl border-2 border-purple-600 dark:border-pink-500 text-purple-700 dark:text-pink-400 font-bold bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-pink-950/20 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 md:pb-32 px-4 sm:px-6 overflow-hidden">
        {/* Animated Background */}
        <motion.div
          style={{ y, opacity }}
          className="parallax-bg absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 md:w-96 md:h-96 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </motion.div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Icon */}
          <motion.div
            className="float-icon inline-block mb-6 md:mb-8"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl">
              <svg className="w-16 h-16 md:w-24 md:h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="hero-title text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <motion.span
              className="block bg-gradient-to-r from-purple-800 via-pink-600 to-purple-800 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent font-black"
              style={{
                opacity: 1,
                WebkitTextFillColor: 'transparent',
              }}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              Take Control
            </motion.span>
            <motion.span
              className="block text-slate-900 dark:text-white mt-2 font-black"
              style={{
                opacity: 1,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Of Your Finances
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="hero-subtitle text-lg sm:text-2xl md:text-3xl text-slate-800 dark:text-slate-200 mb-8 md:mb-12 max-w-3xl mx-auto font-bold px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Track expenses, manage budgets, and achieve your financial goals with our powerful finance tracker.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="hero-cta flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="block w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base md:text-lg shadow-2xl hover:shadow-purple-500/50 transition-all"
              >
                Get Started Free
              </Link>
            </motion.div>
            <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={handleFeatureClick}
                className="block w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-2xl border-2 border-purple-600 dark:border-pink-500 text-purple-700 dark:text-pink-400 font-bold text-base md:text-lg bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-pink-950/20 transition-all shadow-lg"
              >
                Explore Features
              </button>
            </motion.div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            className="mt-12 md:mt-16 flex flex-wrap justify-center gap-4 md:gap-6 px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700"
                whileHover={{ scale: 1.1 }}
              >
                <FiCheck className="text-emerald-600 dark:text-emerald-400 text-sm md:text-base" />
                <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 md:py-24 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-medium">
              Everything you need to manage your finances effectively and achieve your goals
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={handleFeatureClick}
                  className={`${feature.bgColor} p-6 md:p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer group shadow-lg hover:shadow-2xl transition-all`}
                >
                  <motion.div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${feature.color} p-4 md:p-5 mb-6 shadow-xl`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 mb-6 text-base md:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  <motion.div
                    className="flex items-center text-purple-600 dark:text-pink-400 font-bold text-lg"
                    whileHover={{ x: 10 }}
                  >
                    <span>Learn more</span>
                    <FiArrowRight className="ml-2" />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-purple-600 to-pink-600">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 text-white">
            Ready to Start?
          </h2>
          <p className="text-lg md:text-2xl text-white/90 mb-8 md:mb-12 font-medium">
            Join thousands of users who are already taking control of their finances
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 md:px-12 md:py-5 rounded-2xl bg-white text-purple-600 font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all flex justify-center items-center"
              >
                Create Free Account
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 md:px-12 md:py-5 rounded-2xl border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all flex justify-center items-center"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-6 border-t-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-600 dark:text-slate-400 font-medium text-sm md:text-base">
            © 2024 Finance Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
