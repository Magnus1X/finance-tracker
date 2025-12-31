import { useState, useEffect } from 'react';
import { budgetAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol } from '../utils/currency';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const History = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [selectedMonth, selectedYear, selectedCategory]);

  const fetchHistory = async () => {
    try {
      const params = {};
      if (selectedMonth) params.month = selectedMonth;
      if (selectedYear) params.year = selectedYear;
      if (selectedCategory) params.category = selectedCategory;

      const response = await budgetAPI.getHistory(params).catch(() => ({ data: { data: [] } }));
      setHistory(response.data.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const chartData = history.map((item) => ({
    name: item.category,
    budgeted: item.budgetedAmount,
    spent: item.spentAmount,
    utilization: item.utilizationPercentage,
  }));

  const getStatusBadge = (status) => {
    const colors = {
      under: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      over: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      met: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Budget History</h1>
        <p className="text-gray-600 dark:text-gray-400">View your past budget performance</p>
      </div>

      {/* Filters */}
      <div className="glass card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input-field"
            >
              <option value="">All Months</option>
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
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart */}
      {history.length > 0 && (
        <div className="glass card">
          <h2 className="text-xl font-bold mb-4">Historical Performance</h2>
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
      )}
      {history.length === 0 && !loading && (
        <div className="glass card">
          <div className="text-center py-12">
            <p className="text-gray-500">No historical data available</p>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="glass card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{item.category}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(item.year, item.month - 1), 'MMMM yyyy')}
                    </p>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Budgeted</p>
                    <p className="text-lg font-bold">
                      {getCurrencySymbol(user?.currency)}{item.budgetedAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Spent</p>
                    <p className="text-lg font-bold">
                      {getCurrencySymbol(user?.currency)}{item.spentAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Utilization</p>
                    <p className="text-lg font-bold">{item.utilizationPercentage.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-full ${
                      item.status === 'over'
                        ? 'bg-red-500'
                        : item.status === 'met'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(item.utilizationPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No budget history found</p>
        )}
      </div>
    </div>
  );
};

export default History;
