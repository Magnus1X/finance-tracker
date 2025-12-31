import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { currencies, getCurrencySymbol } from '../utils/currency';
import { FiUser, FiDollarSign, FiSave } from 'react-icons/fi';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currency: 'USD',
    occupation: '',
    lifestyle: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ type: '', text: '' });
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currency: user.currency || 'USD',
        occupation: user.occupation || '',
        lifestyle: user.lifestyle || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authAPI.updateProfile(formData);
      // Ensure we pass the user object correctly
      const updatedUser = response.data.data || response.data;
      updateUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h1>

      <div className="glass card max-w-2xl">
        <h2 className="text-xl font-semibold mb-6 text-slate-700 dark:text-slate-200">Profile Settings</h2>
        
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-slate-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field pl-10"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Changing email requires it to be unique. You’ll stay logged in.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Currency
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className="text-slate-400" />
              </div>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="input-field pl-10"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This will update the currency symbol displayed across the application.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <span className="text-xs font-medium">Preview:</span>
              <span className="font-bold">{getCurrencySymbol(formData.currency)}1234.56</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Occupation
            </label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Software Engineer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Lifestyle
            </label>
            <textarea
              name="lifestyle"
              value={formData.lifestyle}
              onChange={handleChange}
              className="input-field"
              rows={3}
              placeholder="Describe your lifestyle (e.g., frugal, moderate, luxury)"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="loading-spinner w-5 h-5 border-2"></span>
              ) : (
                <>
                  <FiSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="glass card max-w-2xl">
        <h2 className="text-xl font-semibold mb-6 text-slate-700 dark:text-slate-200">Change Password</h2>
        {pwdMessage.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            pwdMessage.type === 'success' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {pwdMessage.text}
          </div>
        )}
        <form onSubmit={(e) => {
          e.preventDefault();
          if (pwdForm.newPassword !== pwdForm.confirmNewPassword) {
            setPwdMessage({ type: 'error', text: 'New passwords do not match' });
            return;
          }
          if (pwdForm.newPassword.length < 6) {
            setPwdMessage({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
          }
          (async () => {
            try {
              setPwdLoading(true);
              const response = await authAPI.changePassword({
                currentPassword: pwdForm.currentPassword,
                newPassword: pwdForm.newPassword,
              });
              setPwdMessage({ type: 'success', text: response.data.message || 'Password updated successfully' });
              setPwdForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            } catch (error) {
              setPwdMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update password',
              });
            } finally {
              setPwdLoading(false);
            }
          })();
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={pwdForm.currentPassword}
              onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={pwdForm.newPassword}
              onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={pwdForm.confirmNewPassword}
              onChange={(e) => setPwdForm({ ...pwdForm, confirmNewPassword: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={pwdLoading}
              className="btn btn-primary w-full sm:w-auto"
            >
              {pwdLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
