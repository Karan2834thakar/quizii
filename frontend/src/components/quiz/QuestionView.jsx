import React, { useState, useEffect, useRef } from 'react';
import { Timer, CheckCircle2, Circle, Users, Zap, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionView = ({ question, onAnswer, onTimeout, questionIndex, totalQuestions, isHost, distribution, isRevealing }) => {
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [timeLeft, setTimeLeft] = useState(question.timeLimitSeconds || 30);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const startTime = useRef(Date.now());

    useEffect(() => {
        setSelectedIdx(null);
        setIsSubmitted(false);
        setTimeLeft(question.timeLimitSeconds || 30);
        startTime.current = Date.now();
    }, [question]);

    useEffect(() => {
        console.log('[DEBUG] isRevealing changed:', isRevealing);
    }, [isRevealing]);

    useEffect(() => {
        if (timeLeft <= 0 && !isSubmitted) {
            handleAutoSubmit();
            return;
        }

        const timer = setInterval(() => {
            if (!isSubmitted) {
                setTimeLeft((prev) => Math.max(0, prev - 1));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isSubmitted]);

    const handleAutoSubmit = () => {
        if (!isHost) {
            const timeTakenMs = Date.now() - startTime.current;
            onAnswer(selectedIdx, timeTakenMs);
        }

        setIsSubmitted(true);
        if (onTimeout) onTimeout();
    };

    const handleOptionClick = (idx) => {
        if (isSubmitted || isHost) return;
        setSelectedIdx(idx);
        const timeTakenMs = Date.now() - startTime.current;
        onAnswer(idx, timeTakenMs);
        setIsSubmitted(true);
    };

    const progress = (timeLeft / (question.timeLimitSeconds || 30)) * 100;

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 relative z-10">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start justify-between mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1 w-full text-center md:text-left"
                >
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                        <span className="px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-400 font-bold rounded-full text-[10px] md:text-xs uppercase tracking-[0.2em]">
                            Quest Phase {questionIndex + 1} / {totalQuestions}
                        </span>
                        <div className="hidden sm:block flex-1 h-2 bg-slate-800 rounded-full overflow-hidden max-w-[200px]">
                            <motion.div
                                className="h-full bg-primary-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
                            />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-sm">
                        {question.text}
                    </h2>
                </motion.div>

                {/* Timer UI */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 shrink-0"
                >
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-800/50"
                        />
                        <motion.circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray="283"
                            strokeDashoffset={283 - (283 * progress) / 100}
                            className={`${timeLeft < 10 ? 'text-red-500' : 'text-primary-500'} transition-all duration-300 drop-shadow-[0_0_10px_currentColor]`}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className={`text-2xl md:text-4xl font-black tabular-nums ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                            {timeLeft}
                        </span>
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Sec</span>
                    </div>
                </motion.div>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {question.options.map((option, idx) => (
                    <motion.button
                        key={idx}
                        initial={{ opacity: 0, y: 10, delay: idx * 0.1 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={!(isSubmitted || isHost) ? { scale: 1.02, x: 5 } : {}}
                        whileTap={!(isSubmitted || isHost) ? { scale: 0.98 } : {}}
                        disabled={isSubmitted || isHost}
                        onClick={() => handleOptionClick(idx)}
                        className={`
              relative p-5 md:p-8 rounded-2xl md:rounded-3xl border-2 text-left transition-all duration-300 flex items-center justify-between group overflow-hidden
              ${selectedIdx === idx
                                ? ((isRevealing || isHost)
                                    ? (idx === question.correctOptionIndex
                                        ? 'bg-emerald-500/20 border-emerald-500 shadow-2xl shadow-emerald-500/20'
                                        : 'bg-red-500/20 border-red-500 shadow-2xl shadow-red-500/20')
                                    : 'bg-primary-500/20 border-primary-500 shadow-2xl shadow-primary-500/20')
                                : ((isRevealing || isHost) && idx === question.correctOptionIndex
                                    ? 'bg-emerald-500/20 border-emerald-500'
                                    : 'bg-slate-900/60 border-white/5 hover:border-white/20 hover:bg-slate-800/80')}
              ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}
              ${isHost ? 'opacity-100' : ''}
            `}
                    >
                        {/* Background progress indicator on click */}
                        {selectedIdx === idx && (
                            <motion.div
                                layoutId="selected-bg"
                                className="absolute inset-0 pointer-events-none bg-primary-500/10"
                            />
                        )}

                        <div className="flex items-center gap-4 md:gap-6 relative z-10">
                            <div className={`
                w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-black text-base md:text-lg transition-colors
                ${selectedIdx === idx
                                    ? ((isRevealing || isHost)
                                        ? (idx === question.correctOptionIndex ? 'bg-emerald-500' : 'bg-red-500')
                                        : 'bg-primary-500')
                                    : ((isRevealing || isHost) && idx === question.correctOptionIndex ? 'bg-emerald-500' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700')}
                text-white
              `}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="text-lg md:text-xl font-bold">{option}</span>
                        </div>

                        <div className="relative z-10">
                            {selectedIdx === idx ? (
                                (isRevealing || isHost) ? (
                                    idx === question.correctOptionIndex ? (
                                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                    ) : (
                                        <ShieldAlert className="w-8 h-8 text-red-400" />
                                    )
                                ) : (
                                    <Zap className="w-8 h-8 text-primary-400" />
                                )
                            ) : (isRevealing || isHost) && idx === question.correctOptionIndex ? (
                                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            ) : (
                                <div className="w-8 h-8 rounded-full border-2 border-slate-700 group-hover:border-slate-500 transition-colors" />
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>

            <AnimatePresence>
                {isSubmitted && !isHost && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-16 text-center"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                            <Zap className="w-5 h-5 fill-current" /> Answer Sealed. Stand by for results.
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Host Analytics */}
            {isHost && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-16 p-10 glass relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <BarChart2 className="w-32 h-32" />
                    </div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black flex items-center gap-3">
                            <Users className="w-6 h-6 text-primary-400" /> Live Synchronicity
                        </h3>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Real-time Stream</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {question.options.map((_, idx) => {
                            const count = distribution?.[idx] || 0;
                            const total = Object.values(distribution || {}).reduce((a, b) => a + b, 0) || 1;
                            const percentage = (count / total) * 100;

                            return (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-slate-500 uppercase">Opt {String.fromCharCode(65 + idx)}</span>
                                        <span className="text-lg font-black text-white">{count}</span>
                                    </div>
                                    <div className="h-4 bg-slate-950/50 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            className={`h-full bg-gradient-to-r ${idx % 2 === 0 ? 'from-primary-600 to-indigo-600' : 'from-emerald-600 to-teal-600'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ type: 'spring', damping: 15 }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-10 p-4 bg-primary-500/5 rounded-2xl border border-primary-500/10 flex items-center gap-4">
                        <ShieldAlert className="w-6 h-6 text-primary-400" />
                        <p className="text-sm text-slate-400 italic">
                            Waiting for the remaining warriors to lock their choices...
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// Help icon
const BarChart2 = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
);

export default QuestionView;
