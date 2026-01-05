import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function checkKey() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // We can't easily list models from the SDK without a special client
        // Let's just try to generate content with a different model or check if the key is valid
        console.log("Checking API key validity...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        const text = (await result.response).text();
        console.log("Key is valid! Response:", text);
    } catch (e) {
        console.error("FULL ERROR:", e);
    }
}

checkKey();
