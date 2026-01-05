import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import aiQuestionService from '../services/aiQuestionService.js';
import crypto from 'crypto';

export const createQuiz = async (req, res) => {
    try {
        const { title, topic, difficulty, numQuestions } = req.body;
        const roomCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        const quiz = new Quiz({
            title,
            topic,
            difficulty,
            numQuestions,
            roomCode
        });

        await quiz.save();
        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const generateQuestions = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        const questionsData = await aiQuestionService.generateQuestions({
            topic: quiz.topic,
            difficulty: quiz.difficulty,
            numQuestions: quiz.numQuestions
        });

        const savedQuestions = await Question.insertMany(
            questionsData.map(q => ({ ...q, quizId }))
        );

        quiz.questions = savedQuestions.map(q => q._id);
        await quiz.save();

        res.json(savedQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getQuizResults = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId).populate('players');
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        // Additional logic for per-question summary can be added here
        res.json({
            quiz,
            players: quiz.players
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
