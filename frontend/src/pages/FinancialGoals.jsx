import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTarget, FiPlus, FiTrash2, FiFlag, FiTrendingUp, FiClock } from 'react-icons/fi';

const FinancialGoals = () => {
    const [goals, setGoals] = useState([
        { id: 1, title: 'Emergency Fund', target: 100000, current: 45000, deadline: '2026-12-31', icon: '🛡️' },
        { id: 2, title: 'New Laptop', target: 80000, current: 20000, deadline: '2026-06-30', icon: '💻' },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: '', target: '', deadline: '', icon: '🎯' });

    const addGoal = () => {
        if (!newGoal.title || !newGoal.target) return;
        setGoals([...goals, { ...newGoal, id: Date.now(), current: 0 }]);
        setNewGoal({ title: '', target: '', deadline: '', icon: '🎯' });
        setShowForm(false);
    };

    const deleteGoal = (id) => setGoals(goals.filter(g => g.id !== id));

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {goals.map((goal) => {
                    const progress = (goal.current / goal.target) * 100;
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
                                        <p className="text-2xl font-black text-slate-900 dark:text-white">₹{goal.current.toLocaleString()} <span className="text-slate-400 text-lg font-bold">/ ₹{goal.target.toLocaleString()}</span></p>
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
                                        You need to save ₹{Math.round((goal.target - goal.current) / 10).toLocaleString()} / month to reach this goal.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default FinancialGoals;
