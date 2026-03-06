import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';
import { FcIdea, FcHighPriority, FcOk, FcLineChart, FcBullish, FcBearish, FcMoneyTransfer, FcPlus, FcMinus } from 'react-icons/fc';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol, formatCurrency } from '../utils/currency';
import CurrencyDisplay from '../components/CurrencyDisplay';
import { motion } from 'framer-motion';
import { portfolioHistory, cashFlowData, expenseCategories, recentTransactions as dummyTransactions } from '../utils/dummyData';
import { transactionAPI, budgetAPI } from '../services/api';
import { exportToCSV, exportToPDF } from '../utils/exportData';
import { FiDownload } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({ income: 0, expenses: 0, savings: 0 });
  const [budgets, setBudgets] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);


  // Date Range State
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, budgetsRes, transactionsRes] = await Promise.all([
          transactionAPI.getAnalytics({ startDate, endDate }),
          budgetAPI.getAll({ startDate, endDate }),
          transactionAPI.getAll({ limit: 5 })
        ]);

        if (analyticsRes.data.success) {
          const data = analyticsRes.data.data;
          setAnalytics({
            income: data.income || 0,
            expenses: data.expenses || 0,
            savings: data.savings || 0
          });

          // Format pie data
          const formattedPieData = Object.entries(data.categoryBreakdown || {}).map(([name, value], index) => ({
            name,
            value,
            color: COLORS[index % COLORS.length]
          }));
          setPieData(formattedPieData);

          // Format line chart data
          if (data.dailyStats) {
            const formattedLineData = data.dailyStats.map(stat => {
              const dateObj = new Date(stat.date);
              return {
                month: format(dateObj, 'MMM dd'),
                fullDate: format(dateObj, 'MMM dd, yyyy'),
                portfolioValue: stat.income - stat.expense, // Simple proxy for net worth change on that day
                investments: 0 // Optional: fetch investment specific data if available
              }
            });
            // Accumulate to make it look like portfolio history over time if desired, or just show daily net.
            // For a true net worth, we would need a starting balance. Here we just show daily variations.
            let cumulative = 0;
            const cumulativeData = formattedLineData.map(d => {
              cumulative += d.portfolioValue;
              return { ...d, portfolioValue: cumulative };
            });
            setLineChartData(cumulativeData);
          }
        }

        if (budgetsRes.data.success) {
          setBudgets(budgetsRes.data.data || []);
        }

        if (transactionsRes.data.success) {
          setRecentTransactions(transactionsRes.data.data || []);
        }

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [startDate, endDate]);

  const COLORS = ['#0f766e', '#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#facc15', '#fb923c', '#ec4899'];

  const totalExpenseValue = pieData.reduce((sum, entry) => sum + entry.value, 0);

  const handleExportPDF = async () => {
    try {
      // Fetch all transactions within the selected date range
      const [allTransactionsRes, allBudgetsRes] = await Promise.all([
        transactionAPI.getAll({ limit: 1000, startDate, endDate }),
        budgetAPI.getAll({ startDate, endDate })
      ]);
      const fullTxs = allTransactionsRes.data.data || [];
      const fullBudgets = allBudgetsRes.data.data || [];
      exportToPDF(fullTxs, fullBudgets, user);
    } catch (e) {
      console.error("Failed to export PDF", e);
    }
  };

  const handleExportCSV = async () => {
    try {
      const [allTransactionsRes, allBudgetsRes] = await Promise.all([
        transactionAPI.getAll({ limit: 1000, startDate, endDate }),
        budgetAPI.getAll({ startDate, endDate })
      ]);
      const fullTxs = allTransactionsRes.data.data || [];
      const fullBudgets = allBudgetsRes.data.data || [];
      exportToCSV(fullTxs, fullBudgets);
    } catch (e) {
      console.error("Failed to export CSV", e);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-1 uppercase">Dashboard</h1>
          <p className="text-slate-500 font-bold text-xs tracking-wide uppercase">{format(new Date(), 'MMMM yyyy')} Overview</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors border border-emerald-200 dark:border-emerald-800 text-sm font-bold shadow-sm"
              title="Download PDF Report"
            >
              <FiDownload size={16} /> PDF
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 text-sm font-bold shadow-sm"
              title="Download CSV Data"
            >
              <FiDownload size={16} /> CSV
            </button>
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center gap-3 bg-white dark:bg-[#050505] p-3 px-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <FiCalendar className="text-emerald-600" size={18} />
            <div className="flex items-center gap-3 text-sm font-black text-slate-900 dark:text-slate-100">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              />
              <span className="text-slate-300">/</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: analytics?.income, color: 'text-emerald-600', icon: FcBullish },
          { label: 'Expenditure', value: analytics?.expenses, color: 'text-rose-600', icon: FcBearish },
          { label: 'Net Capital Surplus', value: analytics?.savings, color: analytics?.savings >= 0 ? 'text-emerald-600' : 'text-rose-600', icon: FcMoneyTransfer }
        ].map((stat, i) => (
          <div key={i} className="card group relative overflow-hidden bg-white/70 dark:bg-[#050505] backdrop-blur-2xl dark:backdrop-blur-none border border-white/40 dark:border-slate-800 shadow-xl shadow-slate-200/50  hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-1 relative z-10 w-full overflow-hidden">
              <CurrencyDisplay
                amount={stat.value || 0}
                className="text-slate-900 dark:text-white"
                symbolClassName={`${stat.color} opacity-100`}
                valueClassName="text-3xl md:text-4xl drop-shadow-sm"
              />
            </div>
            {/* Subtle glow effect behind numbers */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700" />
          </div>
        ))}
      </div>

      {/* Smart Insights & Budget Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Insights Card */}
        <div className="card relative overflow-hidden shadow-xl p-0 border-0 bg-white dark:bg-white">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Data Abstract" className="absolute inset-0 w-full h-full object-cover opacity-5 contrast-100 grayscale mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-slate-50/95" />

          <div className="relative z-10 p-8 h-full flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shadow-sm border border-slate-200">
                  <FcIdea size={32} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Your Financial Insights</h2>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {(() => {
                const insights = [];
                const inc = analytics?.income || 0;
                const exp = analytics?.expenses || 0;
                const sav = analytics?.savings || 0;
                const savRate = inc > 0 ? (sav / inc) * 100 : 0;
                const sym = getCurrencySymbol(user?.currency);

                // Case 1: No data
                if (inc === 0 && exp === 0) {
                  insights.push({
                    type: 'neutral',
                    icon: FcIdea,
                    color: 'text-slate-500',
                    bgHover: 'bg-slate-500/10',
                    title: 'Welcome to your Dashboard',
                    desc: 'Start logging your income and expenses to unlock personalized financial insights.'
                  });
                } else if (exp > inc && inc > 0) {
                  insights.push({
                    type: 'alert',
                    icon: FcHighPriority,
                    color: 'text-rose-600',
                    bgHover: 'bg-rose-500/10',
                    title: 'Spending Alert',
                    desc: <>You've spent <span className="text-rose-700 font-financial font-bold">{sym}{Math.abs(sav).toLocaleString()}</span> more than you earned. Let's look at your budget to find some savings.</>
                  });
                } else if (exp > inc && inc === 0) {
                  insights.push({
                    type: 'alert',
                    icon: FcHighPriority,
                    color: 'text-rose-600',
                    bgHover: 'bg-rose-500/10',
                    title: 'High Burn Rate',
                    desc: <>You have expenses of <span className="font-financial font-bold">{sym}{exp.toLocaleString()}</span> with no recorded income. Ensure your income is fully tracked.</>
                  });
                }

                // Case 3: Savings
                if (savRate >= 50 && inc > 0) {
                  insights.push({
                    type: 'success',
                    icon: FcOk,
                    color: 'text-emerald-600',
                    bgHover: 'bg-emerald-500/10',
                    title: 'Stellar Savings',
                    desc: <>Amazing! You're saving <strong className="text-emerald-700">{savRate.toFixed(1)}%</strong> of your income. Consider investing the surplus to accelerate wealth growth.</>
                  });
                } else if (savRate >= 20 && inc > 0) {
                  insights.push({
                    type: 'success',
                    icon: FcOk,
                    color: 'text-emerald-600',
                    bgHover: 'bg-emerald-500/10',
                    title: 'Healthy Cash Flow',
                    desc: <>You're saving <strong className="text-emerald-700">{savRate.toFixed(1)}%</strong> of your income, which is right on track for healthy financial growth.</>
                  });
                } else if (savRate > 0 && savRate < 20 && inc > 0) {
                  insights.push({
                    type: 'warning',
                    icon: FcIdea,
                    color: 'text-amber-600',
                    bgHover: 'bg-amber-500/10',
                    title: 'Tight Margin',
                    desc: <>You're saving <strong className="text-amber-700">{savRate.toFixed(1)}%</strong> of your income. Consider looking for small expenses to trim to boost your savings rate.</>
                  });
                }

                // Case 4: Budget Alerts
                if (budgets && budgets.length > 0) {
                  const overBudgets = budgets.filter(b => {
                    const spent = b.spentAmount ?? b.spent ?? 0;
                    const limit = b.budgetedAmount ?? b.amount ?? 1;
                    return (spent / limit) > 0.9;
                  });
                  if (overBudgets.length > 0) {
                    insights.push({
                      type: 'warning',
                      icon: FcHighPriority,
                      color: 'text-amber-600',
                      bgHover: 'bg-amber-500/10',
                      title: 'Budget Alert',
                      desc: `You are nearing or exceeding your limit in ${overBudgets.length} categor${overBudgets.length > 1 ? 'ies' : 'y'}: ${overBudgets.map(b => b.category).join(', ')}.`
                    });
                  }
                }

                // Case 5: Highest spending category
                if (pieData && pieData.length > 0) {
                  const maxCat = [...pieData].sort((a, b) => b.value - a.value)[0];
                  if (maxCat && maxCat.value > 0 && exp > 0) {
                    const catPercent = (maxCat.value / exp) * 100;
                    if (catPercent > 40) {
                      insights.push({
                        type: 'info',
                        icon: FcLineChart,
                        color: 'text-sky-600',
                        bgHover: 'bg-sky-500/10',
                        title: 'Spending Concentration',
                        desc: <><strong className="text-sky-700">{maxCat.name}</strong> makes up {catPercent.toFixed(1)}% of your total expenses. Ensure this aligns with your priorities.</>
                      });
                    }
                  }
                }

                // Always have a fallback insight if we only have < 2 insights
                if (insights.length < 2 && inc > 0 && exp > 0) {
                  insights.push({
                    type: 'info',
                    icon: FcLineChart,
                    color: 'text-sky-600',
                    bgHover: 'bg-sky-500/10',
                    title: 'Looking Ahead',
                    desc: "Your baseline spending seems consistent. You have enough cash flow to cover your upcoming bills this week."
                  });
                }

                return insights.slice(0, 3).map((insight, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white/5 backdrop-blur-md dark:backdrop-blur-none border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className={`absolute inset-0 ${insight.bgHover} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="flex items-start gap-5 relative z-10">
                      <insight.icon className="mt-1 drop-shadow-sm shrink-0" size={32} />
                      <div>
                        <h4 className={`text-sm font-black ${insight.color} uppercase mb-2 tracking-widest`}>{insight.title}</h4>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          {insight.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Budget Health Card */}
        <div className="card">
          <h2 className="text-lg font-black mb-6 text-slate-900 dark:text-white uppercase tracking-tighter">Expenditure Controls</h2>
          <div className="space-y-8">
            {budgets.length > 0 ? budgets.slice(0, 3).map((budget, i) => {
              const spent = budget.spentAmount ?? budget.spent ?? 0;
              const limit = budget.budgetedAmount ?? budget.amount ?? 1;
              const percent = Math.min(100, (spent / limit) * 100);
              return (
                <div key={i} className="mb-5 last:mb-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">{budget.category}</span>
                      <div className="font-financial text-lg font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-1">
                        <CurrencyDisplay amount={spent} />
                        <span className="text-slate-400">/</span>
                        <CurrencyDisplay amount={limit} />
                      </div>
                    </div>
                    <span className={`text-xs font-black px-2 py-1 rounded-lg ${percent > 90 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {percent.toFixed(0)}% Utilized
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className={`h-full ${percent > 90 ? 'bg-rose-500' : 'bg-emerald-600'}`}
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-center px-6 bg-slate-50/50 dark:bg-[#050505]">
                <FcIdea className="mb-6 drop-shadow-md grayscale opacity-50" size={56} />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed">No primary budget models identified. <br /> Establish a monitoring threshold.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Section (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Income vs Expense Graph */}
        <div className="lg:col-span-8 card">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Wealth Growth</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-[10px] font-black uppercase text-slate-400">Net Worth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-[10px] font-black uppercase text-slate-400">Investments</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineChartData}>
                <defs>
                  <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  tickFormatter={(val) => `${getCurrencySymbol(user?.currency)}${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                  labelFormatter={(value, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.fullDate;
                    }
                    return value;
                  }}
                />
                <Area type="monotone" dataKey="portfolioValue" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNetWorth)" name="Net Worth" />
                <Area type="monotone" dataKey="investments" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={0.1} fill="none" name="Investments" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown (Donut) */}
        <div className="lg:col-span-4 card flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6">Category Split</h2>

            <div className="relative w-full h-64 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Total value in the center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Total</span>
                <CurrencyDisplay
                  amount={totalExpenseValue}
                  className="text-lg text-slate-900 dark:text-white font-black"
                  valueClassName="font-financial"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-8">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full shadow-sm border-2 border-white dark:border-slate-900" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{entry.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-900 px-2 py-1 rounded-md shadow-sm border border-slate-100 dark:border-slate-800">
                    {Math.round((entry.value / totalExpenseValue) * 100)}%
                  </span>
                  <CurrencyDisplay amount={entry.value} className="text-sm text-slate-900 dark:text-white font-bold ml-1" valueClassName="font-financial" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Recent Audit Log</h2>
          <Link to="/transactions" className="btn-secondary py-2 px-6 text-[10px] tracking-widest flex items-center gap-2">
            Full Ledger <FiArrowRight />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b-2 border-slate-100 dark:border-slate-800">
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Vector</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Execution Date</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Net Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="py-6">
                    <div className="flex items-center gap-5">
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-base tracking-tight leading-tight">{transaction.category}</p>
                        <p className="text-xs font-bold text-slate-400 truncate max-w-[250px] mt-0.5">{transaction.description || 'System generated entry'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 text-center">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">{format(new Date(transaction.date), 'dd MMM yyyy')}</span>
                  </td>
                  <td className="py-6 text-right">
                    <div className="text-right">
                      <div className={`text-sm ${transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                        <span>{transaction.type === 'income' ? '+' : '-'}</span>
                        <CurrencyDisplay amount={transaction.amount} valueClassName="font-financial" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{transaction.category}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
