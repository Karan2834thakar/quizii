import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function discoverModels() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);

    // Most common model IDs
    const commonModels = [
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro",
        "gemini-pro"
    ];

    console.log("Starting model discovery...");

    for (const modelId of commonModels) {
        try {
            const model = genAI.getGenerativeModel({ model: modelId });
            const result = await model.generateContent("ping");
            const text = (await result.response).text();
            console.log(`✅ WORKING: ${modelId}`);
            process.exit(0); // Exit as soon as we find one
        } catch (e) {
            console.log(`❌ FAILED: ${modelId} - ${e.message}`);
        }
    }
    console.log("No common models worked.");
}

discoverModels();
