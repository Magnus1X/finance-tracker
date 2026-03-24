import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTarget, FiPlus, FiTrash2, FiFlag, FiTrendingUp, FiClock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getCurrencySymbol } from '../utils/currency';
import { goalAPI } from '../services/api';

const FinancialGoals = () => {
    const { user } = useAuth();
    const sym = getCurrencySymbol(user?.currency);
    const [goals, setGoals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showTrackForm, setShowTrackForm] = useState(null); // ID of goal being tracked
    const [trackAmount, setTrackAmount] = useState('');
    const [newGoal, setNewGoal] = useState({ title: '', target: '', deadline: '' });
    const [isLoading, setIsLoading] = useState(true);

    const fetchGoals = async () => {
        try {
            const res = await goalAPI.getAll();
            setGoals(res.data.data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const addGoal = async () => {
        if (!newGoal.title || !newGoal.target || !newGoal.deadline) return;
        try {
            const res = await goalAPI.create(newGoal);
            setGoals([res.data.data, ...goals]);
            setNewGoal({ title: '', target: '', deadline: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error adding goal:', error);
        }
    };

    const deleteGoal = async (id) => {
        try {
            await goalAPI.delete(id);
            setGoals(goals.filter(g => g.id !== id));
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    const updateGoalProgress = async (goal) => {
        if (!trackAmount || isNaN(trackAmount) || trackAmount <= 0) return;
        try {
            const newCurrent = (goal.current || 0) + parseFloat(trackAmount);
            const res = await goalAPI.update(goal.id, { current: newCurrent });
            setGoals(goals.map(g => g.id === goal.id ? res.data.data : g));
            setShowTrackForm(null);
            setTrackAmount('');
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };

    const getMonthsLeft = (deadline) => {
        if (!deadline) return 1;
        const d = new Date(deadline);
        const now = new Date();
        const months = (d.getFullYear() - now.getFullYear()) * 12 + (d.getMonth() - now.getMonth());
        return months > 0 ? months : 1;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-16 px-4 md:px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Financial <span className="text-emerald-500">Goals</span></h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Turn your dreams into achievable milestones.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 px-5 flex items-center justify-center gap-2 shadow-sm text-xs tracking-widest uppercase font-bold w-full md:w-auto transition-colors"
                >
                    <FiPlus size={16} />
                    <span>Set New Goal</span>
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm mb-6"
                    >
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Create Target Goal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <input
                                placeholder="Goal Title (e.g. Travel)"
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                                value={newGoal.title}
                                onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Target Amount"
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                                value={newGoal.target}
                                onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                            />
                            <input
                                type="date"
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                                value={newGoal.deadline}
                                onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={addGoal} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm transition-colors">Save Goal</button>
                            <button onClick={() => setShowForm(false)} className="px-5 py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold text-xs uppercase tracking-widest transition-colors bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading ? (
                <div className="flex justify-center p-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : goals.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No financial goals set yet. Click "Set New Goal" to start tracking!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => {
                    const progress = (goal.current / goal.target) * 100;
                    const monthsLeft = getMonthsLeft(goal.deadline);
                    const amountPerMonth = Math.round((goal.target - goal.current) / monthsLeft);
                    return (
                        <motion.div
                            key={goal.id}
                            layout
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/50">
                                        <FiTarget className="text-emerald-600" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-0.5">{goal.title}</h4>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                            <FiClock size={10} />
                                            <span>By {goal.deadline}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => setShowTrackForm(showTrackForm === goal.id ? null : goal.id)}
                                        className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                        title="Add Funds"
                                    >
                                        <FiPlus size={14} />
                                    </button>
                                    <button
                                        onClick={() => deleteGoal(goal.id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                        title="Delete Goal"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Progress</p>
                                        <p className="text-base font-bold font-financial text-slate-900 dark:text-white flex items-end gap-1">
                                            {sym}{goal.current.toLocaleString()} 
                                            <span className="text-slate-400 text-xs font-sans pb-0.5">/ {sym}{goal.target.toLocaleString()}</span>
                                        </p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${progress >= 75 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                                        }`}>
                                        {Math.min(progress, 100).toFixed(0)}% Achieved
                                    </span>
                                </div>

                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${Math.min(progress, 100)}%` }}
                                        className={`h-full bg-gradient-to-r ${progress >= 75 ? 'from-emerald-400 to-emerald-500' : 'from-emerald-300 to-emerald-400'}`}
                                    />
                                </div>

                                {/* Tracking Form Box */}
                                <AnimatePresence>
                                    {showTrackForm === goal.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder={`Amount in ${sym}`}
                                                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                                                        value={trackAmount}
                                                        onChange={e => setTrackAmount(e.target.value)}
                                                    />
                                                    <button onClick={() => updateGoalProgress(goal)} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-sm transition-colors whitespace-nowrap">
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-slate-800/80 border border-emerald-100/50 dark:border-slate-700/50 flex items-center gap-2.5">
                                    <FiTrendingUp className="text-emerald-500" size={12} />
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                        Save {sym}{amountPerMonth.toLocaleString()} / mo for {monthsLeft} mo{monthsLeft !== 1 ? 's' : ''} to reach goal
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            )}
        </div>
    );
};

export default FinancialGoals;
