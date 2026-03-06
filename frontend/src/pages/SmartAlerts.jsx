import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiArrowRight, FiCheck } from 'react-icons/fi';
import { FcHighPriority, FcApproval, FcIdea, FcFlashOn, FcMoneyTransfer, FcComboChart } from 'react-icons/fc';
import { transactionAPI, budgetAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol } from '../utils/currency';
import { startOfMonth, endOfMonth, format } from 'date-fns';

const SmartAlerts = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dismissed, setDismissed] = useState(new Set());

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
                const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');

                const [analyticsRes, budgetsRes] = await Promise.all([
                    transactionAPI.getAnalytics({ startDate, endDate }).catch(() => ({ data: { data: {} } })),
                    budgetAPI.getAll({ startDate, endDate }).catch(() => ({ data: { data: [] } }))
                ]);

                const data = analyticsRes.data.data;
                const budgets = budgetsRes.data.data || [];
                const generatedAlerts = [];
                let alertId = 1;
                const sym = getCurrencySymbol(user?.currency);

                const inc = data.income || 0;
                const exp = data.expenses || 0;
                const sav = data.savings || 0;

                // 1. Spending > Income Alert
                if (exp > inc && inc > 0) {
                    generatedAlerts.push({
                        id: alertId++,
                        type: 'danger',
                        title: 'Deficit Warning',
                        message: `Your spending this month (${sym}${exp.toLocaleString()}) has exceeded your income by ${sym}${Math.abs(sav).toLocaleString()}. It's time to pause non-essential purchases.`,
                        time: 'Just now',
                        icon: <FcHighPriority size={32} />,
                        colorClass: 'rose'
                    });
                }

                // 2. Financial Goal Achieved / High Savings
                if (sav > 0 && (sav / inc) >= 0.2) {
                    generatedAlerts.push({
                        id: alertId++,
                        type: 'success',
                        title: 'Financial Goal Milestone!',
                        message: `Awesome job! You've secured ${sym}${sav.toLocaleString()} in surplus this month. You are firmly on track to hit your year-end financial goals.`,
                        time: '2 hours ago',
                        icon: <FcApproval size={32} />,
                        colorClass: 'emerald'
                    });
                }

                // 3. Budgets Near Limit
                const overBudgets = budgets.filter(b => {
                    const spent = b.spentAmount ?? b.spent ?? 0;
                    const limit = b.budgetedAmount ?? b.amount ?? 1;
                    return (spent / limit) >= 0.9 && (spent / limit) < 1.0;
                });
                if (overBudgets.length > 0) {
                    const b = overBudgets[0];
                    generatedAlerts.push({
                        id: alertId++,
                        type: 'warning',
                        title: `${b.category} Budget Nearing Limit`,
                        message: `You've used over 90% of your ${b.category} budget. You have ${sym}${((b.budgetedAmount ?? b.amount) - (b.spentAmount ?? b.spent)).toLocaleString()} left for the rest of the month.`,
                        time: '5 hours ago',
                        icon: <FcComboChart size={32} />,
                        colorClass: 'amber'
                    });
                }

                const exceededBudgets = budgets.filter(b => {
                    const spent = b.spentAmount ?? b.spent ?? 0;
                    const limit = b.budgetedAmount ?? b.amount ?? 1;
                    return (spent / limit) >= 1.0;
                });
                if (exceededBudgets.length > 0) {
                    const b = exceededBudgets[0];
                    generatedAlerts.push({
                        id: alertId++,
                        type: 'danger',
                        title: `Budget Exceeded`,
                        message: `You've overspent your ${b.category} budget by ${sym}${((b.spentAmount ?? b.spent) - (b.budgetedAmount ?? b.amount)).toLocaleString()}. Try to compensate by saving in other categories.`,
                        time: '1 day ago',
                        icon: <FcMoneyTransfer size={32} />,
                        colorClass: 'rose'
                    });
                }

                // 4. Default / Info
                generatedAlerts.push({
                    id: alertId++,
                    type: 'info',
                    title: 'Food for thought',
                    message: "Did you know that investing the cost of a daily coffee could turn into hundreds of thousands over a decade? Every small choice compounds!",
                    time: '1 day ago',
                    icon: <FcIdea size={32} />,
                    colorClass: 'sky'
                });

                setAlerts(generatedAlerts);
            } catch (error) {
                console.error("Failed to fetch alerts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, [user?.currency]);

    const handleDismiss = (id) => {
        setDismissed(prev => new Set([...prev, id]));
    };

    const activeAlerts = alerts.filter(a => !dismissed.has(a.id));

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div className="flex justify-between items-center bg-white/40 dark:bg-[#050505]/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative z-10 w-full flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 uppercase flex items-center gap-3">
                            <span className="w-2 h-8 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
                            Smart <span className="text-emerald-600 drop-shadow-sm">Reminders</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs pl-5">AI-Powered Financial Nudges</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center relative">
                        <FiBell className="text-slate-800 dark:text-slate-200" size={24} />
                        {activeAlerts.length > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-black text-white"
                            >
                                {activeAlerts.length}
                            </motion.span>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-6 relative">
                    <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-emerald-500/0 via-slate-200 dark:via-slate-800 to-emerald-500/0 hidden md:block" />

                    <AnimatePresence>
                        {activeAlerts.length > 0 ? activeAlerts.map((alert, i) => {
                            const colors = {
                                rose: 'hover:shadow-rose-500/10 border-rose-100 dark:border-rose-900/30 group-hover:border-rose-200',
                                emerald: 'hover:shadow-emerald-500/10 border-emerald-100 dark:border-emerald-900/30 group-hover:border-emerald-200',
                                sky: 'hover:shadow-sky-500/10 border-sky-100 dark:border-sky-900/30 group-hover:border-sky-200',
                                amber: 'hover:shadow-amber-500/10 border-amber-100 dark:border-amber-900/30 group-hover:border-amber-200',
                            };

                            const btnColors = {
                                rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 hover:bg-rose-600 hover:text-white',
                                emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white',
                                sky: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 hover:bg-sky-600 hover:text-white',
                                amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 hover:bg-amber-500 hover:text-white',
                            };

                            return (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                                    className={`group p-8 md:ml-16 rounded-[2rem] border bg-white/80 dark:bg-[#050505] backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start relative z-10 ${colors[alert.colorClass]}`}
                                >
                                    <div className="absolute -left-[4.5rem] top-8 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800 group-hover:border-emerald-500 transition-colors hidden md:block" />

                                    <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center flex-shrink-0 shadow-inner border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-500">
                                        {alert.icon}
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                                            <h4 className={`text-xl font-black text-slate-900 dark:text-white tracking-tighter`}>
                                                {alert.title}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">{alert.time}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6 text-sm">
                                            {alert.message}
                                        </p>
                                        <div className="flex gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                                            <button className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${btnColors[alert.colorClass]}`}>
                                                Take Action <FiArrowRight />
                                            </button>
                                            <button onClick={() => handleDismiss(alert.id)} className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-black uppercase tracking-widest transition-all bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                                                <FiCheck /> Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        }) : (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50/50 dark:bg-[#050505]"
                            >
                                <FcApproval size={64} className="mx-auto mb-6 grayscale opacity-50" />
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">All Caught Up!</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">You have no pending reminders. Keep up the great work.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Persistence Awareness Card */}
            <div className="p-10 bg-slate-900 dark:bg-emerald-950/20 text-white rounded-[3rem] shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80')] opacity-5 bg-cover pointer-events-none mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
                                <FcFlashOn size={28} />
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Small Steps, Big Impact</h3>
                        </div>
                        <p className="text-slate-300 text-sm font-medium leading-relaxed mb-6 max-w-xl italic border-l-2 border-emerald-500 pl-4">
                            "Do not save what is left after spending, but spend what is left after saving."
                        </p>
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">— Warren Buffett</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartAlerts;
