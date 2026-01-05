import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Play, PlusCircle, Sparkles, Trophy, Users, Zap,
    LogIn, LogOut, UserPlus, ShieldAlert, ArrowRight,
    Globe, BrainCircuit, Rocket, Layout, Globe2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const features = [
        {
            icon: <BrainCircuit className="w-8 h-8 text-primary-400" />,
            title: "AI Question Engine",
            desc: "Generate professional quizzes in seconds using advanced Gemini-2.0 models."
        },
        {
            icon: <Globe2 className="w-8 h-8 text-indigo-400" />,
            title: "Real-time Sync",
            desc: "No refreshes needed. Experience sub-millisecond synchronization across all devices."
        },
        {
            icon: <Layout className="w-8 h-8 text-emerald-400" />,
            title: "Premium UI",
            desc: "Stunning dark-mode interface designed for high-stakes competition."
        }
    ];

    const stats = [
        { label: "Quizzes Hosted", value: "50k+", icon: <Trophy className="w-5 h-5" /> },
        { label: "Active Players", value: "10k+", icon: <Users className="w-5 h-5" /> },
        { label: "AI Accuracy", value: "99.9%", icon: <Sparkles className="w-5 h-5" /> }
    ];

    return (
        <div className="flex-1 flex flex-col">
            {/* Navigation Header */}
            <nav className="w-full px-8 py-6 flex items-center justify-between relative z-50">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <Rocket className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">QUIZII<span className="text-primary-500">.AI</span></span>
                </motion.div>

                <div className="flex gap-4">
                    {user ? (
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-white font-black text-xs uppercase tracking-widest">{user.name}</span>
                                <span className="text-primary-400 text-[10px] font-bold uppercase">{user.role}</span>
                            </div>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="p-2.5 bg-primary-500/10 border border-primary-500/20 rounded-xl text-primary-400 hover:text-primary-300 transition-all">
                                    <ShieldAlert className="w-5 h-5" />
                                </Link>
                            )}
                            <button onClick={logout} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 font-bold text-sm hover:bg-white/10 hover:text-white transition-all">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Link to="/login" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-all">
                                <LogIn className="w-4 h-4" /> Login
                            </Link>
                            <Link to="/register" className="px-6 py-2.5 bg-primary-600 rounded-xl text-white font-bold text-sm flex items-center gap-2 hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/20">
                                <UserPlus className="w-4 h-4" /> Join Now
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center relative px-6 text-center overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[120px] -z-10" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-400 text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-xl">
                        <Sparkles className="w-4 h-4" /> Next-Gen AI Quizzing
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight text-white uppercase italic">
                        Experience the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-400 to-emerald-400">
                            Future of Battle
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
                        Create high-stakes real-time arenas in seconds with our advanced
                        AI generation engine. Invite thousands, compete globally.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
                        <motion.button
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/host')}
                            className="group bg-gradient-to-br from-primary-600 to-primary-800 p-8 rounded-[2rem] text-left relative overflow-hidden shadow-2xl shadow-primary-500/20"
                        >
                            <PlusCircle className="absolute -top-4 -right-4 w-32 h-32 text-white/10 group-hover:rotate-12 transition-transform" />
                            <h3 className="text-2xl font-black text-white mb-2 uppercase">Create Arena</h3>
                            <p className="text-primary-100 text-sm leading-relaxed max-w-[200px]">Design a custom quiz and invite your audience.</p>
                            <div className="mt-8 flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                                Host Now <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/join')}
                            className="group bg-slate-900 border-2 border-white/5 p-8 rounded-[2rem] text-left relative overflow-hidden transition-all hover:border-emerald-500/30"
                        >
                            <Play className="absolute -top-4 -right-4 w-32 h-32 text-emerald-500/10 group-hover:scale-110 transition-transform fill-current" />
                            <h3 className="text-2xl font-black text-white mb-2 uppercase">Enter Combat</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">Join an active arena with a unique room code.</p>
                            <div className="mt-8 flex items-center gap-2 text-emerald-400 font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                                Join Now <ArrowRight className="w-4 h-4 text-emerald-500" />
                            </div>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Info Section */}
                <div className="w-full max-w-7xl mx-auto mt-40 grid grid-cols-1 md:grid-cols-3 gap-12 pb-40">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-left p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
                        >
                            <div className="p-4 rounded-2xl bg-white/5 w-fit mb-6 group-hover:scale-110 transition-transform">
                                {f.icon}
                            </div>
                            <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{f.title}</h4>
                            <p className="text-slate-500 leading-relaxed text-sm font-medium">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Global Stats Footer */}
            <footer className="w-full bg-slate-950/50 border-t border-white/5 py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex gap-16 order-2 md:order-1">
                        {stats.map((s, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-slate-500">
                                    {s.icon} <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                                </div>
                                <div className="text-2xl font-black text-white">{s.value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] order-1 md:order-2">
                        &copy; 2026 Quizii Arena . Built with Deepmind AI
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
