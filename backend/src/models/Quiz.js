import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  numQuestions: { type: Number, required: true, min: 1, max: 50 },
  roomCode: { type: String, required: true, unique: true },
  hostSocketId: { type: String },
  status: { type: String, enum: ['lobby', 'active', 'ended'], default: 'lobby' },
  currentQuestionIndex: { type: Number, default: -1 },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Quiz', QuizSchema);
