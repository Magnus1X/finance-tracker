import { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { FiPlus, FiEdit, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol } from '../utils/currency';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({ type: '', category: '', search: '' });
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      
      const response = await transactionAPI.getAll(params).catch(() => ({ data: { data: [] } }));
      let data = response.data.data;
      
      if (filters.search) {
        data = data.filter(
          (t) =>
            t.category.toLowerCase().includes(filters.search.toLowerCase()) ||
            t.description?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setTransactions(data);
      const income = data.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const expense = data.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      setSummary({ income, expense });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
      setSummary({ income: 0, expense: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await transactionAPI.update(editingTransaction.id, formData);
      } else {
        await transactionAPI.create(formData);
      }
      setShowModal(false);
      setEditingTransaction(null);
      resetForm();
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert(error.response?.data?.message || 'Error saving transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description || '',
      date: format(new Date(transaction.date), 'yyyy-MM-dd'),
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  const categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Manage your income and expenses</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingTransaction(null);
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="glass card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field pl-10"
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="input-field"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={() => setFilters({ type: '', category: '', search: '' })}
            className="btn-secondary"
          >
            <FiFilter className="inline mr-2" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass card">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-700 dark:text-slate-300 mb-1 font-medium">Total Income</p>
            <p className="text-xl font-bold text-emerald-600">
              {getCurrencySymbol(user?.currency)}{summary.income.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="glass card">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-700 dark:text-slate-300 mb-1 font-medium">Total Expense</p>
            <p className="text-xl font-bold text-rose-600">
              {getCurrencySymbol(user?.currency)}{summary.expense.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'income'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}
                  >
                    <span className="font-bold">
                      {transaction.category.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{transaction.category}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </p>
                    {transaction.description && (
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}{getCurrencySymbol(user?.currency)}{transaction.amount.toFixed(2)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FiEdit className="text-primary-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No transactions found</p>
            <button
              onClick={() => {
                resetForm();
                setEditingTransaction(null);
                setShowModal(true);
              }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <FiPlus /> Add your first transaction
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass card w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount ({getCurrencySymbol(user?.currency)})</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  {editingTransaction ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTransaction(null);
                    resetForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
