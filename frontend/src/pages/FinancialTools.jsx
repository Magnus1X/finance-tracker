import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcCalculator, FcMoneyTransfer, FcComboChart, FcCurrencyExchange } from 'react-icons/fc';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol } from '../utils/currency';

const FinancialTools = () => {
    const { user } = useAuth();
    const sym = getCurrencySymbol(user?.currency);
    const [activeTab, setActiveTab] = useState('SIP');

    // SIP Calculator State
    const [sipMonthly, setSipMonthly] = useState(5000);
    const [sipRate, setSipRate] = useState(12);
    const [sipYears, setSipYears] = useState(10);

    // EMI Calculator State
    const [emiPrincipal, setEmiPrincipal] = useState(1000000);
    const [emiRate, setEmiRate] = useState(8.5);
    const [emiYears, setEmiYears] = useState(20);

    const calculateSIP = () => {
        const P = sipMonthly;
        const i = (sipRate / 100) / 12;
        const n = sipYears * 12;
        const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const invested = P * n;

        // Generate chart data for each year
        const chartData = [];
        for (let year = 1; year <= sipYears; year++) {
            const monthsStr = year * 12;
            const currentM = P * ((Math.pow(1 + i, monthsStr) - 1) / i) * (1 + i);
            const currentInv = P * monthsStr;
            chartData.push({
                year: `Year ${year}`,
                Invested: Math.round(currentInv),
                Maturity: Math.round(currentM),
            });
        }

        return { maturity: Math.round(M), invested: Math.round(invested), returns: Math.round(M - invested), chartData };
    };

    const calculateEMI = () => {
        const P = emiPrincipal;
        const r = (emiRate / 100) / 12;
        const n = emiYears * 12;
        const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalAmount = emi * n;

        // Generate chart data for remaining balance
        const chartData = [];
        let balance = P;
        for (let year = 0; year <= emiYears; year++) {
            if (year === 0) {
                chartData.push({ year: `Year 0`, Balance: Math.round(balance) });
                continue;
            }
            // principal paid in this year
            for (let m = 1; m <= 12; m++) {
                const interest = balance * r;
                const principal = emi - interest;
                balance -= principal;
            }
            chartData.push({
                year: `Year ${year}`,
                Balance: Math.max(0, Math.round(balance)),
            });
        }

        return { emi: Math.round(emi), total: Math.round(totalAmount), interest: Math.round(totalAmount - P), chartData };
    };

    const sipResult = calculateSIP();
    const emiResult = calculateEMI();

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 relative">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="text-center space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-4 border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
                    <FcCalculator size={16} /> Intelligent Calculators
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                    Financial <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 text-transparent bg-clip-text drop-shadow-sm">Planners</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium max-w-lg mx-auto">Model your future wealth or construct a precise debt-paydown strategy using our banking-grade simulation engines.</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center p-2 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 max-w-sm mx-auto relative z-10">
                {['SIP', 'EMI'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === tab
                            ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        {tab} Calculator
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'SIP' ? (
                    <motion.div
                        key="sip"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                        {/* Inputs */}
                        <div className="lg:col-span-5 card p-8 space-y-8 bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150" />
                            <div className="relative z-10 space-y-6">
                                <div className="space-y-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                                    <div className="flex justify-between items-center pr-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">I can invest...</label>
                                        <span className="text-emerald-600 font-black text-xl">{sym}{sipMonthly.toLocaleString()}</span>
                                    </div>
                                    <input type="range" min="500" max="100000" step="500" value={sipMonthly} onChange={e => setSipMonthly(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                </div>
                                <div className="space-y-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                                    <div className="flex justify-between items-center pr-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Expected Return (p.a)</label>
                                        <span className="text-emerald-600 font-black text-xl">{sipRate}%</span>
                                    </div>
                                    <input type="range" min="1" max="30" step="0.5" value={sipRate} onChange={e => setSipRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                </div>
                                <div className="space-y-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                                    <div className="flex justify-between items-center pr-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">For this many years...</label>
                                        <span className="text-emerald-600 font-black text-xl">{sipYears}y</span>
                                    </div>
                                    <input type="range" min="1" max="40" step="1" value={sipYears} onChange={e => setSipYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                    * This calculator assumes investments are made at the <strong>beginning of each month</strong>. It uses the standard SIP formula: M = P × ([(1 + i)^n - 1] / i) × (1 + i) trusted by major banks and mutual funds.
                                </p>
                            </div>
                        </div>

                        {/* Visual Results */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="card p-6 h-72 border border-emerald-100 dark:border-emerald-900/30 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-emerald-500/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors group cursor-crosshair">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2"><FcComboChart size={18} /> Projection Engine</p>
                                    <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-800/30">Auto Scaling</span>
                                </div>
                                <div className="h-48 w-full group-hover:scale-[1.01] transition-transform duration-500">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={sipResult.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorMaturity" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#059669" stopOpacity={0.5} />
                                                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Tooltip
                                                formatter={(value) => `${sym}${value.toLocaleString()}`}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                            />
                                            <Area type="monotone" dataKey="Maturity" stroke="#059669" strokeWidth={3.5} fillOpacity={1} fill="url(#colorMaturity)" />
                                            <Area type="monotone" dataKey="Invested" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="card p-6 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/20 dark:shadow-none hover:-translate-y-1 transition-transform duration-300 group">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="w-3 h-3 rounded-full bg-slate-400" /></div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Invested Amount</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white font-financial">{sym}{sipResult.invested.toLocaleString()}</p>
                                </div>
                                <div className="card p-6 bg-emerald-50/50 dark:bg-emerald-900/10 backdrop-blur-md text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg shadow-emerald-500/5 hover:-translate-y-1 transition-transform duration-300 group">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="w-3 h-3 rounded-full bg-emerald-500" /></div>
                                    <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-80">Est. Returns</p>
                                    <p className="text-3xl font-black font-financial">{sym}{sipResult.returns.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="card p-8 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/30 relative overflow-hidden hover:scale-[1.02] transition-transform duration-500 cursor-default">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-[80px] origin-center animate-[spin_10s_linear_infinite]" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-900/20 rounded-full blur-[60px]" />
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-widest text-emerald-50/80 mb-2 drop-shadow-sm">Total Projected Value</p>
                                        <p className="text-5xl lg:text-6xl font-black drop-shadow-md tracking-tighter font-financial">{sym}{sipResult.maturity.toLocaleString()}</p>
                                    </div>
                                    <div className="w-20 h-20 rounded-[2rem] bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-2xl flex-shrink-0">
                                        <FcMoneyTransfer size={32} />
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[60px]" />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="emi"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                        {/* EMI Inputs */}
                        <div className="lg:col-span-5 card p-8 space-y-8 bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150" />
                            <div className="relative z-10 space-y-6">
                                <div className="space-y-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 hover:border-rose-200 dark:hover:border-rose-800 transition-colors">
                                    <div className="flex justify-between items-center pr-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">I need a loan for...</label>
                                        <span className="text-rose-600 font-black text-xl">{sym}{emiPrincipal.toLocaleString()}</span>
                                    </div>
                                    <input type="range" min="100000" max="10000000" step="50000" value={emiPrincipal} onChange={e => setEmiPrincipal(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                                </div>
                                <div className="space-y-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 hover:border-rose-200 dark:hover:border-rose-800 transition-colors">
                                    <div className="flex justify-between items-center pr-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">At an interest rate of (p.a)</label>
                                        <span className="text-rose-600 font-black text-xl">{emiRate}%</span>
                                    </div>
                                    <input type="range" min="5" max="25" step="0.1" value={emiRate} onChange={e => setEmiRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                                </div>
                                <div className="space-y-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 hover:border-rose-200 dark:hover:border-rose-800 transition-colors">
                                    <div className="flex justify-between items-center pr-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">I'll pay it off over (Years)</label>
                                        <span className="text-rose-600 font-black text-xl">{emiYears}y</span>
                                    </div>
                                    <input type="range" min="1" max="30" step="1" value={emiYears} onChange={e => setEmiYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                                    * This calculator uses the global banking standard amortization formula: E = P × r × (1 + r)^n / [(1 + r)^n - 1] to calculate precise monthly EMI deductions.
                                </p>
                            </div>
                        </div>

                        {/* EMI Results */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="card p-6 h-72 border border-rose-100 dark:border-rose-900/30 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-rose-500/5 hover:border-rose-200 dark:hover:border-rose-800 transition-colors group cursor-crosshair">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest flex items-center gap-2">Debt Paydown</p>
                                    <span className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-rose-100 dark:border-rose-800/30">Auto Scaling</span>
                                </div>
                                <div className="h-48 w-full group-hover:scale-[1.01] transition-transform duration-500">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={emiResult.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Tooltip
                                                formatter={(value) => `${sym}${value.toLocaleString()}`}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                            />
                                            <Area type="monotone" dataKey="Balance" stroke="#f43f5e" strokeWidth={3.5} fillOpacity={1} fill="url(#colorBalance)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="card p-8 bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 text-white shadow-2xl shadow-rose-500/30 relative overflow-hidden hover:scale-[1.02] transition-transform duration-500 cursor-default">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-[80px] origin-center animate-[spin_10s_linear_infinite]" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900/20 rounded-full blur-[60px]" />
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-widest text-white/80 mb-2 drop-shadow-sm">Your Monthly Payment</p>
                                        <p className="text-5xl lg:text-6xl font-black drop-shadow-md tracking-tighter font-financial">{sym}{emiResult.emi.toLocaleString()}</p>
                                    </div>
                                    <div className="w-20 h-20 rounded-[2rem] bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-2xl flex-shrink-0">
                                        <FcCurrencyExchange size={40} className="drop-shadow-lg" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="card p-6 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/20 dark:shadow-none hover:-translate-y-1 transition-transform duration-300 group">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="w-3 h-3 rounded-full bg-slate-400" /></div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total Loan Repayable</p>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white font-financial">{sym}{emiResult.total.toLocaleString()}</p>
                                </div>
                                <div className="card p-6 bg-rose-50/50 dark:bg-rose-900/10 backdrop-blur-md text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/30 shadow-lg shadow-rose-500/5 hover:-translate-y-1 transition-transform duration-300 group">
                                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="w-3 h-3 rounded-full bg-rose-500" /></div>
                                    <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-80">Total Interest Payable</p>
                                    <p className="text-3xl font-black font-financial">{sym}{emiResult.interest.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FinancialTools;
