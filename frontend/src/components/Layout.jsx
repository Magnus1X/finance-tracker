import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun, FiLogOut, FiMenu, FiX, FiChevronLeft, FiChevronRight, FiGrid, FiBookOpen, FiTrendingUp, FiTerminal, FiTarget, FiTool, FiBell, FiDollarSign, FiPieChart, FiClock, FiSettings, FiActivity } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/learn', icon: FiBookOpen, label: 'Learn Finance' },
    { path: '/market', icon: FiTrendingUp, label: 'Market Trends' },
    { path: '/advisor', icon: FiTerminal, label: 'AI Advisor' },
    { path: '/goals', icon: FiTarget, label: 'Financial Goals' },
    { path: '/tools', icon: FiTool, label: 'Financial Tools' },
    { path: '/alerts', icon: FiBell, label: 'Smart Alerts' },
    { path: '/transactions', icon: FiDollarSign, label: 'Transactions' },
    { path: '/budgets', icon: FiPieChart, label: 'Budgets' },
    { path: '/history', icon: FiClock, label: 'History' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex transition-colors duration-300">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full ${isMinimized ? 'w-24' : 'w-72'} bg-white dark:bg-[#050505] border-r border-slate-200 dark:border-slate-800 z-40 transition-all duration-300 ease-in-out md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col relative">

          {/* Collapse Toggle Button (Desktop Only) */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hidden md:flex absolute -right-3.5 top-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1.5 text-slate-500 hover:text-emerald-600 transition-colors z-50 shadow-sm"
            title={isMinimized ? "Expand Sidebar" : "Minimize Sidebar"}
          >
            {isMinimized ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
          </button>

          {/* Logo Section */}
          <div className={`p-8 flex items-center ${isMinimized ? 'justify-center' : 'justify-between'}`}>
            <Link to="/" className="flex items-center gap-3 group overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <FiActivity className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <AnimatePresence>
                {!isMinimized && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-xl font-black text-slate-900 dark:text-white tracking-tighter whitespace-nowrap"
                  >
                    FINANCE<span className="text-emerald-600">ERA</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            {!isMinimized && (
              <button
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              >
                <FiX className="text-slate-500" size={20} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto space-y-1 py-4 custom-scrollbar ${isMinimized ? 'px-3' : 'px-6'}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    className={`nav-item flex items-center ${isMinimized ? 'justify-center !px-0' : ''} ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
                  >
                    <Icon className={`text-2xl shrink-0 ${isActive ? 'scale-110 drop-shadow-sm' : 'opacity-80 grayscale-[20%]'}`} />
                    {!isMinimized && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {isActive && !isMinimized && (
                      <motion.div
                        layoutId="activeTab"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-sm shrink-0"
                      />
                    )}
                  </Link>

                  {/* Tooltip for minimized state */}
                  {isMinimized && (
                    <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none shadow-xl border border-slate-700">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className={`p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#050505] flex flex-col ${isMinimized ? 'items-center gap-4 px-3' : ''}`}>
            {isMinimized ? (
              <>
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-black shadow-sm border border-emerald-200/50 dark:border-emerald-800/50 shrink-0 mx-auto" title={user?.name}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="w-full flex flex-col gap-2">
                  <button
                    onClick={toggleTheme}
                    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    className="w-full flex items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-750 shadow-sm"
                  >
                    {darkMode ? <FiSun className="text-emerald-500" size={18} /> : <FiMoon className="text-emerald-600" size={18} />}
                  </button>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="w-full flex items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 transition-all border border-slate-200 dark:border-slate-750 shadow-sm"
                  >
                    <FiLogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-black shadow-sm border border-emerald-200/50 dark:border-emerald-800/50 shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                    <p className="text-xs font-semibold text-slate-400 truncate pr-2">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-750 shadow-sm"
                  >
                    {darkMode ? <FiSun className="text-emerald-500" /> : <FiMoon className="text-emerald-600" />}
                    <span>{darkMode ? 'LIGHT' : 'DARK'}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 transition-all border border-slate-200 dark:border-slate-750 shadow-sm shrink-0"
                  >
                    <FiLogOut size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${isMinimized ? 'ml-0 md:ml-24' : 'ml-0 md:ml-72'}`}>
        <div className="max-w-[1600px] mx-auto p-4 sm:p-6 md:p-12 overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* Mobile Menu Toggle */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-6 right-6 z-30 md:hidden bg-white dark:bg-[#050505] p-3.5 rounded-2xl shadow-xl shadow-slate-200/50  border border-slate-100 dark:border-slate-800 text-emerald-600 transition-all hover:scale-105 active:scale-95"
        >
          <FiMenu size={22} />
        </button>
      )}
    </div>
  );
};

export default Layout;
