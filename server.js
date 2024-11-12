const express = require('express');
const path = require('path');
const { LumaAI } = require('lumaai');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

require('dotenv').config();

const app = express();
app.use(express.json());

// Serve static files from the current directory (which is text-to-video-app)
app.use(express.static(path.join(__dirname)));

// LumaAI setup
const client = new LumaAI({
  authToken: process.env.LUMAAI_API_KEY
});

// Serve the HTML file on the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Set a Content Security Policy header
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline';"
  );
  next();
});

// Endpoint to generate video based on user prompt
app.post('/generate-video', async (req, res) => {
  const { prompt } = req.body;

  try {
    let generation = await client.generations.create({ prompt });

    // Polling to check generation status
    const checkGeneration = async () => {
      generation = await client.generations.get(generation.id);

      if (generation.state === "completed") {
        const videoUrl = generation.assets.video;
        return res.json({ videoUrl });
      } else if (generation.state === "failed") {
        return res.status(500).json({ error: generation.failure_reason });
      } else {
        setTimeout(checkGeneration, 3000); // Poll every 3 seconds
      }
    };

    checkGeneration();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



/*
require('dotenv').config();
const express = require('express');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { LumaAI } = require('lumaai');

const app = express();
app.use(express.json());

const client = new LumaAI({
  authToken: process.env.LUMAAI_API_KEY
});

// Serve the HTML file on the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Set a Content Security Policy header (if needed)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline';"
  );
  next();
});

// Endpoint to generate video based on user prompt
app.post('/generate-video', async (req, res) => {
  const { prompt } = req.body;

  try {
    let generation = await client.generations.create({ prompt });

    // Polling to check generation status
    const checkGeneration = async () => {
      generation = await client.generations.get(generation.id);

      if (generation.state === "completed") {
        const videoUrl = generation.assets.video;
        return res.json({ videoUrl });
      } else if (generation.state === "failed") {
        return res.status(500).json({ error: generation.failure_reason });
      } else {
        setTimeout(checkGeneration, 3000); // Poll every 3 seconds
      }
    };

    checkGeneration();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/