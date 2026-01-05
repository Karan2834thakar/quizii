import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Calendar, BarChart2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchQuizzes = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/quizzes', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setQuizzes(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [user, navigate]);

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8 md:gap-4 text-center md:text-left">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase italic tracking-tighter">Grand <span className="text-primary-500">Overseer</span></h1>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Total Quizzes Hosted: {quizzes.length}</p>
                </div>
                <button onClick={() => navigate('/')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-300 font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-all w-full md:w-auto justify-center">
                    <ArrowLeft className="w-4 h-4" /> Back to Arena
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quizzes.map((quiz) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={quiz._id}
                        className="glass p-8 border border-white/5 hover:border-primary-500/30 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <span className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 font-bold rounded-lg text-xs uppercase tracking-widest">
                                {quiz.roomCode}
                            </span>
                            <span className="text-slate-500 text-xs font-bold uppercase">{new Date(quiz.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-2xl font-black mb-4 group-hover:text-primary-400 transition-colors">{quiz.title}</h3>
                        <p className="text-slate-500 text-sm mb-8 italic">Topic: {quiz.topic}</p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                                <Users className="w-5 h-5 text-slate-400" />
                                <div>
                                    <div className="text-xl font-black">{quiz.players?.length || 0}</div>
                                    <div className="text-[10px] uppercase font-black text-slate-500">Warriors</div>
                                </div>
                            </div>
                            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                                <BarChart2 className="w-5 h-5 text-slate-400" />
                                <div>
                                    <div className="text-xl font-black">{quiz.questions?.length || 0}</div>
                                    <div className="text-[10px] uppercase font-black text-slate-500">Quests</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
