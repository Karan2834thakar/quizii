import express from 'express';
import cors from 'cors';
import quizRoutes from './src/routes/quizRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/quizzes', quizRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('AI Quiz API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
