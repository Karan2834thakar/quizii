import express from 'express';
import { getAllQuizzes } from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/quizzes', protect, admin, getAllQuizzes);

export default router;
