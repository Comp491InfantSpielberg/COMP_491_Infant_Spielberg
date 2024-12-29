
/*
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Assuming you have a separate db.js for your MySQL connection
require('dotenv').config();

const app = express();
app.use(bodyParser.json()); // To parse JSON in the body of the request

// Helper to generate JWT tokens
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Middleware to authenticate users
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.id;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Register Route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Username or email already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    }
  );
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    res.json({ message: 'Login successful', token });
  });
});

// Save Video Route
app.post('/videos', authenticate, (req, res) => {
  const { video_url, title, description } = req.body;

  if (!video_url || !title) {
    return res.status(400).json({ error: 'Video URL and title are required' });
  }

  db.query(
    'INSERT INTO videos (user_id, video_url, title, description) VALUES (?, ?, ?, ?)',
    [req.userId, video_url, title, description],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'Video saved successfully' });
    }
  );
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/

/*
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
    
    const checkGeneration = async () => {
      // Wait for generation status
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

    // Start polling
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

    const checkGeneration = async () => {
      // Wait for generation status
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

    // Start polling
    checkGeneration();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulated in-memory "database" for posts
const posts = [];

// Endpoint to get all posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Endpoint to get a single post by ID
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id, 10));
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

// Endpoint to create a post
app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const newPost = {
    id: posts.length + 1,
    title,
    content,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// Endpoint to update a post
app.put('/api/posts/:id', (req, res) => {
  const { title, content } = req.body;
  const post = posts.find((p) => p.id === parseInt(req.params.id, 10));
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  post.title = title;
  post.content = content;
  res.json(post);
});

// Endpoint to delete a post
app.delete('/api/posts/:id', (req, res) => {
  const postIndex = posts.findIndex((p) => p.id === parseInt(req.params.id, 10));
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  posts.splice(postIndex, 1);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
