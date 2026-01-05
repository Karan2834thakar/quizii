import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Pluggable AI Service for generating quiz questions.
 * Supports Gemini (Preferred), OpenAI, and Mock fallbacks.
 */
class AIQuestionService {
    async generateQuestions({ topic, difficulty, numQuestions }) {
        console.log(`[AI Service] Generating ${numQuestions} ${difficulty} questions for ${topic}`);
        console.log(`[AI Service] GEMINI_API_KEY present: ${!!process.env.GEMINI_API_KEY}`);

        if (process.env.GEMINI_API_KEY) {
            console.log(`[AI Service] Using Gemini...`);
            return this.generateWithGemini({ topic, difficulty, numQuestions });
        }

        if (process.env.OPENAI_API_KEY) {
            console.log(`[AI Service] Using OpenAI...`);
            return this.generateWithOpenAI({ topic, difficulty, numQuestions });
        }

        console.log(`[AI Service] Falling back to Mock...`);
        return this.generateMockQuestions({ topic, difficulty, numQuestions });
    }

    async generateWithGemini({ topic, difficulty, numQuestions }) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // List of models to try in order of preference (Updated for 2026 availability)
        const modelsToTry = [
            "gemini-2.0-flash",
            "gemini-2.0-flash-lite",
            "gemini-1.5-flash", // Fallback for stability
            "gemini-2.5-flash",
            "gemini-pro"
        ];

        let lastError = null;

        for (const modelId of modelsToTry) {
            try {
                console.log(`[AI Service] Attempting Gemini model: ${modelId}`);
                const model = genAI.getGenerativeModel({
                    model: modelId,
                    generationConfig: { responseMimeType: "application/json" }
                });

                const prompt = `Generate a quiz about "${topic}" with difficulty "${difficulty}". 
                Return exactly ${numQuestions} questions in a valid JSON array format.
                Each question must have:
                - "text": The question string.
                - "options": An array of exactly 4 strings.
                - "correctOptionIndex": The 0-based index of the correct option.
                - "timeLimitSeconds": 30.
                - "meta": {"topic": "${topic}", "difficulty": "${difficulty}", "ai": "gemini-${modelId}"}.
                
                Return ONLY the JSON array.`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                const parsed = JSON.parse(text);
                const questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);

                if (questions.length > 0) {
                    console.log(`[AI Service] Successfully generated with ${modelId}`);
                    return questions;
                }
            } catch (error) {
                console.error(`[AI Service] Model ${modelId} failed:`, error.message);

                // If it's a rate limit (429), wait 2 seconds and try again once
                if (error.message.includes('429') || error.message.includes('quota')) {
                    console.log(`[AI Service] Rate limit hit. Waiting 2s...`);
                    await new Promise(r => setTimeout(r, 2000));
                }

                lastError = error;
                continue;
            }
        }

        console.error('[AI Service] All Gemini models failed. Last error:', lastError?.message);
        // Fallback to OpenAI if available, else Mock
        if (process.env.OPENAI_API_KEY) {
            return this.generateWithOpenAI({ topic, difficulty, numQuestions });
        }
        return this.generateMockQuestions({ topic, difficulty, numQuestions });
    }

    async generateWithOpenAI({ topic, difficulty, numQuestions }) {
        try {
            const prompt = `Generate a quiz about "${topic}" with difficulty "${difficulty}". 
            Return exactly ${numQuestions} questions in a valid JSON array format.
            Each question must have:
            - "text": The question string.
            - "options": An array of 4 strings.
            - "correctOptionIndex": The 0-based index of the correct option.
            - "timeLimitSeconds": 30.
            - "meta": {"topic": "${topic}", "difficulty": "${difficulty}", "ai": "openai"}.
            
            Return ONLY the JSON array.`;

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' }
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const content = response.data.choices[0].message.content;
            const parsed = JSON.parse(content);
            return Array.isArray(parsed) ? parsed : (parsed.questions || []);
        } catch (error) {
            console.error('OpenAI Generation Error:', error.response?.data || error.message);
            return this.generateMockQuestions({ topic, difficulty, numQuestions });
        }
    }

    async generateMockQuestions({ topic, difficulty, numQuestions }) {
        const questions = [];
        for (let i = 1; i <= numQuestions; i++) {
            questions.push({
                text: `Sample ${difficulty} question #${i} about ${topic}?`,
                options: [
                    `Correct Option for ${topic}`,
                    `Wrong Option A`,
                    `Wrong Option B`,
                    `Wrong Option C`
                ],
                correctOptionIndex: 0,
                timeLimitSeconds: 30,
                meta: { topic, difficulty, ai: 'mock' }
            });
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        return questions;
    }
}

export default new AIQuestionService();
