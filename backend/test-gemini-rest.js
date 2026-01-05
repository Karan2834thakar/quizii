import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testRest() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

    console.log("Testing Gemini REST API...");
    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "Hi" }] }]
        });
        console.log("Success! Response:", response.data.candidates[0].content.parts[0].text);
    } catch (e) {
        console.error("REST API FAILED!");
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", JSON.stringify(e.response.data, null, 2));
        } else {
            console.error("Error:", e.message);
        }
    }
}

testRest();
