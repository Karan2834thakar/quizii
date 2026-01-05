export const scoringService = {
    calculateScore: (timeTakenMs, isCorrect) => {
        if (!isCorrect) return 0;

        const timeTakenSeconds = timeTakenMs / 1000;
        const T = Math.min(timeTakenSeconds, 30);
        const base = 1000;
        const k = 10;
        const bonus = Math.max(0, (30 - T) * k);

        return Math.round(base + bonus);
    },

    getLeaderboard: (players) => {
        return players
            .map(p => ({
                id: p._id,
                name: p.name,
                score: p.score,
                correctCount: p.correctCount,
                answers: p.answers,
                avgTime: p.answers.length > 0
                    ? p.answers.reduce((acc, a) => acc + (a.timeTakenMs || 0), 0) / p.answers.length
                    : 0
            }))
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
                return a.avgTime - b.avgTime;
            });
    }
};
