import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testGemini2() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${key}`;

    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "Explain cricket in one sentence." }] }]
        });
        console.log("SUCCESS!");
        console.log("Response:", response.data.candidates[0].content.parts[0].text);
    } catch (e) {
        console.error("FAILED!");
        console.error("Status:", e.response?.status);
        console.error("Error:", JSON.stringify(e.response?.data, null, 2));
    }
}

testGemini2();
