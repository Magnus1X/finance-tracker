import { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getCurrencySymbol } from '../utils/currency';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiArrowUpRight, FiArrowDownRight, FiFilter, FiClock } from 'react-icons/fi';
import { FcComboChart, FcIdea } from 'react-icons/fc';

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

const History = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
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

  const symbol = getCurrencySymbol(user?.currency);

  // Histogram: group transactions by amount bins
  const buildHistogram = () => {
    if (transactions.length === 0) return [];
    const amounts = transactions.map((t) => t.amount).filter(Boolean);
    const maxAmt = Math.max(...amounts);
    // Create ~8 equal-width bins
    const binCount = 8;
    const binSize = Math.ceil(maxAmt / binCount);
    const bins = Array.from({ length: binCount }, (_, i) => ({
      range: `${symbol}${(i * binSize).toLocaleString()}–${symbol}${((i + 1) * binSize).toLocaleString()}`,
      income: 0,
      expense: 0,
      total: 0,
    }));
    transactions.forEach((t) => {
      const idx = Math.min(Math.floor(t.amount / binSize), binCount - 1);
      if (t.type === 'income') bins[idx].income += 1;
      else bins[idx].expense += 1;
      bins[idx].total += 1;
    });
    return bins.filter((b) => b.total > 0);
  };
  const histogramData = buildHistogram();

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net = totalIncome - totalExpense;

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

      {/* Histogram */}
      {!loading && histogramData.length > 0 && (
        <div className={`card shadow-xl relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'
          }`}>
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10 flex-wrap gap-3">
            <h2 className={`text-xl font-black uppercase tracking-tighter flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'
              }`}>
              <span className="w-2 h-6 bg-emerald-500 rounded-full" /> Amount Distribution
            </h2>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${darkMode ? 'border-slate-700 text-slate-400 bg-slate-800' : 'border-slate-200 text-slate-500 bg-slate-50'
              }`}>Histogram · {transactions.length} transactions</span>
          </div>
          <div className="relative z-10">
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={histogramData} margin={{ top: 10, right: 20, left: 10, bottom: 60 }} barGap={0} barCategoryGap="0%">
                <defs>
                  <linearGradient id="histIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="histExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#64748b' : '#94a3b8', fontSize: 10, fontWeight: 'bold' }} interval={0} angle={-35} textAnchor="end" height={60} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#64748b' : '#94a3b8', fontSize: 11, fontWeight: 'bold' }} allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: darkMode ? '#475569' : '#cbd5e1', fontSize: 11, fontWeight: 'bold' }} />
                <Tooltip cursor={false} contentStyle={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', border: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`, borderRadius: '14px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)', color: darkMode ? '#fff' : '#0f172a', fontWeight: 'bold', fontSize: '12px' }} formatter={(value, name) => [value + ' txns', name]} />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '8px' }} formatter={(value) => <span style={{ color: darkMode ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{value}</span>} />
                <Bar dataKey="income" stackId="a" fill="url(#histIncome)" name="Income" radius={[0, 0, 0, 0]} />
                <Bar dataKey="expense" stackId="a" fill="url(#histExpense)" name="Expense" radius={[4, 4, 0, 0]} />
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
