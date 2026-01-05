import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    name: { type: String, required: true },
    socketId: { type: String, required: true },
    score: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    answers: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedOptionIndex: Number,
        isCorrect: Boolean,
        timeTakenMs: Number,
        score: Number
    }],
    isDisconnected: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Player', PlayerSchema);
