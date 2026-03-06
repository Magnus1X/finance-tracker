import { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol } from '../utils/currency';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiArrowUpRight, FiArrowDownRight, FiFilter, FiClock } from 'react-icons/fi';
import { FcComboChart, FcIdea } from 'react-icons/fc';

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

const History = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [selectedMonth, selectedYear, selectedCategory, selectedType]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = { limit: 200 };
      if (selectedMonth) params.month = selectedMonth;
      if (selectedYear) params.year = selectedYear;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedType) params.type = selectedType;

      const response = await transactionAPI.getAll(params);
      const data = response.data?.data || response.data?.transactions || [];
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching history:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Group by category for chart
  const chartData = CATEGORIES.map((cat) => {
    const catTxns = transactions.filter((t) => t.category === cat);
    const income = catTxns.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = catTxns.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { name: cat, income, expense };
  }).filter((d) => d.income > 0 || d.expense > 0);

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net = totalIncome - totalExpense;
  const symbol = getCurrencySymbol(user?.currency);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-white/50 dark:bg-slate-800 shadow-inner flex items-center justify-center border border-white/60 dark:border-slate-700">
          <FcComboChart size={36} className="drop-shadow-md" />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">Transaction History</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Your complete financial record</p>
        </div>
      </div>

      {/* Summary Stats */}
      {!loading && transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
              <FiArrowUpRight className="text-emerald-600" size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Income</p>
              <p className="text-xl font-black text-emerald-600">{symbol}{totalIncome.toLocaleString()}</p>
            </div>
          </div>
          <div className="card shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center shrink-0">
              <FiArrowDownRight className="text-rose-500" size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Expenses</p>
              <p className="text-xl font-black text-rose-500">{symbol}{totalExpense.toLocaleString()}</p>
            </div>
          </div>
          <div className="card shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${net >= 0 ? 'bg-sky-50 dark:bg-sky-950/30' : 'bg-amber-50 dark:bg-amber-950/30'}`}>
              <FiFilter className={net >= 0 ? 'text-sky-500' : 'text-amber-500'} size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Net Balance</p>
              <p className={`text-xl font-black ${net >= 0 ? 'text-sky-500' : 'text-amber-500'}`}>{net >= 0 ? '+' : ''}{symbol}{net.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card shadow-sm border-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{format(new Date(2000, m - 1), 'MMMM')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">All Years</option>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chart */}
      {!loading && chartData.length > 0 && (
        <div className="card bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          <h2 className="text-xl font-black uppercase tracking-tighter text-white mb-8 relative z-10 flex items-center gap-3">
            <span className="w-2 h-6 bg-emerald-500 rounded-full" /> Spending by Category
          </h2>
          <div className="relative z-10">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }} barGap={4}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={1} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} tickFormatter={(v) => `${symbol}${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`} />
                <Tooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff' }} />
                <Bar dataKey="income" fill="url(#colorIncome)" name="Income" radius={[6, 6, 0, 0]} maxBarSize={36} />
                <Bar dataKey="expense" fill="url(#colorExpense)" name="Expense" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Transaction List */}
      {loading ? (
        <div className="flex items-center justify-center p-20 card">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-center px-6 bg-slate-50/50 dark:bg-[#050505] card shadow-sm">
          <FcIdea className="mb-6 drop-shadow-md grayscale opacity-50" size={64} />
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter mb-2">No Transactions Found</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No transactions match the selected filters.<br />Try adjusting or clearing the filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="group bg-white dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${txn.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-rose-50 dark:bg-rose-950/30'}`}>
                    {txn.type === 'income'
                      ? <FiArrowUpRight className="text-emerald-600" size={20} />
                      : <FiArrowDownRight className="text-rose-500" size={20} />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-sm text-slate-900 dark:text-white truncate">{txn.description || txn.category}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{txn.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <FiClock size={10} />
                        {txn.date ? format(new Date(txn.date), 'dd MMM yyyy') : '—'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-base font-black ${txn.type === 'income' ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {txn.type === 'income' ? '+' : '-'}{symbol}{txn.amount?.toLocaleString()}
                  </p>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${txn.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-500'}`}>
                    {txn.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
