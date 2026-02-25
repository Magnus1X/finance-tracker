import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';

const CourseCard = ({
    provider = "DVALambda",
    status = "In Class",
    title,
    description,
    image,
    deadline,
    multiplier = "2x",
    onAction
}) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#f8fafd] dark:bg-[#0a0a0a] rounded-[2rem] p-3.5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[380px] h-full"
        >
            <div className="bg-white dark:bg-[#050505] rounded-[1.6rem] p-6 border border-slate-50 dark:border-slate-800 shadow-sm flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">{provider}</span>
                </div>

                {/* Image Section */}
                {image && (
                    <div className="w-full h-32 shrink-0 rounded-xl overflow-hidden mb-5">
                        <img src={image} alt={title} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Content Section */}
                <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.15em] bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md">{status}</span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[16px] font-black text-slate-900 dark:text-white leading-[1.4] tracking-normal mb-1">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Until {deadline.split(',')[0]}
                        </p>
                        <div className="flex items-center gap-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 px-2 py-1 border border-orange-100/50 dark:border-orange-900/30">
                            <FiZap size={12} className="text-orange-500" />
                            <span className="text-[11px] font-black text-orange-600 tracking-tighter">{multiplier}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Area */}
                <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                    <button
                        onClick={onAction}
                        className="w-full py-4 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 transition-all active:scale-95 border border-slate-100 dark:border-slate-700/50"
                    >
                        Enroll Now
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;
