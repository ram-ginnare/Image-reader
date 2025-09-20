import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';
import { createWorker } from 'tesseract.js';

const app = express();
const port = 3001;

app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post('/api/ai-ocr', upload.single('file'), async (req, res) => {
  const file = req.file;
  const prompt = req.body.prompt;

  if (!file || !prompt) {
    return res.status(400).json({ error: 'File and prompt are required.' });
  }

  try {
    // OCR: Extract text from image using Tesseract.js
    const worker = await createWorker('eng');
    const { data: { text: extractedText } } = await worker.recognize(file.path);
    await worker.terminate();

    console.log('Extracted text:', extractedText);

    if (!extractedText.trim()) {
      fs.unlink(file.path, () => {});
      return res.status(400).json({ error: 'No text could be extracted from the image.' });
    }

    // Compose prompt for Groq
    const groqPrompt = `Extracted text from image:\n${extractedText}\n\nUser question: ${prompt}\n\nAnswer:`;
    console.log('Groq prompt:', groqPrompt);

    // Call Groq API (text only)
    const groqApiKey = '    git add .    git add .';
    const groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    // Use the latest supported Groq model as per deprecation notice
    const model = 'meta-llama/llama-4-scout-17b-16e-instruct';

    const messages = [
      { role: 'user', content: groqPrompt }
    ];

    const groqResponse = await axios.post(
      groqApiUrl,
      {
        model,
        messages,
        max_tokens: 1024,
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    fs.unlink(file.path, () => {});
    const answer = groqResponse.data.choices?.[0]?.message?.content || 'No answer received.';
    console.log('Groq answer:', answer);
    res.json({ answer });
  } catch (err: any) {
    fs.unlink(file.path, () => {});
    console.error('Groq error:', err?.response?.data || err.message);
    res.status(500).json({ error: err?.response?.data?.error?.message || err.message || 'Failed to process image.' });
  }
});

app.listen(port, () => {
  console.log(`AI OCR backend (Tesseract+Groq) listening at http://localhost:${port}`);
});
// To run the server, use: npm run dev