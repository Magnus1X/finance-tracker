import React from 'react';
import { motion } from 'framer-motion';
import { FiBell } from 'react-icons/fi';
import { FcHighPriority, FcApproval, FcIdea, FcFlashOn } from 'react-icons/fc';

const SmartAlerts = () => {
    const alerts = [
        {
            id: 1,
            type: 'warning',
            title: 'Heads up: Dining Out',
            message: "You've spent almost your entire Dining Out budget for this month. Eating in this weekend could save you a surprising amount!",
            time: '2 hours ago',
            icon: <FcHighPriority size={28} />
        },
        {
            id: 2,
            type: 'success',
            title: 'Goal Crushed! 🎉',
            message: 'Awesome job! You just put ₹5000 towards your Emergency Fund. Future you is going to be so thankful.',
            time: '5 hours ago',
            icon: <FcApproval size={28} />
        },
        {
            id: 3,
            type: 'info',
            title: 'Food for thought',
            message: "Did you know that investing the cost of a daily coffee could turn into hundreds of thousands over a decade? Every little bit helps!",
            time: '1 day ago',
            icon: <FcIdea size={28} />
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Smart <span className="text-primary-600">Reminders</span></h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Friendly nudges to help keep your finances on track.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 relative">
                    <FiBell className="w-6 h-6" />
                    <span className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800" />
                </div>
            </div>

            <div className="space-y-6 relative">
                {/* Decorative background line connecting notifications */}
                <div className="absolute left-10 top-10 bottom-10 w-px bg-gradient-to-b from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 hidden sm:block" />

                {alerts.map((alert, i) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15, type: 'spring', stiffness: 100 }}
                        className="group p-8 rounded-[2rem] border border-white/40 dark:border-slate-800 bg-white/70 dark:bg-[#050505] backdrop-blur-xl dark:backdrop-blur-none shadow-xl shadow-slate-200/50  hover:shadow-2xl hover:shadow-emerald-500/10 transition-all flex flex-col sm:flex-row gap-8 items-start relative z-10"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100 dark:border-slate-700">
                            {alert.icon}
                        </div>
                        <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                                <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors tracking-tight">
                                    {alert.title}
                                </h4>
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest whitespace-nowrap">{alert.time}</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                                {alert.message}
                            </p>
                            <div className="flex gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                                <button className="px-6 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-500/10">
                                    Take Action
                                </button>
                                <button className="px-6 py-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-black uppercase tracking-widest transition-all">
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Persistence Awareness Card */}
            <div className="card p-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden border border-slate-700">
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white/10 backdrop-blur-md dark:backdrop-blur-none rounded-2xl border border-white/10 shadow-inner">
                            <FcFlashOn size={28} />
                        </div>
                        <h3 className="text-2xl font-black italic tracking-tighter">Small steps, big impact.</h3>
                    </div>
                    <p className="text-slate-400 text-base font-medium leading-relaxed mb-8 max-w-2xl">
                        "Do not save what is left after spending, but spend what is left after saving."
                    </p>
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">— Warren Buffett</div>
                </div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/20 to-sky-500/20 rounded-full -mr-64 -mt-64 blur-[100px] pointer-events-none" />
            </div>
        </div>
    );
};

export default SmartAlerts;
