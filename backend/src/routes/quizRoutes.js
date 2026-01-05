import express from 'express';
import { createQuiz, generateQuestions, getQuizResults } from '../controllers/quizController.js';
import validate from '../middlewares/joiValidator.js';
import Joi from 'joi';
import { body, param } from 'express-validator';
import { validationResult } from 'express-validator';

const router = express.Router();

const validateExpress = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const createQuizSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    topic: Joi.string().required(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
    numQuestions: Joi.number().integer().min(1).max(50).required()
});

router.post(
    '/',
    [
        body('title').notEmpty().withMessage('Title is required').isLength({ min: 3, max: 100 }),
        body('topic').notEmpty().withMessage('Topic is required'),
        body('difficulty').isIn(['easy', 'medium', 'hard']),
        body('numQuestions').isInt({ min: 1, max: 50 }),
        validateExpress
    ],
    validate(createQuizSchema),
    createQuiz
);

router.post(
    '/:quizId/generate-questions',
    [
        param('quizId').isMongoId().withMessage('Invalid Quiz ID'),
        validateExpress
    ],
    generateQuestions
);

router.get(
    '/:quizId/results',
    [
        param('quizId').isMongoId().withMessage('Invalid Quiz ID'),
        validateExpress
    ],
    getQuizResults
);

export default router;
