const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());


console.log('Query results33:', );  // `results` will be an array of rows


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
  

  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log("hello from js 333");
    setTimeout(() => {
        console.log("Hello world from js !"); // This will print after 3 seconds
      }, 30000);
  
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
  