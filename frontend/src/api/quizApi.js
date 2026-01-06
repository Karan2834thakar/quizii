import axios from 'axios';

const api = axios.create({
    baseURL: 'https://quizii.onrender.com/api'
});

export const quizApi = {
    createQuiz: (data) => api.post('/quizzes', data),
    generateQuestions: (quizId) => api.post(`/quizzes/${quizId}/generate-questions`),
    getResults: (quizId) => api.get(`/quizzes/${quizId}/results`)
};
