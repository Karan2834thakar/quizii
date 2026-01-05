import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function testFinal() {
    console.log("Testing with key:", process.env.GEMINI_API_KEY.substring(0, 10) + "...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite"];

    for (const m of models) {
        try {
            console.log(`Trying ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Give me 1 trivia question about Cricket in JSON format: {question, answer}");
            console.log(`✅ SUCCESS WITH ${m}:`, (await result.response).text());
            return;
        } catch (e) {
            console.log(`❌ FAILED ${m}:`, e.message);
        }
    }
}

testFinal();
