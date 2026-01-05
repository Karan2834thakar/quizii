import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './src/config/db.js';
import { seedAdmin } from './src/config/seed.js';
import { handleQuizSocket } from './src/socket/quizSocket.js';

// Connect to Database and Seed Admin
connectDB().then(() => {
    seedAdmin();
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*', // For demo purposes, in production restrict this
        methods: ['GET', 'POST']
    }
});

handleQuizSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
