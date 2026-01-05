import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { quizApi } from '../api/quizApi';
import { Loader2, Sparkles, ChevronLeft, Target, BarChart, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

const schema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Quest title is required',
        'string.min': 'Title must be at least 3 characters'
    }),
    topic: Joi.string().required().messages({
        'string.empty': 'Topic is required'
    }),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
    numQuestions: Joi.number().integer().min(1).max(20).required()
});

const HostPage = () => {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: joiResolver(schema),
        defaultValues: {
            difficulty: 'medium',
            numQuestions: 5
        }
    });

    const numQuestions = watch('numQuestions');

    const onSubmit = async (data) => {
        setIsGenerating(true);
        setError(null);
        try {
            const { data: quiz } = await quizApi.createQuiz(data);
            await quizApi.generateQuestions(quiz._id);
            navigate(`/quiz/${quiz.roomCode}`, { state: { isHost: true, quizId: quiz._id } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate quiz. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 relative">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-10"
            >
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-6"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </button>
                <h1 className="text-4xl font-black flex items-center gap-3">
                    <Settings2 className="text-primary-500" /> Quiz Dashboard
                </h1>
                <p className="text-slate-400 mt-2">Configure your arena and let AI do the heavy lifting.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 md:p-12"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                                <Target className="w-4 h-4 text-primary-500" /> Quiz Identity
                            </label>
                            <input
                                {...register('title')}
                                className="input-field text-lg"
                                placeholder="e.g. The Ultimate Crypto Challenge"
                            />
                            {errors.title && <p className="text-red-400 text-xs mt-2 font-medium">{errors.title.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                                    <Sparkles className="w-4 h-4 text-yellow-500" /> Focus Topic
                                </label>
                                <input
                                    {...register('topic')}
                                    className="input-field"
                                    placeholder="e.g. Middle Earth, JS Closures"
                                />
                                {errors.topic && <p className="text-red-400 text-xs mt-2 font-medium">{errors.topic.message}</p>}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                                    <BarChart className="w-4 h-4 text-emerald-500" /> Difficulty Level
                                </label>
                                <div className="flex gap-2">
                                    {['easy', 'medium', 'hard'].map((level) => (
                                        <label key={level} className="flex-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                {...register('difficulty')}
                                                value={level}
                                                className="peer hidden"
                                            />
                                            <div className="p-3 text-center rounded-xl bg-slate-800 border border-slate-700 peer-checked:bg-primary-600 peer-checked:border-primary-400 peer-checked:text-white transition-all text-slate-400 font-bold capitalize">
                                                {level}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-300 uppercase tracking-wider">
                                    Quantity
                                </label>
                                <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-lg font-black">{numQuestions} Questions</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                {...register('numQuestions')}
                                className="w-full h-3 bg-slate-800 rounded-2xl appearance-none cursor-pointer accent-primary-500 mb-2"
                            />
                            <div className="flex justify-between text-xs text-slate-600 font-bold">
                                <span>1 MIN</span>
                                <span>20 MAX</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium flex gap-2 items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="btn-primary w-full py-5 text-xl group"
                    >
                        {isGenerating ? (
                            <><Loader2 className="animate-spin w-6 h-6" /> Architecting Quiz...</>
                        ) : (
                            <><Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Generate Quest Experience</>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default HostPage;
