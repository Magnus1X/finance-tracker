import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { currencies } from '../utils/currency';
import { FiMail, FiLock, FiUser, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', avatar: '', currency: 'USD' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData.name, formData.email, formData.password, formData.avatar);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', name: formData.name, email: formData.email }));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOAuth = () => {
    setLoadingGoogle(true);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="emerald-glow top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-50 dark:bg-emerald-900/5" />
        <div className="emerald-glow bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-50 dark:bg-[#050505]" />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Logo Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Finance<span className="text-emerald-600">Era</span></span>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Establish Portfolio</h1>
          <p className="mt-2 text-slate-400 font-bold text-sm tracking-widest uppercase">Begin Your Financial Mastery</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card shadow-2xl shadow-slate-200/50 "
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-xs font-black uppercase text-center tracking-widest">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Legal Name</label>
                <div className="relative group">
                  <FiUser className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-14"
                    placeholder="Enter your Name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Identifier</label>
                <div className="relative group">
                  <FiMail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-14"
                    placeholder="Enter your Email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Security Passkey</label>
                <div className="relative group">
                  <FiLock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-14"
                    placeholder="Enter your Password"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Verify Passkey</label>
                <div className="relative group">
                  <FiLock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pl-14"
                    placeholder="Confirm your Password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Primary Currency</label>
              <div className="relative group">
                <FiDollarSign className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="input-field pl-14 appearance-none"
                  required
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || loadingGoogle}
              className="w-full btn-primary py-5 text-base rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Professional Account</span>
                  <FiArrowRight />
                </>
              )}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-black tracking-widest uppercase">Or</span>
              <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleOAuth}
              disabled={loading || loadingGoogle}
              className="w-full py-5 text-base rounded-2xl flex items-center justify-center gap-3 transition-all border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-[#050505] hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-[0.98] dark:text-white font-bold shadow-sm"
            >
              {loadingGoogle ? (
                <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 border-t-emerald-600 rounded-full animate-spin" />
              ) : (
                <>
                  <FcGoogle size={24} />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-50 dark:border-slate-800 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose">
              Already have an account? <br />
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-2">
                Authorize Existing Session <FiArrowRight />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
