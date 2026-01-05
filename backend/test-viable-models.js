import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function testModel() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    const modelsToTry = ["gemini-flash-lite-latest", "gemini-1.5-pro-latest", "gemini-1.5-flash"];

    for (const modelId of modelsToTry) {
        console.log(`--- Testing ${modelId} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelId });
            const result = await model.generateContent("Say hello");
            console.log(`SUCCESS for ${modelId}:`, (await result.response).text());
        } catch (e) {
            console.error(`FAILED for ${modelId}:`, e.message);
        }
    }
}

testModel();
