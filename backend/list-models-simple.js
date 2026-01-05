import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const response = await axios.get(url);
        const models = response.data.models.map(m => m.name);
        console.log("MODELS_LIST:" + JSON.stringify(models));
    } catch (e) {
        console.error("FAILED:" + e.message);
    }
}

listModels();
