import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export const quizApi = {
    createQuiz: (data) => api.post('/quizzes', data),
    generateQuestions: (quizId) => api.post(`/quizzes/${quizId}/generate-questions`),
    getResults: (quizId) => api.get(`/quizzes/${quizId}/results`)
};
