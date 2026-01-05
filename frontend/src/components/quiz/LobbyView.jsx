import React, { useState } from 'react';
import { Users, Play, Copy, Check, Share2, UserPlus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LobbyView = ({ players, isHost, onStart, roomCode }) => {
    const [copied, setCopied] = useState(false);

    const copyCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Room Info & Players */}
                <div className="lg:col-span-8 space-y-6 md:space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-6 md:p-10 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-primary-500" />
                        <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] md:text-xs font-black mb-4">Lobby Access Code</p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white tabular-nums drop-shadow-2xl">
                                {roomCode}
                            </h1>
                            <button
                                onClick={copyCode}
                                className="p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all border border-white/10 group"
                            >
                                {copied ? <Check className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" /> : <Copy className="w-6 h-6 md:w-8 md:h-8 text-slate-400 group-hover:text-white" />}
                            </button>
                        </div>
                        <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                            <button onClick={copyCode} className="btn-outline py-2 px-4 text-sm w-full md:w-auto">
                                <Share2 className="w-4 h-4" /> Share Link
                            </button>
                            <div className="hidden md:block h-4 w-px bg-slate-800" />
                            <p className="text-slate-500 text-xs md:text-sm font-medium italic">Waiting for your squad to assemble...</p>
                        </div>
                    </motion.div>

                    <div className="glass p-8 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-black flex items-center gap-3">
                                <UserPlus className="text-primary-400" /> Joined Warriors
                            </h2>
                            <div className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-xl border border-primary-500/20">
                                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                                <span className="text-primary-400 font-black text-sm uppercase tracking-wider">{players.length} Online</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                                {players.map((player, idx) => (
                                    <motion.div
                                        key={player._id || idx}
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="glass-card p-4 flex items-center gap-4 group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-lg group-hover:rotate-6 transition-transform">
                                            {player.name?.[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-white truncate">{player.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">Ready to Quest</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {players.length === 0 && (
                                <div className="col-span-full py-20 text-center space-y-4">
                                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto border border-slate-700/50">
                                        <Users className="w-10 h-10 text-slate-600" />
                                    </div>
                                    <p className="text-slate-500 font-bold text-lg animate-pulse">Lobby is quiet... invite some friends!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    {isHost ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass p-8 border-primary-500/30 md:sticky md:top-12"
                        >
                            <div className="w-12 h-12 bg-primary-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Settings2 className="w-6 h-6 text-primary-400" />
                            </div>
                            <h3 className="font-black text-2xl mb-4 text-center md:text-left">Host Arena</h3>
                            <p className="text-slate-400 font-medium mb-8 leading-relaxed text-center md:text-left">
                                As the architect, you decide when the battle begins. Ensure everyone is synchronized.
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={onStart}
                                    disabled={players.length === 0}
                                    className="btn-primary w-full py-5 text-lg"
                                >
                                    <Play className="w-6 h-6 fill-current" /> INVOKE QUEST
                                </button>
                                <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1 text-center md:text-left">Status</p>
                                    <p className="text-sm font-medium text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Systems Operational
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="glass p-8 text-center space-y-6 md:sticky md:top-12">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 animate-spin-slow">
                                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                            </div>
                            <h3 className="font-bold text-xl">Waiting for Host</h3>
                            <p className="text-slate-400 text-sm">
                                The host is currently configuring the virtual arena. Hold tight, the quest will begin shortly.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Simple icon missing in my helper
const Settings2 = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>
);

export default LobbyView;
