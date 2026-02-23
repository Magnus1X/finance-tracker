import { useState, useEffect } from 'react';
import { budgetAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol, formatCurrency } from '../utils/currency';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FcClock, FcComboChart, FcIdea } from 'react-icons/fc';

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
      under: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
      over: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
      met: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    };
    return (
      <span className={`px-4 py-1.5 rounded-xl border text-[10px] font-black tracking-widest uppercase ${colors[status]}`}>
        {status === 'under' ? 'Surplus' : status === 'over' ? 'Deficit' : 'Met'}
      </span>
    );
  };

  const categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-white/50 dark:bg-slate-800 shadow-inner flex items-center justify-center border border-white/60 dark:border-slate-700">
          <FcComboChart size={36} className="drop-shadow-md" />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">Intelligence Report</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Macro-level Expenditure Performance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass card flex flex-col justify-center border-0 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Target Cycle</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Aggregate Lifespan</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {format(new Date(2000, month - 1), 'MMMM')}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Fiscal Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full bg-slate-50 dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Vector</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">All Vectors</option>
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
        <div className="card bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-xl font-black uppercase tracking-tighter text-white mb-8 relative z-10 flex items-center gap-3">
            <span className="w-2 h-6 bg-emerald-500 rounded-full" /> Volume Render
          </h2>

          <div className="relative z-10">
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={6}>
                <defs>
                  <linearGradient id="colorBudgeted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={1} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} tickFormatter={(val) => `${getCurrencySymbol(user?.currency)}${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`} />
                <Tooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', color: '#fff' }} />
                <Bar dataKey="budgeted" fill="url(#colorBudgeted)" name="Allocated" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="spent" fill="url(#colorSpent)" name="Executed" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {history.length === 0 && !loading && (
        <div className="py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-center px-6 bg-slate-50/50 dark:bg-[#050505] card shadow-sm">
          <FcIdea className="mb-6 drop-shadow-md grayscale opacity-50" size={64} />
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter mb-2">Null Dataset</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No telemetry found for the selected temporal metrics.<br />Adjust filters to extrapolate.</p>
        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-20 card">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden bg-white dark:bg-[#050505] border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-8 relative z-10 w-full">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner border border-slate-100 dark:border-slate-700">
                      <FcClock size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">{item.category}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {format(new Date(item.year, item.month - 1), 'MMMM yyyy')} Log
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <div className="grid grid-cols-3 gap-2 relative z-10">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Allocated</p>
                    <CurrencyDisplay amount={item.budgetedAmount} className="text-sm text-slate-900 dark:text-white" valueClassName="font-financial" />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Executed</p>
                    <CurrencyDisplay amount={item.spentAmount} className="text-sm text-slate-900 dark:text-white" valueClassName="font-financial" />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Velocity</p>
                    <p className={`text-sm font-black ${item.utilizationPercentage > 100 ? 'text-rose-600' : 'text-emerald-600'}`}>{item.utilizationPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default History;
