
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
