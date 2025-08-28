// const express = require('express');
// const dotenv = require('dotenv');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware to parse JSON request bodies
// app.use(express.json());

// // Initialize the Google Generative AI with your API key
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// // Define the action: summarizing text
// app.post('/summarize', async (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text) {
//       return res.status(400).json({ error: 'Text is required in the request body.' });
//     }

//     const prompt = `so when i provide a number , i need you to sugest just a whole number as the response , the number you suggest should be between 0.1% to 30% of the number recieved... depending on your mood:\n\n${text}`;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const summary = response.text();

//     res.json({ summary });

//   } catch (error) {
//     console.error('Error calling Gemini API:', error);
//     res.status(500).json({ error: 'Failed to generate summary.' });
//   }
// });

// app.get('/', async(req, res) => {
//     res.json({
//         response: "i am here"
//     })
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

app.post('/suggest-move', async (req, res) => {
  try {
    const { currentNumber, mode } = req.body;
    if (!currentNumber || !mode) {
      return res.status(400).json({ error: 'Missing currentNumber or mode' });
    }

    let prompt;
    if (mode === 'STRATEGIC') {
      prompt = `
      generate extremely unique randomness between 1% to 30% of this number = ${currentNumber}. i want a whole number as response and nothing else
      `;
    } else {
      prompt = `In a ZeroSum game (Quick Draw mode), suggest 1. YOUR RESPONSE SHOULD BE A WHOLE NUMBER.`;
    }

    console.log(mode)
    console.log(prompt);
    const result = await model.generateContent(prompt);
    const suggestion = result.response.text().trim();
    res.json({ suggestion });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
});

app.get('/', (req, res) => {
  res.json({ response: 'Server is running crazy' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// await main();