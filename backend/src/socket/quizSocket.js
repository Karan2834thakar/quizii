import Quiz from '../models/Quiz.js';
import Player from '../models/Player.js';
import Question from '../models/Question.js';
import { scoringService } from '../services/scoringService.js';

export const handleQuizSocket = (io) => {
    const quizNamespace = io.of('/quiz');

    quizNamespace.on('connection', (socket) => {
        console.log('User connected to /quiz namespace:', socket.id);

        socket.on('host:create_room', async ({ quizId }) => {
            const quiz = await Quiz.findById(quizId);
            if (quiz) {
                quiz.hostSocketId = socket.id;
                await quiz.save();
                socket.join(quiz.roomCode);
                console.log(`Host joined room: ${quiz.roomCode}`);
            }
        });

        socket.on('guest:join_room', async ({ roomCode, name }) => {
            const quiz = await Quiz.findOne({ roomCode, status: 'lobby' });
            if (!quiz) {
                return socket.emit('error', { message: 'Room not found or quiz already started' });
            }

            const existingPlayer = await Player.findOne({ quizId: quiz._id, name });
            if (existingPlayer) {
                return socket.emit('error', { message: 'Name already taken in this room' });
            }

            const player = new Player({
                quizId: quiz._id,
                name,
                socketId: socket.id
            });

            await player.save();
            quiz.players.push(player._id);
            await quiz.save();

            socket.join(roomCode);

            const updatedQuiz = await Quiz.findById(quiz._id).populate('players');
            quizNamespace.to(roomCode).emit('room_state_updated', {
                players: updatedQuiz.players,
                status: updatedQuiz.status
            });
        });

        socket.on('host:start_quiz', async ({ roomCode }) => {
            const quiz = await Quiz.findOne({ roomCode }).populate('questions');
            if (quiz && quiz.status === 'lobby') {
                quiz.status = 'active';
                quiz.currentQuestionIndex = 0;
                await quiz.save();

                quizNamespace.to(roomCode).emit('quiz_started');

                const question = quiz.questions[0];
                quizNamespace.to(roomCode).emit('question_started', {
                    questionId: question._id,
                    text: question.text,
                    options: question.options,
                    timeLimitSeconds: question.timeLimitSeconds,
                    questionIndex: 0,
                    totalQuestions: quiz.questions.length
                });
            }
        });

        socket.on('guest:submit_answer', async ({ roomCode, questionId, selectedOptionIndex, timeTakenMs }) => {
            const player = await Player.findOne({ socketId: socket.id });
            const question = await Question.findById(questionId);
            const quiz = await Quiz.findOne({ roomCode });

            if (player && question && quiz) {
                const isCorrect = question.correctOptionIndex === selectedOptionIndex;
                const score = scoringService.calculateScore(timeTakenMs, isCorrect);

                player.score += score;
                if (isCorrect) player.correctCount += 1;
                player.answers.push({
                    questionId,
                    selectedOptionIndex,
                    isCorrect,
                    timeTakenMs,
                    score
                });

                await player.save();

                const players = await Player.find({ quizId: player.quizId });
                const leaderboard = scoringService.getLeaderboard(players);

                // Calculate answer distribution for the current question
                const distribution = [0, 0, 0, 0];
                players.forEach(p => {
                    const answer = p.answers.find(a => a.questionId.toString() === questionId);
                    if (answer && answer.selectedOptionIndex !== undefined) {
                        distribution[answer.selectedOptionIndex]++;
                    }
                });

                quizNamespace.to(roomCode).emit('answer_distribution_updated', {
                    questionId,
                    distribution
                });

                // Check if all players have answered
                const totalPlayers = quiz.players.length;
                let answeredCount = 0;

                // Refresh players list to get latest answers
                const currentPlayers = await Player.find({ quizId: quiz._id });
                currentPlayers.forEach(p => {
                    const hasAnsweredCurrent = p.answers.some(a => a.questionId.toString() === questionId);
                    if (hasAnsweredCurrent) answeredCount++;
                });

                if (answeredCount === totalPlayers) {
                    console.log('[DEBUG] All players answered. Emitting alert.');
                    quizNamespace.to(roomCode).emit('all_players_answered');
                }
            }
        });

        socket.on('host:reveal_answer', async ({ roomCode }) => {
            const quiz = await Quiz.findOne({ roomCode }).populate('questions');
            if (quiz && quiz.status === 'active') {
                const question = quiz.questions[quiz.currentQuestionIndex];
                quizNamespace.to(roomCode).emit('reveal_answer', {
                    correctOptionIndex: question.correctOptionIndex
                });
            }
        });

        socket.on('host:next_question', async ({ roomCode }) => {
            const quiz = await Quiz.findOne({ roomCode }).populate('questions');
            if (quiz && quiz.status === 'active') {
                quiz.currentQuestionIndex += 1;

                if (quiz.currentQuestionIndex >= quiz.questions.length) {
                    quiz.status = 'ended';
                    await quiz.save();

                    const players = await Player.find({ quizId: quiz._id });
                    const leaderboard = scoringService.getLeaderboard(players);
                    quizNamespace.to(roomCode).emit('quiz_ended', {
                        leaderboard,
                        questions: quiz.questions
                    });
                } else {
                    await quiz.save();
                    const question = quiz.questions[quiz.currentQuestionIndex];
                    quizNamespace.to(roomCode).emit('question_started', {
                        questionId: question._id,
                        text: question.text,
                        options: question.options,
                        timeLimitSeconds: question.timeLimitSeconds,
                        questionIndex: quiz.currentQuestionIndex,
                        totalQuestions: quiz.questions.length
                    });
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
