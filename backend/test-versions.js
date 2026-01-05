import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testVersions() {
    const key = process.env.GEMINI_API_KEY;
    const versions = ['v1', 'v1beta'];

    for (const v of versions) {
        const url = `https://generativelanguage.googleapis.com/${v}/models/gemini-1.5-flash:generateContent?key=${key}`;
        try {
            const res = await axios.post(url, { contents: [{ parts: [{ text: "hi" }] }] });
            console.log(`✅ VERSION ${v} WORKS!`);
        } catch (e) {
            console.log(`❌ VERSION ${v} FAILED: ${e.response?.status} - ${e.response?.data?.error?.message}`);
        }
    }
}

testVersions();
