import { useState, useEffect, useRef } from 'react';
import { transactionAPI, budgetAPI } from '../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPieChart, FiCalendar } from 'react-icons/fi';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol } from '../utils/currency';

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Date Range State
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  const cardRefs = useRef([]);

  useEffect(() => {
    fetchDashboardData();
  }, [startDate, endDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, budgetsRes, transactionsRes] = await Promise.all([
        transactionAPI.getAnalytics({ startDate, endDate }).catch(() => ({ data: { data: { income: 0, expenses: 0, savings: 0, categoryBreakdown: {}, dailyStats: [] } } })),
        budgetAPI.getHistory({ startDate, endDate }).catch(() => ({ data: { data: [] } })),
        transactionAPI.getAll({ limit: 5 }).catch(() => ({ data: { data: [] } })),
      ]);

      setAnalytics(analyticsRes.data.data);
      setBudgets(budgetsRes.data.data);
      setRecentTransactions(transactionsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for demo
      setAnalytics({ income: 0, expenses: 0, savings: 0, categoryBreakdown: {}, dailyStats: [] });
      setBudgets([]);
      setRecentTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const chartData = budgets.map((budget) => ({
    name: budget.category,
    budgeted: budget.budgetedAmount ?? budget.amount,
    spent: budget.spentAmount ?? budget.spent,
    remaining: Math.max(0, (budget.budgetedAmount ?? budget.amount) - (budget.spentAmount ?? budget.spent)),
  }));

  const pieData = analytics?.categoryBreakdown
    ? Object.entries(analytics.categoryBreakdown).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }))
    : [];
    
  const lineChartData = analytics?.dailyStats || [];

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">Overview of your finances</p>
        </div>
        
        {/* Date Range Picker */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-400" />
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-sm focus:outline-none text-slate-700 dark:text-slate-200"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-sm focus:outline-none text-slate-700 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="glass card">
        <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">Period Summary</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          From <span className="font-semibold text-slate-800 dark:text-slate-200">{format(new Date(startDate), 'MMM dd, yyyy')}</span> to <span className="font-semibold text-slate-800 dark:text-slate-200">{format(new Date(endDate), 'MMM dd, yyyy')}</span>, 
          you earned <span className="font-bold text-emerald-600">{getCurrencySymbol(user?.currency)}{analytics?.income?.toFixed(2)}</span> and 
          spent <span className="font-bold text-rose-600">{getCurrencySymbol(user?.currency)}{analytics?.expenses?.toFixed(2)}</span>.
          Your net savings for this period is <span className={`font-bold ${analytics?.savings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{getCurrencySymbol(user?.currency)}{analytics?.savings?.toFixed(2)}</span>.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="glass card group hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mb-1 font-medium">Total Income</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {getCurrencySymbol(user?.currency)}{analytics?.income?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div
          ref={(el) => (cardRefs.current[1] = el)}
          className="glass card group hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                {getCurrencySymbol(user?.currency)}{analytics?.expenses?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div
          ref={(el) => (cardRefs.current[2] = el)}
          className="glass card group hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">Savings</p>
              <p className={`text-2xl font-bold ${(analytics?.savings || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {getCurrencySymbol(user?.currency)}{analytics?.savings?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        <div
          ref={(el) => (cardRefs.current[3] = el)}
          className="glass card group hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mb-1 font-medium">Active Budgets</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{budgets.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <FiPieChart className="text-xl text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Income vs Expense Graph */}
      <div className="glass card">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Income vs Expense</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={lineChartData}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'MMM dd')} />
            <YAxis />
            <Tooltip labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')} />
            <Legend />
            <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" name="Income" />
            <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" name="Expense" />
          </AreaChart>
        </ResponsiveContainer>
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
                    {transaction.type === 'income' ? '+' : '-'}{getCurrencySymbol(user?.currency)}{transaction.amount.toFixed(2)}
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
