import { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { FiPlus, FiEdit, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi';
import { FcPlus, FcMinus, FcOk, FcHighPriority, FcMoneyTransfer } from 'react-icons/fc';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol, formatCurrency } from '../utils/currency';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

  const COLORS = ['#10b981', '#f43f5e'];
  const summaryData = [
    { name: 'Income', value: summary.income },
    { name: 'Expense', value: summary.expense },
  ];

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
          className="btn-primary py-3 px-6 flex items-center gap-2 shadow-emerald-500/20 text-sm tracking-widest uppercase font-black"
        >
          <FiPlus size={18} /> New Entry
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card relative overflow-hidden bg-slate-900 text-white border-0 shadow-2xl flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <FcMoneyTransfer size={160} className="drop-shadow-2xl" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter mb-6 relative z-10 text-emerald-400">Cash Flow</h2>
          <div className="flex gap-4 mb-4 relative z-10">
            <div className="flex-1 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Inflow</p>
              <CurrencyDisplay amount={summary.income} className="text-xl text-emerald-400" valueClassName="font-financial" />
            </div>
            <div className="flex-1 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Outflow</p>
              <CurrencyDisplay amount={summary.expense} className="text-xl text-rose-400" valueClassName="font-financial" />
            </div>
          </div>
          <div className="h-32 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {summaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} itemStyle={{ color: '#fff', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
        </div>

        {/* Filters */}
        <div className="lg:col-span-2 glass card flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <FiFilter className="text-emerald-500" size={20} />
            <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900 dark:text-white">Ledger Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className="group relative overflow-hidden bg-white dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-5 relative z-10 w-full sm:w-auto">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner border border-slate-100 dark:border-slate-700">
                    {transaction.type === 'income' ? <FcPlus size={28} /> : <FcMinus size={28} />}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight group-hover:text-emerald-600 transition-colors">
                      {transaction.category}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{format(new Date(transaction.date), 'dd MMM yyyy')}</span>
                      {transaction.description && (
                        <>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-xs font-bold text-slate-500 truncate max-w-[200px]">{transaction.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 relative z-10 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-100 dark:border-slate-800 sm:border-0">
                  <div className={`text-xl ${transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                    <span>{transaction.type === 'income' ? '+' : '-'}</span>
                    <CurrencyDisplay amount={transaction.amount} valueClassName="font-financial" />
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
