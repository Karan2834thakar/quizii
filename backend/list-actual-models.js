import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;

    try {
        const res = await axios.get(url);
        console.log("ACCESSIBLE MODELS:");
        const generateModels = res.data.models
            .filter(m => m.supportedGenerationMethods.includes('generateContent'))
            .map(m => m.name.replace('models/', ''));
        console.log(JSON.stringify(generateModels, null, 2));
    } catch (e) {
        console.log("FAILED TO LIST MODELS:", e.response?.data || e.message);
    }
}

listModels();
