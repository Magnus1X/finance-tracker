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
    const [newGoal, setNewGoal] = useState({ title: '', target: '', deadline: '', icon: '🎯' });
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
            setNewGoal({ title: '', target: '', deadline: '', icon: '🎯' });
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

    const getMonthsLeft = (deadline) => {
        if (!deadline) return 1;
        const d = new Date(deadline);
        const now = new Date();
        const months = (d.getFullYear() - now.getFullYear()) * 12 + (d.getMonth() - now.getMonth());
        return months > 0 ? months : 1;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Financial <span className="text-primary-600">Goals</span></h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Turn your dreams into achievable milestones.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-2xl shadow-xl w-full md:w-auto"
                >
                    <FiPlus className="w-5 h-5" />
                    <span>Set New Goal</span>
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card p-8 border-2 border-primary-500/20"
                    >
                        <h3 className="text-xl font-bold mb-6">Create Target Goal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <input
                                placeholder="Goal Title (e.g. Travel)"
                                className="input-field"
                                value={newGoal.title}
                                onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Target Amount"
                                className="input-field"
                                value={newGoal.target}
                                onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                            />
                            <input
                                type="date"
                                className="input-field"
                                value={newGoal.deadline}
                                onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={addGoal} className="btn-primary px-8 py-3 rounded-xl">Save Goal</button>
                            <button onClick={() => setShowForm(false)} className="px-8 py-3 text-slate-500 font-bold hover:text-slate-700">Cancel</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : goals.length === 0 ? (
                <div className="text-center py-20 card border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400">No financial goals set yet. Click "Set New Goal" to start tracking!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {goals.map((goal) => {
                    const progress = (goal.current / goal.target) * 100;
                    const monthsLeft = getMonthsLeft(goal.deadline);
                    const amountPerMonth = Math.round((goal.target - goal.current) / monthsLeft);
                    return (
                        <motion.div
                            key={goal.id}
                            layout
                            className="card p-8 hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{goal.icon}</div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{goal.title}</h4>
                                        <div className="flex items-center gap-2 text-slate-400 text-sm font-bold mt-1 uppercase tracking-wider">
                                            <FiClock />
                                            <span>By {goal.deadline}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteGoal(goal.id)}
                                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">{sym}{goal.current.toLocaleString()} <span className="text-slate-400 text-lg font-bold">/ {sym}{goal.target.toLocaleString()}</span></p>
                                    </div>
                                    <span className={`px-4 py-1 rounded-full text-xs font-black ${progress > 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-primary-50 text-primary-600'
                                        }`}>
                                        {progress.toFixed(0)}% Achieved
                                    </span>
                                </div>

                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${progress}%` }}
                                        className={`h-full bg-gradient-to-r from-primary-500 to-emerald-500`}
                                    />
                                </div>

                                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex items-center gap-3">
                                    <FiTrendingUp className="text-amber-600" />
                                    <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">
                                        You need to save {sym}{amountPerMonth.toLocaleString()} / month for the next {monthsLeft} month{monthsLeft !== 1 ? 's' : ''} to reach this goal.
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
