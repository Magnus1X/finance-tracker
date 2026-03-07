import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiCheckCircle, FiPlay, FiStar, FiChevronRight, FiClock, FiLayers, FiArrowRight, FiActivity, FiTrendingUp } from 'react-icons/fi';
import CourseCard from '../components/CourseCard';

const Learn = () => {
    const [completedLessons, setCompletedLessons] = useState([]);

    const roadmap = [
        {
            title: "Level 1: Capital Fundamentals",
            description: "Establishing the core principles of wealth management.",
            icon: FiLayers,
            lessons: [
                { id: 'l1', title: "The Philosophy of Money", description: "Learn the psychology behind modern financial systems and wealth creation.", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80", provider: "Core Mastery", status: "In Class", deadline: "Mar 2nd 2026, 11:56 am", multiplier: "2x", points: "0/40", solved: "0 / 2 Solved" },
                { id: 'l2', title: "Strategic Saving Protocols", description: "Advanced techniques for optimizing your savings rate without compromising lifestyle.", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80", provider: "Budgeting 101", status: "Available", deadline: "Mar 5th 2026, 10:00 am", multiplier: "1.5x", points: "0/30", solved: "0 / 1 Solved" },
                { id: 'l3', title: "Emergency Capital Reserves", description: "Building a bulletproof emergency fund for complete financial security.", image: "https://images.unsplash.com/photo-1616077168079-7e0b5ceb8c8d?auto=format&fit=crop&w=600&q=80", provider: "Risk Mgmt", status: "Available", deadline: "Mar 10th 2026, 06:00 pm", multiplier: "3x", points: "0/60", solved: "0 / 3 Solved" },
            ]
        },
        {
            title: "Level 2: Resource Optimization",
            description: "Advanced techniques for managing cash flow and growth.",
            icon: FiActivity,
            lessons: [
                { id: 'l4', title: "The 50/30/20 Framework", description: "Master the gold standard of modern budgeting architectures.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", provider: "Budgeting 201", status: "In Class", deadline: "Mar 15th 2026, 11:00 am", multiplier: "2x", points: "0/45", solved: "0 / 2 Solved" },
                { id: 'l5', title: "Macroeconomic Inflation", description: "Understanding how global economic shifts impact your purchasing power.", image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=600&q=80", provider: "Economics", status: "Available", deadline: "Mar 20th 2026, 09:30 am", multiplier: "2.5x", points: "0/50", solved: "0 / 2 Solved" },
                { id: 'l6', title: "Capital Structure: Debt vs Equity", description: "Strategic management of liabilities and equity for wealth expansion.", image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80", provider: "Corporate Finance", status: "Available", deadline: "Mar 25th 2026, 02:00 pm", multiplier: "3x", points: "0/80", solved: "0 / 4 Solved" },
            ]
        },
        {
            title: "Level 3: Strategic Wealth Building",
            description: "High-performance investing and long-term security.",
            icon: FiTrendingUp,
            lessons: [
                { id: 'l7', title: "Systematic Investment Plans", description: "Automating your wealth growth through disciplined market participation.", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80", provider: "Investing 301", status: "Available", deadline: "Apr 1st 2026, 11:59 pm", multiplier: "4x", points: "0/100", solved: "0 / 5 Solved" },
                { id: 'l8', title: "The Geometric Growth Engine", description: "Unlocking the power of compounded returns for exponential gains.", image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80", provider: "Wealth Strategy", status: "In Class", deadline: "Apr 5th 2026, 12:00 pm", multiplier: "2x", points: "0/50", solved: "0 / 2 Solved" },
                { id: 'l9', title: "Public Market Integration", description: "Advanced strategies for navigating global stock exchanges.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80", provider: "Stock Market", status: "Available", deadline: "Apr 10th 2026, 04:30 pm", multiplier: "5x", points: "0/150", solved: "0 / 10 Solved" },
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

            {/* Roadmap Content */}
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
                                        onAction={() => console.log('Read Chapter', lesson.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Learn;
