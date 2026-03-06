import { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { FiPlus, FiEdit, FiTrash2, FiFilter, FiSearch, FiArrowUpRight, FiArrowDownRight, FiClock } from 'react-icons/fi';
import { FcPlus, FcMinus, FcOk, FcHighPriority, FcMoneyTransfer, FcComboChart, FcIdea } from 'react-icons/fc';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getCurrencySymbol, formatCurrency } from '../utils/currency';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const Transactions = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
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

  const COLORS = ['#10b981', '#f43f5e'];
  const summaryData = [
    { name: 'Income', value: summary.income },
    { name: 'Expense', value: summary.expense },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          className="btn-primary py-3 px-6 flex items-center justify-center gap-2 shadow-emerald-500/20 text-sm tracking-widest uppercase font-black w-full md:w-auto"
        >
          <FiPlus size={18} /> New Entry
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={`lg:col-span-1 card relative overflow-hidden border-0 shadow-2xl flex flex-col justify-center ${darkMode ? 'bg-slate-900 text-white' : 'bg-emerald-900 text-white'
          }`}>
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <FcMoneyTransfer size={160} className="drop-shadow-2xl" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter mb-6 relative z-10 text-emerald-400">Cash Flow</h2>
          <div className="flex flex-col gap-4 mb-4 relative z-10">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200/60 mb-1">Inflow</p>
              <CurrencyDisplay amount={summary.income} className="text-2xl text-emerald-400 drop-shadow-sm" valueClassName="font-financial" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200/60 mb-1">Outflow</p>
              <CurrencyDisplay amount={summary.expense} className="text-2xl text-rose-400 drop-shadow-sm" valueClassName="font-financial" />
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
        </div>

        {/* Filters */}
        <div className="lg:col-span-3 card flex flex-col justify-center border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-sky-500" />
          <div className="flex items-center gap-3 mb-6">
            <FiFilter className="text-emerald-500" size={20} />
            <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900 dark:text-white">Ledger Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-20 card">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        ) : transactions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group relative overflow-hidden bg-white dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border border-white/20 dark:border-white/5 ${transaction.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-rose-50 dark:bg-rose-950/30'
                    }`}>
                    {transaction.type === 'income' ? <FiArrowUpRight className="text-emerald-600" size={24} /> : <FiArrowDownRight className="text-rose-500" size={24} />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight truncate">
                      {transaction.description || transaction.category}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{transaction.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <FiClock size={10} />
                        {format(new Date(transaction.date), 'dd MMM yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 relative z-10 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-100 dark:border-slate-800 sm:border-0">
                  <div className={`text-right ${transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                    <div className="text-xl font-black font-financial flex justify-end items-center gap-1">
                      <span>{transaction.type === 'income' ? '+' : '-'}</span>
                      <CurrencyDisplay amount={transaction.amount} />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md inline-block mt-1 ${transaction.type === 'income' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'bg-rose-50 text-rose-500 dark:bg-rose-950/30'
                      }`}>{transaction.type}</span>
                  </div>

                  <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-400 hover:text-emerald-600 rounded-xl transition-colors shadow-sm"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 rounded-xl transition-colors shadow-sm"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Subtle indicator strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${transaction.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-center px-6 bg-slate-50/50 dark:bg-[#050505] card shadow-sm">
            <FcIdea className="mb-6 drop-shadow-md grayscale opacity-50" size={64} />
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter mb-2">No Transactions Found</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-8">It's quiet in here.<br />Time to log your first transaction.</p>
            <button
              onClick={() => {
                resetForm();
                setEditingTransaction(null);
                setShowModal(true);
              }}
              className="btn-primary py-3 px-8 shadow-xl flex items-center gap-2 text-sm tracking-widest uppercase font-black"
            >
              <FiPlus size={18} /> New Entry
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {
        showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass card w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
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
        )
      }
    </div >
  );
};

export default Transactions;
