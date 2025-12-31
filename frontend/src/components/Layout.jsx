import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun, FiLogOut, FiHome, FiDollarSign, FiPieChart, FiClock } from 'react-icons/fi';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      gsap.from(navRef.current.children, {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        duration: 0.5,
      });
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/transactions', icon: FiDollarSign, label: 'Transactions' },
    { path: '/budgets', icon: FiPieChart, label: 'Budgets' },
    { path: '/history', icon: FiClock, label: 'History' },
  ];

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-slate-200/50 dark:border-slate-700/50 z-40">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Finance Tracker
            </h1>
          </div>
        </div>
        
        <nav ref={navRef} className="px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="text-xl" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200/50 dark:border-slate-700/50 glass">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-slate-700 dark:text-slate-200 font-medium"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
              <span className="text-sm">{darkMode ? 'Light' : 'Dark'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-medium"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 min-h-screen">
        {children}
      </main>

      {/* Mobile Menu Toggle */}
      <button className="fixed top-4 left-4 z-50 md:hidden glass p-3 rounded-xl">
        <FiHome className="text-xl" />
      </button>
    </div>
  );
};

export default Layout;

