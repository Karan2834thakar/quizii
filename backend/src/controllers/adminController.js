import Quiz from '../models/Quiz.js';

export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({})
            .populate('questions')
            .populate('players')
            .sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
