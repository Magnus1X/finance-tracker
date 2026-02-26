import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcCalculator, FcMoneyTransfer, FcComboChart, FcCurrencyExchange } from 'react-icons/fc';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const FinancialTools = () => {
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
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Financial <span className="text-primary-600">Planners</span></h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">See how your money can grow, or plan your way out of debt.</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/50 max-w-sm mx-auto">
                {['SIP', 'EMI'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === tab
                            ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-md'
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
                        <div className="lg:col-span-5 card p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">I can invest...</label>
                                    <span className="text-primary-600 font-black text-lg">₹{sipMonthly.toLocaleString()}</span>
                                </div>
                                <input type="range" min="500" max="100000" step="500" value={sipMonthly} onChange={e => setSipMonthly(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Expected Return (p.a)</label>
                                    <span className="text-primary-600 font-black text-lg">{sipRate}%</span>
                                </div>
                                <input type="range" min="1" max="30" step="0.5" value={sipRate} onChange={e => setSipRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">For this many years...</label>
                                    <span className="text-primary-600 font-black text-lg">{sipYears}y</span>
                                </div>
                                <input type="range" min="1" max="40" step="1" value={sipYears} onChange={e => setSipYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
                            </div>
                        </div>

                        {/* Visual Results */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="card p-6 h-64 border border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-black shadow-xl shadow-emerald-500/5 ">
                                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2"><FcComboChart size={16} /> Watch Your Money Grow</p>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={sipResult.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorMaturity" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            formatter={(value) => `₹${value.toLocaleString()}`}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="Maturity" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorMaturity)" />
                                        <Area type="monotone" dataKey="Invested" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="card p-6 bg-slate-50 dark:bg-[#050505] border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Invested Amount</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">₹{sipResult.invested.toLocaleString()}</p>
                                </div>
                                <div className="card p-6 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                                    <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-80">Est. Returns</p>
                                    <p className="text-2xl font-black">₹{sipResult.returns.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="card p-8 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">You Could Have</p>
                                        <p className="text-5xl font-black drop-shadow-sm">₹{sipResult.maturity.toLocaleString()}</p>
                                    </div>
                                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md dark:backdrop-blur-none border border-white/20 shadow-inner">
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
                        <div className="lg:col-span-5 card p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">I need a loan for...</label>
                                    <span className="text-primary-600 font-black text-lg">₹{emiPrincipal.toLocaleString()}</span>
                                </div>
                                <input type="range" min="100000" max="10000000" step="50000" value={emiPrincipal} onChange={e => setEmiPrincipal(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">At an interest rate of (p.a)</label>
                                    <span className="text-primary-600 font-black text-lg">{emiRate}%</span>
                                </div>
                                <input type="range" min="5" max="25" step="0.1" value={emiRate} onChange={e => setEmiRate(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pr-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">I'll pay it off over (Years)</label>
                                    <span className="text-primary-600 font-black text-lg">{emiYears}y</span>
                                </div>
                                <input type="range" min="1" max="30" step="1" value={emiYears} onChange={e => setEmiYears(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
                            </div>
                        </div>

                        {/* EMI Results */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="card p-6 h-64 border border-rose-100 dark:border-rose-900/30 bg-white dark:bg-black shadow-xl shadow-rose-500/5 ">
                                <p className="text-xs font-black text-rose-600 uppercase tracking-widest mb-4 flex items-center gap-2">Debt Paydown</p>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={emiResult.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            formatter={(value) => `₹${value.toLocaleString()}`}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="Balance" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="card p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
                                <div className="relative z-10 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-widest opacity-80 mb-1">Your Monthly Payment</p>
                                        <p className="text-5xl font-black text-rose-400">₹{emiResult.emi.toLocaleString()}</p>
                                    </div>
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md dark:backdrop-blur-none border border-white/10 shadow-inner">
                                        <FcCurrencyExchange size={32} />
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full -mr-32 -mt-32 blur-[60px]" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="card p-6 bg-slate-50 dark:bg-[#050505] border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total Loan Repayable</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">₹{emiResult.total.toLocaleString()}</p>
                                </div>
                                <div className="card p-6 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 shadow-sm">
                                    <p className="text-xs font-black uppercase tracking-widest mb-1 opacity-80">Total Interest Payable</p>
                                    <p className="text-2xl font-black">₹{emiResult.interest.toLocaleString()}</p>
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
