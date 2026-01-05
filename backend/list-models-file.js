import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const response = await axios.get(url);
        const models = response.data.models.map(m => m.name);
        fs.writeFileSync('models_list.txt', JSON.stringify(models, null, 2));
        console.log("File models_list.txt created with " + models.length + " models.");
    } catch (e) {
        console.error("FAILED:" + e.message);
    }
}

listModels();
