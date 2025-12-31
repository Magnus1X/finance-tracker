import { useState, useEffect, useRef } from 'react';
import { transactionAPI, budgetAPI } from '../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart } from 'react-icons/fi';
import { gsap } from 'gsap';
import { format } from 'date-fns';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardRefs = useRef([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (cardRefs.current.length > 0) {
      gsap.from(cardRefs.current, {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
  }, [analytics, budgets]);

  const fetchDashboardData = async () => {
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const [analyticsRes, budgetsRes, transactionsRes] = await Promise.all([
        transactionAPI.getAnalytics({ month, year }).catch(() => ({ data: { data: { income: 5000, expenses: 3200, savings: 1800, categoryBreakdown: { Food: 800, Rent: 2000, Transport: 400 } } } })),
        budgetAPI.getAll({ month, year }).catch(() => ({ data: { data: [] } })),
        transactionAPI.getAll({ limit: 5 }).catch(() => ({ data: { data: [] } })),
      ]);

      setAnalytics(analyticsRes.data.data);
      setBudgets(budgetsRes.data.data);
      setRecentTransactions(transactionsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for demo
      setAnalytics({ income: 5000, expenses: 3200, savings: 1800, categoryBreakdown: { Food: 800, Rent: 2000, Transport: 400 } });
      setBudgets([]);
      setRecentTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const chartData = budgets.map((budget) => ({
    name: budget.category,
    budgeted: budget.amount,
    spent: budget.spent,
    remaining: Math.max(0, budget.amount - budget.spent),
  }));

  const pieData = analytics?.categoryBreakdown
    ? Object.entries(analytics.categoryBreakdown).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
    : [];

  const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium">Overview of your finances</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          ref={(el) => (cardRefs.current[0] = el)}
          className="glass card group hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 font-medium">Total Income</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                ${analytics?.income?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg">
              <FiTrendingUp className="text-2xl text-white" />
            </div>
          </div>
        </div>

        <div
          ref={(el) => (cardRefs.current[1] = el)}
          className="glass card group hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                ${analytics?.expenses?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg">
              <FiTrendingDown className="text-2xl text-white" />
            </div>
          </div>
        </div>

        <div
          ref={(el) => (cardRefs.current[2] = el)}
          className="glass card group hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 font-medium">Savings</p>
              <p className={`text-3xl font-bold ${(analytics?.savings || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                ${analytics?.savings?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600 shadow-lg">
              <FiDollarSign className="text-2xl text-white" />
            </div>
          </div>
        </div>

        <div
          ref={(el) => (cardRefs.current[3] = el)}
          className="glass card group hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 font-medium">Active Budgets</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{budgets.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <FiPieChart className="text-2xl text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass card">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Budget vs Spent</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budgeted" fill="#0ea5e9" name="Budgeted" />
              <Bar dataKey="spent" fill="#ec4899" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass card">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Expense by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass card">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Recent Transactions</h2>
        <div className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'income'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}
                  >
                    {transaction.type === 'income' ? (
                      <FiTrendingUp className="text-green-600" />
                    ) : (
                      <FiTrendingDown className="text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{transaction.category}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  {transaction.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">{transaction.description}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-600 dark:text-slate-400 py-8 font-medium">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

