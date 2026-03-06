import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

import {
  FiArrowRight,
  FiCheck,
  FiMenu,
  FiX,
  FiTwitter,
  FiLinkedin,
  FiGithub,
  FiInstagram
} from 'react-icons/fi';
import {
  FcComboChart,
  FcBullish,
  FcIdea,
  FcDataProtection,
  FcCellPhone,
  FcBarChart,
  FcApproval,
  FcPositiveDynamic,
  FcLineChart,
  FcPieChart
} from 'react-icons/fc';

const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.1 });

  const features = [
    {
      icon: FcComboChart,
      title: 'Smart Analytics',
      description: 'Real-time data visualization of your cash flow and spending patterns.',
      accent: 'emerald'
    },
    {
      icon: FcBullish,
      title: 'Goal Tracking',
      description: 'Define and monitor long-term financial milestones with precision.',
      accent: 'emerald'
    },
    {
      icon: FcIdea,
      title: 'AI Advisor',
      description: 'Get automated insights and budget optimizations from our proprietary engine.',
      accent: 'emerald'
    }
  ];

  const valueProps = [
    {
      title: 'Built for Security',
      description: 'Your data is encrypted with bank-level protocols and never shared.',
      icon: FcDataProtection
    },
    {
      title: 'Universal Access',
      description: 'Switch seamlessly between desktop and mobile with perfect sync.',
      icon: FcCellPhone
    },
    {
      title: 'Advanced Reporting',
      description: 'Export deep-dive financial reports in PDF and CSV anytime.',
      icon: FcBarChart
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden w-full">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="emerald-glow top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100 dark:bg-emerald-900/10" />
        <div className="emerald-glow bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-slate-100 dark:bg-[#050505]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black backdrop-blur-xl dark:backdrop-blur-none border-b border-slate-100 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Finance<span className="text-emerald-600">Era</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">Sign In</Link>
            <Link to="/register" className="btn-primary rounded-xl px-8 py-2.5">Get Started</Link>
          </div>

          <button className="md:hidden text-slate-900 dark:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-3 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-2"
          >
            <FcApproval size={16} /> Your Money. Your Rules. Your Future.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white pb-1"
          >
            Master <span className="text-emerald-600">Your</span> <br /> Capital Flow
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl pb-3"
          >
            Stop guessing, start growing. Track every rupee, crush your goals, and let AI do the heavy lifting — all in one powerful dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start"
          >
            <Link to="/register" className="btn-primary px-6 py-3 text-base rounded-xl text-center shadow-2xl shadow-emerald-500/20">
              Establish Portfolio
            </Link>
            <Link to="/login" className="btn-secondary px-6 py-3 text-base rounded-xl text-center shadow-sm">
              Live Demonstration
            </Link>
          </motion.div>


        </div>

        {/* Hero Interactive Chart / Graphic */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent blur-3xl -z-10 rounded-full" />
          <div className="card p-2 bg-white/50 dark:bg-black backdrop-blur-2xl dark:backdrop-blur-none border border-white/20 dark:border-slate-800/50 shadow-2xl overflow-hidden rounded-3xl">
            <img
              src="/finance-hero.jpg"
              alt="Finance Illustration"
              className="w-full h-[500px] object-contain rounded-2xl"
            />
            {/* Overlay floating element */}
            <div className="absolute bottom-10 left-10 p-6 bg-white/90 dark:bg-[#050505] backdrop-blur-xl dark:backdrop-blur-none rounded-2xl shadow-2xl border border-white/20 dark:border-slate-800/50 w-72">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm">
                  <FcLineChart size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">Net Capital Surplus</p>
                  <p className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">$142,500.00</p>
                </div>
              </div>
              <div className="h-16 w-full opacity-60">
                <FcPositiveDynamic className="w-full h-full drop-shadow-sm opacity-80" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid with Photos */}
      <section ref={featuresRef} className="py-10 md:py-12 bg-slate-50/50 dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-3">
              What We <span className="text-emerald-600">Offer</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg">Everything you need to take control of your finances.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              {
                icon: FcComboChart,
                title: 'Smart Analytics',
                description: 'Real-time data visualization of your cash flow and spending patterns.',
                photo: "/smart-analytics.png"
              },
              {
                icon: FcBullish,
                title: 'Goal Tracking',
                description: 'Define and monitor long-term financial milestones with precision.',
                photo: "/goal-tracking.jpg"
              },
              {
                icon: FcIdea,
                title: 'AI Advisor',
                description: 'Get automated insights and budget optimizations from our proprietary engine.',
                photo: "/ai-advisor.png"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
                className="group relative overflow-hidden rounded-none bg-white dark:bg-black shadow-xl shadow-slate-200/50  border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 transition-all duration-500"
              >
                <div className="h-48 w-full overflow-hidden bg-white dark:bg-white">
                  <img
                    src={feature.photo}
                    alt={feature.title}
                    className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${feature.photo.startsWith('/') ? 'object-contain p-2' : 'object-cover'}`}
                  />
                </div>
                <div className="p-8 text-center">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl mb-6 bg-slate-50 dark:bg-[#050505] border border-slate-100 dark:border-slate-800 transition-colors shadow-sm mx-auto`}>
                    <feature.icon className="drop-shadow-sm" size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-10 md:py-12 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white">
                Everything you need <br /> in <span className="text-emerald-600">one viewport.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                We've combined decades of financial best practices into a single, high-performance interface.
              </p>
            </div>

            <div className="space-y-8">
              {valueProps.map((prop, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                    <prop.icon size={26} className="drop-shadow-sm" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black mb-1">{prop.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{prop.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-[3rem] bg-emerald-600/5 dark:bg-emerald-600/10 border border-emerald-600/10 relative overflow-hidden flex items-center justify-center">
              <FcPieChart className="text-emerald-600/20 w-3/4 h-3/4 animate-pulse" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
            </div>
            {/* Floating Card UI Mock */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="absolute -top-10 -right-10 p-8 glass rounded-3xl shadow-2xl border-slate-200 dark:border-slate-800 max-w-[280px]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500" />
                <div className="space-y-1">
                  <div className="h-2 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-2 w-12 bg-slate-100 dark:bg-slate-800 rounded" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-emerald-100 dark:bg-emerald-950/30 rounded" />
                <div className="h-2 w-3/4 bg-emerald-50 dark:bg-emerald-950/20 rounded" />
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <div className="h-4 w-12 bg-emerald-600/40 rounded" />
                <div className="h-4 w-16 bg-emerald-600 rounded" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-12 container mx-auto px-6">
        <div className="bg-emerald-600 rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-500/40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700 -z-10" />
          <div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight">
              Design Your <br /> Financial Freedom.
            </h2>
            <p className="text-xl md:text-2xl text-emerald-50 max-w-2xl mx-auto font-medium opacity-90">
              Join our premium community of strategic investors and money masters. It takes less than 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link to="/register" className="bg-white text-emerald-700 px-8 py-3 rounded-2xl font-black text-base hover:scale-105 transition-transform active:scale-95 shadow-xl">
                Join Exclusive Beta
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-8 pt-10 opacity-60">
              <div className="flex items-center gap-2 text-sm font-bold"><FiCheck /> Fast Registration</div>
              <div className="flex items-center gap-2 text-sm font-bold"><FiCheck /> Zero Platform Fees</div>
              <div className="flex items-center gap-2 text-sm font-bold"><FiCheck /> Private & Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="py-10 md:py-12 container mx-auto px-6 border-t border-slate-100 dark:border-slate-800/60 mt-10 relative z-10 w-full overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 md:gap-20">
          <div className="space-y-6 max-w-sm w-full">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Finance<span className="text-emerald-600">Era</span></span>
            </Link>
            <p className="text-sm text-slate-500 font-medium leading-relaxed pr-4 md:pr-0">
              Global wealth management empowered by AI. Redefining your financial literacy for the modern era.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20 w-full md:w-auto">
            <div className="space-y-5">
              <h5 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Platform</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                <li><Link to="/advisor" className="hover:text-emerald-600 transition-colors">Advisor</Link></li>
                <li><Link to="/market" className="hover:text-emerald-600 transition-colors">Markets</Link></li>
                <li><Link to="/learn" className="hover:text-emerald-600 transition-colors">Learning</Link></li>
              </ul>
            </div>
            <div className="space-y-5">
              <h5 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Company</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-300">
                <li className="hover:text-emerald-600 transition-colors cursor-pointer">Privacy</li>
                <li className="hover:text-emerald-600 transition-colors cursor-pointer">Security</li>
                <li className="hover:text-emerald-600 transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs font-black tracking-widest text-slate-400 text-center md:text-left">
            © {new Date().getFullYear()} FINANCEERA PLATFORM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-black dark:hover:bg-white dark:hover:text-black hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-500/20 transition-all duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0A66C2] hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0A66C2]/20 transition-all duration-300">
              <FiLinkedin size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#333333] dark:hover:bg-white dark:hover:text-black hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-500/20 transition-all duration-300">
              <FiGithub size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#dc2743]/20 transition-all duration-300">
              <FiInstagram size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
