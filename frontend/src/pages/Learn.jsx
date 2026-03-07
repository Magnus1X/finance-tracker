import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCheckCircle, FiPlay, FiStar, FiChevronRight, FiClock, FiLayers, FiArrowRight, FiActivity, FiTrendingUp } from 'react-icons/fi';
import CourseCard from '../components/CourseCard';

const Learn = () => {
    const [completedLessons, setCompletedLessons] = useState([]);
    const [activeLesson, setActiveLesson] = useState(null);

    const roadmap = [
        {
            title: "Level 1: Capital Fundamentals",
            description: "Establishing the core principles of wealth management.",
            icon: FiLayers,
            lessons: [
                {
                    id: 'l1',
                    title: "The Philosophy of Money",
                    description: "Learn the psychology behind modern financial systems and wealth creation.",
                    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80",
                    provider: "Core Mastery",
                    status: "In Class",
                    deadline: "Mar 2nd 2026, 11:56 am",
                    multiplier: "2x",
                    points: "0/40",
                    content: [
                        "Money, at its core, is a measure of trust and utility within a society. Understanding wealth creation requires a shift from viewing money as a finite resource to recognizing it as a scalable exchange of value.",
                        "Historically, human capital was traded directly. Today, financial systems allow us to abstract that value. The biggest psychological trap is equating hourly labor directly to lifelong wealth. True wealth generation occurs when capital operates independently of your time.",
                        "In this chapter, we outline the shift from a 'consumer mindset' (where income is immediately converted to depreciating liabilities) to an 'investor mindset' (where income buys assets that produce further income)."
                    ]
                },
                {
                    id: 'l2',
                    title: "Strategic Saving Protocols",
                    description: "Advanced techniques for optimizing your savings rate without compromising lifestyle.",
                    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
                    provider: "Budgeting 101",
                    status: "Available",
                    deadline: "Mar 5th 2026, 10:00 am",
                    multiplier: "1.5x",
                    points: "0/30",
                    content: [
                        "Parkinson’s Law states that expenses rise to meet income. The fundamental cure to this economic certainty is 'Pay Yourself First'.",
                        "Strategic saving isn't about skipping lattes; it's about structural automation. By immediately diverting 20% of all incoming revenue to inaccessible accumulation accounts, you force your lifestyle to adapt to the remaining 80%.",
                        "We will cover high-yield environments, liquidity ladders, and why your checking account should never hold more than two months of living expenses."
                    ]
                },
                {
                    id: 'l3',
                    title: "Emergency Capital Reserves",
                    description: "Building a bulletproof emergency fund for complete financial security.",
                    image: "https://images.unsplash.com/photo-1616077168079-7e0b5ceb8c8d?auto=format&fit=crop&w=600&q=80",
                    provider: "Risk Mgmt",
                    status: "Available",
                    deadline: "Mar 10th 2026, 06:00 pm",
                    multiplier: "3x",
                    points: "0/60",
                    content: [
                        "An emergency fund is not an investment; it is insurance. It protects your actual investments from being liquidated during a crisis at unfavorable market prices.",
                        "The golden rule is 3 to 6 months of baseline living expenses. If you are a freelancer or have highly variable income, this should scale to 9-12 months.",
                        "Your reserves should be held in highly liquid, virtually risk-free vehicles like Tier-1 savings accounts or short-term treasury bills. Accessibility is paramount over yield."
                    ]
                },
            ]
        },
        {
            title: "Level 2: Resource Optimization",
            description: "Advanced techniques for managing cash flow and growth.",
            icon: FiActivity,
            lessons: [
                {
                    id: 'l4',
                    title: "The 50/30/20 Framework",
                    description: "Master the gold standard of modern budgeting architectures.",
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
                    provider: "Budgeting 201",
                    status: "In Class",
                    deadline: "Mar 15th 2026, 11:00 am",
                    multiplier: "2x",
                    points: "0/45",
                    content: [
                        "Senator Elizabeth Warren popularized the 50/30/20 rule, a framework that simplifies budget allocation into absolute needs, flexible wants, and future planning.",
                        "50% Needs: Housing, groceries, utilities, and mandatory minimum debt payments. If this exceeds 50%, structural lifestyle changes might be required.",
                        "30% Wants: The psychological necessity of budgeting. Deprivation leads to financial bingeing. Allocate guilt-free spending here.",
                        "20% Savings/Investing: The engine of your net worth growth. Debt aggressively above 5%, otherwise direct this entirely into market investments."
                    ]
                },
                {
                    id: 'l5',
                    title: "Macroeconomic Inflation",
                    description: "Understanding how global economic shifts impact your purchasing power.",
                    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=600&q=80",
                    provider: "Economics",
                    status: "Available",
                    deadline: "Mar 20th 2026, 09:30 am",
                    multiplier: "2.5x",
                    points: "0/50",
                    content: [
                        "Inflation is the silent tax on stored capital. A 3% annual inflation rate means cash loses half its purchasing power every 24 years.",
                        "Governments intentionally target mild inflation to incentivize spending and investment over hoarding. Your financial architecture must structurally outpace this invisible decay.",
                        "Assets that historically hedge against inflation include equities, real estate, and occasionally direct commodities. Cash is a guaranteed loss in long-term horizons."
                    ]
                },
                {
                    id: 'l6',
                    title: "Capital Structure: Debt vs Equity",
                    description: "Strategic management of liabilities and equity for wealth expansion.",
                    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
                    provider: "Corporate Finance",
                    status: "Available",
                    deadline: "Mar 25th 2026, 02:00 pm",
                    multiplier: "3x",
                    points: "0/80",
                    content: [
                        "Not all debt is toxic. The wealthy utilize 'good debt' to leverage asset acquisition while passing the cost of capital onto renters or tax deductions.",
                        "Credit cards and high-interest loans are wealth destroyers, compounding against you. Mortgages and low-interest business loans are wealth accelerators, allowing you to control large assets with minimal upfront equity.",
                        "We discuss the concept of Arbitrage—borrowing at 4% to invest safely at 8%—and the inherent risks of overleveraging your balance sheet."
                    ]
                },
            ]
        },
        {
            title: "Level 3: Strategic Wealth Building",
            description: "High-performance investing and long-term security.",
            icon: FiTrendingUp,
            lessons: [
                {
                    id: 'l7',
                    title: "Systematic Investment Plans",
                    description: "Automating your wealth growth through disciplined market participation.",
                    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
                    provider: "Investing 301",
                    status: "Available",
                    deadline: "Apr 1st 2026, 11:59 pm",
                    multiplier: "4x",
                    points: "0/100",
                    content: [
                        "Timing the market is statistically impossible for retail investors over a 30-year horizon. Time IN the market is the ultimate variable.",
                        "Dollar-Cost Averaging (DCA) completely removes emotional psychology from investing. By automatically investing $500 on the 1st of every month, you buy fewer shares when the market is expensive, and more shares when the market crashes.",
                        "Automate your future wealth. Set up systems that withdraw capital from your checking account the day after you get paid, before you ever see it."
                    ]
                },
                {
                    id: 'l8',
                    title: "The Geometric Growth Engine",
                    description: "Unlocking the power of compounded returns for exponential gains.",
                    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80",
                    provider: "Wealth Strategy",
                    status: "In Class",
                    deadline: "Apr 5th 2026, 12:00 pm",
                    multiplier: "2x",
                    points: "0/50",
                    content: [
                        "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.",
                        "If you invest $10,000 at a 10% annual return, year one generates $1,000. But year two generates $1,100, year three $1,210. While linear growth is addition, compounding is geometric multiplication.",
                        "The most critical variable in the compound formula is 'n' (time). Starting at age 25 versus age 35 can mathematically double your retirement portfolio with the exact same principal invested."
                    ]
                },
                {
                    id: 'l9',
                    title: "Public Market Integration",
                    description: "Advanced strategies for navigating global stock exchanges.",
                    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
                    provider: "Stock Market",
                    status: "Available",
                    deadline: "Apr 10th 2026, 04:30 pm",
                    multiplier: "5x",
                    points: "0/150",
                    content: [
                        "The stock market is a mechanism for transferring wealth from the impatient to the patient. Broad-market index funds (like the S&P 500) historically return 8-10% annually over decades.",
                        "Stock picking and day trading often result in underperformance due to fees, taxes, and psychological panic. Diversification across massive baskets of companies reduces localized risk.",
                        "In this final stage, we review the mechanics of an ETF, how expense ratios erode returns, and the tax advantages of specialized retirement accounts like Roth IRAs and 401(k)s."
                    ]
                },
            ]
        }
    ];

    const totalLessons = roadmap.reduce((acc, level) => acc + level.lessons.length, 0);
    const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100) || 0;

    const toggleLessonCompletion = (lessonId) => {
        setCompletedLessons(prev =>
            prev.includes(lessonId)
                ? prev.filter(id => id !== lessonId)
                : [...prev, lessonId]
        );
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 dark:border-slate-800 pb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">Financial<span className="text-emerald-600">Mastery</span></h1>
                    <p className="text-slate-500 font-bold text-sm tracking-wide uppercase mt-1">Structured Curriculum • Advanced Performance</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none p-4 bg-white dark:bg-[#050505] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center md:text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Progress</p>
                        <p className="text-xl font-black text-emerald-600">{progressPercentage}%</p>
                    </div>
                    <div className="flex-1 md:flex-none p-4 bg-white dark:bg-[#050505] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center md:text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chapters Read</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">{completedLessons.length}/{totalLessons}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            {!activeLesson ? (
                <div className="space-y-10 relative">
                    {/* Vertical Connector Line */}
                    <div className="absolute left-6 top-10 bottom-10 w-px bg-slate-100 dark:bg-slate-800 hidden lg:block" />

                    {roadmap.map((level, idx) => (
                        <div key={idx} className="relative z-10">
                            <div className="flex items-start gap-6 mb-6">
                                <div className="pt-0">
                                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-0.5">{level.title}</h2>
                                    <p className="text-slate-500 font-bold text-xs max-w-xl">{level.description}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6 lg:ml-12">
                                {level.lessons.map((lesson) => (
                                    <div key={lesson.id} className="flex-1 min-w-[240px] max-w-[360px]">
                                        <CourseCard
                                            title={lesson.title}
                                            description={lesson.description}
                                            image={lesson.image}
                                            provider={lesson.provider}
                                            status={lesson.status}
                                            deadline={lesson.deadline}
                                            multiplier={lesson.multiplier}
                                            progress={lesson.points}
                                            isCompleted={completedLessons.includes(lesson.id)}
                                            onToggleCompletion={() => toggleLessonCompletion(lesson.id)}
                                            onAction={() => setActiveLesson(lesson)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <button
                        onClick={() => setActiveLesson(null)}
                        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
                    >
                        <span className="rotate-180"><FiArrowRight /></span> Back to Curriculum
                    </button>

                    <div className="bg-white dark:bg-[#050505] rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                        <div className="h-64 sm:h-80 w-full relative">
                            <img src={activeLesson.image} alt={activeLesson.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8 sm:p-12">
                                <span className="text-emerald-400 font-black tracking-widest text-[10px] uppercase bg-black/50 px-3 py-1.5 rounded-md backdrop-blur-md mb-4 inline-block">{activeLesson.provider}</span>
                                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter leading-tight mb-2">{activeLesson.title}</h2>
                                <p className="text-slate-300 font-medium sm:text-lg max-w-2xl">{activeLesson.description}</p>
                            </div>
                        </div>

                        <div className="p-8 sm:p-12">
                            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
                                {activeLesson.content?.map((paragraph, index) => (
                                    <p key={index} className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                        <FiCheckCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Done Reading?</p>
                                        <p className="text-sm font-bold text-slate-500">Mark this chapter to track your progress.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        toggleLessonCompletion(activeLesson.id);
                                        // Optional: go back to curriculum immediately or stay
                                    }}
                                    className={`px-8 py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] transition-all active:scale-95 ${completedLessons.includes(activeLesson.id) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-xl hover:bg-emerald-600 dark:hover:bg-emerald-500'}`}
                                >
                                    {completedLessons.includes(activeLesson.id) ? 'Completed - Unmark' : 'Mark as Completed'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Learn;
