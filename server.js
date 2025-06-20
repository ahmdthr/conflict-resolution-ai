import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { Buffer } from 'buffer';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSpeech(text, voice = 'nova', format = 'mp3') {
  try {
    const speechResponse = await openai.audio.speech.create({
      model: 'tts-1',
      input: text,
      voice: voice, // options: 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'
      response_format: format,
    });

    const filename = `speech-${Date.now()}.${format}`;
    const filepath = path.join(__dirname, 'public', 'tts', filename);

    const buffer = Buffer.from(await speechResponse.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    return `/tts/${filename}`;
  } catch (err) {
    console.error('TTS Error:', err);
    throw new Error('Text-to-speech generation failed.');
  }
}

app.post('/api/generate', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.post('/api/assistant', async (req, res) => {
  try {
    const assistant = await openai.beta.assistants.create({
      name: req.body.name,
      model: 'gpt-4o',
    });
    const assistant_id = assistant.id;
    res.json({ assistant_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.post('/api/thread', async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();
    const thread_id = thread.id;
    res.json({ thread_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.post('/api/assistantresponse', async (req, res) => {
  try {
    const assistantId = req.body.assistantId;
    const threadId = req.body.threadId;
    const instructions = req.body.instructions;
    const message = req.body.message;
    const msgRes = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });
    let run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
      instructions: instructions,
    });
    if (run.status === 'completed') {
      const retMessages = await openai.beta.threads.messages.list(
        run.thread_id,
      );
      console.log(retMessages);
      const response = retMessages.data[0].content[0].text.value;
      res.json({ response });
    } else {
      console.log(run.status);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
