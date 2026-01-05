import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { User, Hash, ChevronLeft, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const schema = Joi.object({
    roomCode: Joi.string().length(6).required().messages({
        'string.length': 'Room code must be 6 characters',
        'string.empty': 'Room code is required'
    }),
    name: Joi.string().min(2).max(20).required().messages({
        'string.empty': 'Please enter your name',
        'string.min': 'Name must be at least 2 characters'
    })
});

const JoinPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [error, setError] = useState(null);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: joiResolver(schema),
        defaultValues: {
            name: user?.name || ''
        }
    });

    React.useEffect(() => {
        if (user?.name) {
            setValue('name', user.name);
        }
    }, [user, setValue]);

    const onSubmit = (data) => {
        navigate(`/quiz/${data.roomCode.toUpperCase()}`, { state: { name: data.name, isHost: false } });
    };

    return (
        <div className="max-w-md mx-auto py-12 md:py-24 px-4 relative">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 md:mb-10 group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Home
                </button>

                <div className="glass p-6 md:p-10 relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-500 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl shadow-indigo-500/20">
                        <Zap className="w-6 h-6 md:w-8 md:h-8 text-white fill-current" />
                    </div>

                    <div className="text-center mt-4 md:mt-6 mb-8 md:mb-10">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight">Enter Arena</h2>
                        <p className="text-slate-400 mt-2 text-sm md:text-base">Join an active quest using a room code.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-[0.2em] ml-1">Room Access Code</label>
                            <div className="relative group">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    {...register('roomCode')}
                                    className="w-full bg-slate-800/80 border-2 border-slate-700/50 rounded-2xl p-4 pl-12 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all uppercase tracking-widest text-xl font-black placeholder:normal-case placeholder:text-slate-600 placeholder:text-sm placeholder:font-medium placeholder:tracking-normal"
                                    placeholder="e.g. X1Y2Z3"
                                />
                            </div>
                            {errors.roomCode && <p className="text-red-400 text-xs mt-2 ml-1 font-bold">{errors.roomCode.message}</p>}
                        </div>

                        <div className={user ? 'opacity-60 cursor-not-allowed' : ''}>
                            <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-[0.2em] ml-1">Warrior Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    {...register('name')}
                                    className={`w-full bg-slate-800/80 border-2 border-slate-700/50 rounded-2xl p-4 pl-12 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-lg font-bold ${user ? 'pointer-events-none' : ''}`}
                                    placeholder="Type your nickname..."
                                    readOnly={!!user}
                                />
                            </div>
                            {errors.name && <p className="text-red-400 text-xs mt-2 ml-1 font-bold">{errors.name.message}</p>}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 text-sm font-bold text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full px-6 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-2xl font-black text-xl text-white shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 overflow-hidden group"
                        >
                            <span>ENTER ARENA</span>
                            <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default JoinPage;
