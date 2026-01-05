import React from 'react';
import { Trophy, Award, Medal, Check, X, ChevronRight, BarChart3, Star, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultView = ({ leaderboard, questions, name, isHost }) => {
    const top3 = leaderboard.slice(0, 3);
    const others = leaderboard.slice(3);
    const myResult = leaderboard.find(p => p.name === name);

    console.log('[DEBUG] My Result:', myResult);
    console.log('[DEBUG] Questions:', questions);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-6xl mx-auto py-12 md:py-20 px-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-16 md:mb-24"
            >
                <div className="inline-flex py-2 px-6 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-black text-xs md:text-sm uppercase tracking-widest mb-6 animate-bounce">
                    Arena Concluded
                </div>
                <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight text-white uppercase italic">
                    The Verdict
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto px-4">
                    Legends were made, scores were settled. Here are the finalists.
                </p>
            </motion.div>

            {/* Winners Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-24 px-4 max-w-4xl mx-auto relative">
                {/* Glow behind podium */}
                <div className="absolute inset-0 bg-primary-500/10 blur-[120px] -z-10 rounded-full" />

                {/* Rank 2 */}
                <AnimateRank rank={others.length > 0 ? 2 : top3.length >= 2 ? 2 : 0} player={top3[1]} height="h-32" />

                {/* Rank 1 */}
                <AnimateRank rank={1} player={top3[0]} height="h-44" isWinner />

                {/* Rank 3 */}
                <AnimateRank rank={others.length > 0 ? 3 : top3.length >= 3 ? 3 : 0} player={top3[2]} height="h-24" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Leaderboard */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="lg:col-span-12 space-y-8"
                >
                    <div className="glass overflow-hidden relative">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl">
                                    <BarChart3 className="w-6 h-6 text-primary-400" />
                                </div>
                                <h2 className="text-2xl font-black">All Combatants</h2>
                            </div>
                            <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">{leaderboard.length} Finalists</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-950/30 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-4 md:px-8 py-6 text-left">Standing</th>
                                        <th className="px-4 md:px-8 py-6 text-left">Identity</th>
                                        <th className="px-4 md:px-8 py-6 text-center">Hits</th>
                                        <th className="hidden md:table-cell px-8 py-6 text-center">Velocity</th>
                                        <th className="px-4 md:px-8 py-6 text-right">Power</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {leaderboard.map((player, idx) => (
                                        <motion.tr
                                            variants={item}
                                            key={idx}
                                            className={`group transition-colors ${player.name === name ? 'bg-primary-500/5' : 'hover:bg-white/[0.02]'}`}
                                        >
                                            <td className="px-8 py-6">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                                                    idx === 1 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30' :
                                                        idx === 2 ? 'bg-amber-800/20 text-amber-600 border border-amber-800/30' :
                                                            'bg-slate-800/50 text-slate-500'
                                                    }`}>
                                                    {idx + 1}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                                        {player.name?.[0].toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-lg">{player.name} {player.name === name && <span className="text-primary-400 ml-2">(YOU)</span>}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-6 text-center font-bold text-slate-400">
                                                {player.correctCount} / {questions.length}
                                            </td>
                                            <td className="hidden md:table-cell px-8 py-6 text-center text-slate-500 font-medium lowercase">
                                                {(player.avgTime / 1000).toFixed(2)}s <span className="text-[10px] uppercase">avg</span>
                                            </td>
                                            <td className="px-4 md:px-8 py-6 text-right">
                                                <span className="text-xl md:text-2xl font-black text-white">{player.score}</span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Detailed Review */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        <h2 className="col-span-full text-3xl font-black flex items-center gap-4 mb-4">
                            <Check className="w-8 h-8 text-emerald-400" /> Archives: Question Metrics
                        </h2>
                        {questions.map((q, idx) => {
                            const qId = q._id || q.id;
                            let playerAnswer = myResult?.answers?.find(a =>
                                (a.questionId?.toString() === qId?.toString())
                            );

                            // Fallback to match by index if ID matching fails
                            if (!playerAnswer && myResult?.answers && myResult.answers[idx]) {
                                playerAnswer = myResult.answers[idx];
                            }

                            return (
                                <motion.div
                                    variants={item}
                                    key={idx}
                                    className="glass p-8 space-y-6 group hover:border-white/10 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-600 font-black text-4xl italic group-hover:text-primary-500 transition-colors">0{idx + 1}</span>
                                            {playerAnswer && (
                                                <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${playerAnswer.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {playerAnswer.isCorrect ? 'Precision Hit' : 'Target Missed'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black uppercase text-slate-500">
                                            Difficulty: {q.meta?.difficulty || 'Medium'}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-xl leading-tight">{q.text}</h3>
                                    <div className="space-y-3">
                                        {q.options.map((opt, oIdx) => {
                                            const isCorrect = oIdx === q.correctOptionIndex;
                                            const isSelected = playerAnswer?.selectedOptionIndex === oIdx;

                                            let bgClass = 'bg-white/[0.02] border-white/5 text-slate-500';
                                            if (isCorrect) bgClass = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/5';
                                            if (isSelected && !isCorrect) bgClass = 'bg-red-500/10 border-red-500/40 text-red-400';

                                            return (
                                                <div
                                                    key={oIdx}
                                                    className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all ${bgClass}`}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        {opt}
                                                        {isSelected && (
                                                            <span className={`text-[8px] px-1.5 py-0.5 rounded border font-black ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                                                                YOUR PICK
                                                            </span>
                                                        )}
                                                    </span>
                                                    {isCorrect ? <Check className="w-5 h-5" /> : (isSelected && <X className="w-5 h-5" />)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            <div className="mt-24 text-center">
                <button
                    onClick={() => window.location.href = '/'}
                    className="btn-outline px-12 text-lg hover:bg-white/5 group"
                >
                    Return to Hub <Ghost className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

const AnimateRank = ({ rank, player, height, isWinner }) => {
    if (!player) return <div className="hidden md:block flex-1" />;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: rank * 0.2, type: 'spring' }}
            className={`flex flex-col items-center ${isWinner ? 'scale-110 z-20' : 'z-10'}`}
        >
            <div className={`p-6 rounded-3xl border-2 w-full text-center mb-4 relative pt-12 ${isWinner ? 'glass border-yellow-500 bg-yellow-500/10' : 'glass border-white/5'
                }`}>
                <div className={`w-14 h-14 absolute -top-7 left-1/2 -translate-x-1/2 rounded-2xl flex items-center justify-center shadow-xl ${rank === 1 ? 'bg-yellow-500 text-white shadow-yellow-500/20' :
                    rank === 2 ? 'bg-slate-300 text-slate-900 shadow-slate-300/20' :
                        'bg-amber-800 text-white shadow-amber-800/20'
                    }`}>
                    {rank === 1 ? <Trophy className="w-8 h-8" /> : rank === 2 ? <Award className="w-8 h-8" /> : <Medal className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-black truncate text-white">{player.name}</h3>
                <p className={`font-black text-3xl mt-2 ${isWinner ? 'text-yellow-500' : 'text-primary-400'}`}>{player.score}</p>
                <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-500">{player.correctCount} Correct Strikes</div>
            </div>
            <div className={`${height} ${isWinner ? 'bg-yellow-500/20 border-x-2 border-t-2 border-yellow-500/30' : 'bg-white/5 border-x-2 border-t-2 border-white/5'} w-full rounded-t-2xl flex items-center justify-center font-black text-4xl text-white/10 italic shadow-2xl`}>
                {rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd'}
            </div>
        </motion.div>
    );
};

export default ResultView;
