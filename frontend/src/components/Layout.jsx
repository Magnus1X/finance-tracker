import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun, FiLogOut, FiHome, FiDollarSign, FiPieChart, FiClock, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/transactions', icon: FiDollarSign, label: 'Transactions' },
    { path: '/budgets', icon: FiPieChart, label: 'Budgets' },
    { path: '/history', icon: FiClock, label: 'History' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 glass border-r border-slate-200 dark:border-slate-700 z-40 transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Finance Tracker
            </h1>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <Icon className="text-xl" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700 glass">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
              <span className="text-sm">{darkMode ? 'Light' : 'Dark'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-medium shadow-sm"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-0 md:ml-64 p-4 md:p-8 min-h-screen transition-all duration-300">
        {children}
      </main>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={`fixed top-4 right-4 z-30 md:hidden glass p-3 rounded-xl shadow-lg text-purple-600 dark:text-pink-400 transition-opacity duration-300 ${isMobileOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <FiMenu className="text-xl" />
      </button>
    </div>
  );
};

export default Layout;
