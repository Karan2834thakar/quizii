import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true },
    timeLimitSeconds: { type: Number, default: 30 },
    meta: {
        topic: String,
        difficulty: String
    }
}, { timestamps: true });

export default mongoose.model('Question', QuestionSchema);
