import { useState, useEffect, useRef } from 'react';
import { budgetAPI } from '../services/api';
import { FiPlus, FiEdit, FiTrash2, FiArchive } from 'react-icons/fi';
import { FcIdea, FcPlus, FcRules } from 'react-icons/fc';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol, formatCurrency } from '../utils/currency';
import CurrencyDisplay from '../components/CurrencyDisplay';

const Budgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const modalRef = useRef(null);

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  const fetchBudgets = async () => {
    try {
      const response = await budgetAPI.getAll({ month: selectedMonth, year: selectedYear }).catch(() => ({ data: { data: [] } }));
      setBudgets(response.data.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await budgetAPI.update(editingBudget.id, formData);
      } else {
        await budgetAPI.create(formData);
      }
      setShowModal(false);
      setEditingBudget(null);
      resetForm();
      fetchBudgets();
    } catch (error) {
      console.error('Error saving budget:', error);
      alert(error.response?.data?.message || 'Error saving budget');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetAPI.delete(id);
        fetchBudgets();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const handleArchive = async (id) => {
    if (window.confirm('Archive this budget to history?')) {
      try {
        await budgetAPI.archive(id);
        fetchBudgets();
      } catch (error) {
        console.error('Error archiving budget:', error);
      }
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      month: budget.month,
      year: budget.year,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      amount: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };

  const categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

  const getUtilizationPercentage = (budget) => {
    return (budget.spent / budget.amount) * 100;
  };

  const getStatusColor = (percentage) => {
    if (percentage > 100) return 'from-rose-500 to-rose-400';
    if (percentage >= 90) return 'from-amber-500 to-amber-400';
    return 'from-emerald-500 to-emerald-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Budgets</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage your monthly budgets</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingBudget(null);
            setShowModal(true);
          }}
          className="btn-primary py-3 px-6 flex items-center gap-2 shadow-emerald-500/20 text-sm tracking-widest uppercase font-black"
        >
          <FiPlus size={18} /> New Budget
        </button>
      </div>

      {/* Month/Year Selector */}
      <div className="glass card flex flex-row items-center gap-8">
        <div className="flex-1 max-w-xs">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Target Cycle</label>
          <div className="flex bg-white dark:bg-[#050505] rounded-xl border border-slate-100 dark:border-slate-800 p-1">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="flex-1 bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none px-3 py-2 cursor-pointer border-r border-slate-100 dark:border-slate-800"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {format(new Date(2000, month - 1), 'MMMM')}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-24 bg-transparent text-sm font-bold text-slate-900 dark:text-white focus:outline-none px-3 py-2 cursor-pointer"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Budgets List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : budgets.length > 0 ? (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const utilization = getUtilizationPercentage(budget);
              const remaining = budget.amount - budget.spent;
              return (
                <div
                  key={budget.id}
                  className="group relative overflow-hidden bg-white dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-none transition-all duration-300"
                >
                  {/* Background Blur Ring */}
                  {utilization > 90 && (
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-500/5 rounded-full blur-[60px] pointer-events-none" />
                  )}

                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner border border-slate-100 dark:border-slate-700">
                        <FcRules size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{budget.category}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {format(new Date(budget.year, budget.month - 1), 'MMMM yyyy')} Tracking
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="text-left md:text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Velocity</p>
                        <p className={`text-2xl font-black tracking-tighter ${utilization > 100 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{utilization.toFixed(1)}%</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(budget)}
                          className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-400 hover:text-emerald-600 rounded-xl transition-colors shadow-sm"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleArchive(budget.id)}
                          className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-slate-400 hover:text-sky-600 rounded-xl transition-colors shadow-sm"
                        >
                          <FiArchive size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(budget.id)}
                          className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 rounded-xl transition-colors shadow-sm"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Expenditure</span>
                        <div className="font-financial text-xl tracking-tighter text-slate-900 dark:text-white flex items-center gap-1">
                          <CurrencyDisplay amount={budget.spent} />
                          <span className="text-slate-400 text-sm font-sans font-bold">/</span>
                          <CurrencyDisplay amount={budget.amount} className="text-slate-400 text-sm font-sans font-bold" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-financial text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1 ${remaining >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          <CurrencyDisplay amount={Math.abs(remaining)} />
                          <span>{remaining >= 0 ? 'Surplus' : 'Deficit'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Masterpiece Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                      <div
                        className={`h-full bg-gradient-to-r transition-all duration-1000 ease-out ${getStatusColor(utilization)} relative`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-center px-6 bg-slate-50/50 dark:bg-[#050505] card">
            <FcIdea className="mb-6 drop-shadow-md grayscale opacity-50" size={56} />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed mb-6">No budget models identified for this cycle. <br /> Establish a monitoring threshold.</p>
            <button
              onClick={() => {
                resetForm();
                setEditingBudget(null);
                setShowModal(true);
              }}
              className="btn-primary inline-flex items-center gap-2 py-3 px-6 shadow-emerald-500/20 text-sm tracking-widest uppercase font-black"
            >
              <FiPlus size={18} /> Deploy Budget Strategy
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass card w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
                {editingBudget ? 'Edit Budget' : 'Create Budget'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium mb-2">
                  Amount ({getCurrencySymbol(user?.currency)})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Month</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                    className="input-field"
                    required
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        {format(new Date(2000, month - 1), 'MMMM')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="input-field"
                    required
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  {editingBudget ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingBudget(null);
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

export default Budgets;
