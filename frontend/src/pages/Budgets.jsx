import { useState, useEffect, useRef } from 'react';
import { budgetAPI } from '../services/api';
import { FiPlus, FiEdit, FiTrash2, FiArchive } from 'react-icons/fi';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol } from '../utils/currency';

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
    if (percentage > 100) return 'bg-red-500';
    if (percentage >= 90) return 'bg-yellow-500';
    return 'bg-green-500';
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
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Create Budget
        </button>
      </div>

      {/* Month/Year Selector */}
      <div className="glass card">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="input-field"
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
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="input-field"
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
      <div className="glass card">
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
                  className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{budget.category}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(budget.year, budget.month - 1), 'MMMM yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Utilization</p>
                      <p className="text-base font-bold">{utilization.toFixed(1)}%</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FiEdit className="text-primary-600" />
                      </button>
                      <button
                        onClick={() => handleArchive(budget.id)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FiArchive className="text-purple-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budgeted: {getCurrencySymbol(user?.currency)}{budget.amount.toFixed(2)}</span>
                      <span>Spent: {getCurrencySymbol(user?.currency)}{budget.spent.toFixed(2)}</span>
                      <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                        Remaining: {getCurrencySymbol(user?.currency)}{remaining.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${getStatusColor(utilization)}`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{utilization.toFixed(1)}% utilized</span>
                      {utilization > 100 && (
                        <span className="text-red-600 font-semibold">Over Budget!</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No budgets for this month</p>
            <button
              onClick={() => {
                resetForm();
                setEditingBudget(null);
                setShowModal(true);
              }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <FiPlus /> Create your first budget
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass card w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
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
