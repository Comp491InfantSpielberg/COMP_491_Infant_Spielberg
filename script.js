const express = require('express');
const path = require('path');
const { LumaAI } = require('lumaai');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();
const app = express();
app.use(express.json());

// Serve static files from the current directory
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
      generation = await client.generations.get(generation.id);
      if (generation.state === "completed") {
        const videoUrl = generation.assets.video;
        return res.json({ videoUrl });
      } else if (generation.state === "failed") {
        return res.status(500).json({ error: generation.failure_reason });
      } else {
        setTimeout(checkGeneration, 3000);
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

// Frontend JavaScript
// Event listeners for buttons
document.getElementById('main-page-button').addEventListener('click', () => {
  showContent('main-page-content');
});
document.getElementById('login-button').addEventListener('click', () => {
  showContent('login-content');
});
document.getElementById('contact-button').addEventListener('click', () => {
  showContent('contact-content');
});
document.getElementById('create-post-button').addEventListener('click', () => {
  showContent('create-post-content');
});

document.getElementById('generate-button').addEventListener('click', generateVideo);

document.getElementById('main-content').addEventListener('click', (e) => {
  if (e.target.id === 'login-form-submit') {
    loginUser(e);
  } else if (e.target.id === 'contact-form-submit') {
    sendContactMessage(e);
  } else if (e.target.id === 'create-post-form-submit') {
    createPost(e);
  }
});

function showContent(contentId) {
  const sections = [
    'main-page-content',
    'login-content',
    'contact-content',
    'create-post-content'
  ];
  sections.forEach(section => {
    document.getElementById(section).style.display = 'none';
  });
  document.getElementById(contentId).style.display = 'block';
}

async function generateVideo() {
  const prompt = document.getElementById('prompt').value;
  const status = document.getElementById('status');

  status.innerText = "Generating video...";

  try {
    const response = await fetch('/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.error) {
      status.innerText = `Error: ${data.error}`;
      return;
    }

    if (data.videoUrl) {
      status.innerText = "Video ready!";
      const videoContainer = document.querySelector('.video-grid');
      const videoCard = document.createElement('div');
      videoCard.className = 'video-card';

      const video = document.createElement('video');
      video.src = data.videoUrl;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;

      const caption = document.createElement('p');
      caption.innerText = `Generated Video: ${prompt}`;

      videoCard.appendChild(video);
      videoCard.appendChild(caption);
      videoContainer.appendChild(videoCard);
    }
  } catch (error) {
    status.innerText = `Error: ${error.message}`;
  }
}

function showLoginPage() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>Login</h2>
    <form id="login-form">
      <input type="email" id="email" placeholder="Enter your email" required />
      <input type="password" id="password" placeholder="Enter your password" required />
      <button type="submit" id="login-form-submit">Login</button>
    </form>
    <div id="login-status"></div>
  `;
}

function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const status = document.getElementById('login-status');

  status.innerText = "Logging in...";

  if (email === "user@example.com" && password === "password123") {
    status.innerText = "Login successful!";
  } else {
    status.innerText = "Invalid credentials.";
  }
}

function showContactPage() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>Contact Us</h2>
    <form id="contact-form">
      <input type="text" id="contact-name" placeholder="Your Name" required />
      <input type="email" id="contact-email" placeholder="Your Email" required />
      <textarea id="contact-message" placeholder="Your Message" required></textarea>
      <button type="submit" id="contact-form-submit">Send Message</button>
    </form>
    <div id="contact-status"></div>
  `;
}

function sendContactMessage(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;
  const status = document.getElementById('contact-status');

  status.innerText = "Sending message...";

  if (name && email && message) {
    status.innerText = "Message sent! Thank you for contacting us.";
  } else {
    status.innerText = "Please fill in all fields.";
  }
}

function showCreatePostPage() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>Create a Post</h2>
    <form id="create-post-form">
      <input type="text" id="post-title" placeholder="Post Title" required />
      <textarea id="post-content" placeholder="Post Content" required></textarea>
      <button type="submit" id="create-post-form-submit">Create Post</button>
    </form>
    <div id="post-status"></div>
  `;
}

function createPost(event) {
  event.preventDefault();
  const title = document.getElementById('post-title').value;
  const content = document.getElementById('post-content').value;
  const status = document.getElementById('post-status');

  status.innerText = "Creating post...";

  if (title && content) {
    status.innerText = `Post created successfully! Title: ${title}, Content: ${content}`;
  } else {
    status.innerText = "Please fill in all fields.";
  }
}




/*
// Event listeners for buttons
document.getElementById('main-page-button').addEventListener('click', () => {
  showContent('main-page-content');
});
document.getElementById('login-button').addEventListener('click', () => {
  showContent('login-content');
});
document.getElementById('contact-button').addEventListener('click', () => {
  showContent('contact-content');
});

function showContent(contentId) {
  // Hide all sections
  document.getElementById('main-page-content').style.display = 'none';
  document.getElementById('login-content').style.display = 'none';
  document.getElementById('contact-content').style.display = 'none';

  // Show the clicked section
  document.getElementById(contentId).style.display = 'block';
}

// Video generation function remains unchanged
document.getElementById('generate-button').addEventListener('click', generateVideo);

async function generateVideo() {
  const prompt = document.getElementById('prompt').value;
  const status = document.getElementById('status');

  status.innerText = "Generating video...";

  try {
    const response = await fetch('/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.error) {
      status.innerText = `Error: ${data.error}`;
      return;
    }

    if (data.videoUrl) {
      status.innerText = "Video ready!";

      // Create a new video element dynamically
      const videoContainer = document.querySelector('.video-grid');
      const videoCard = document.createElement('div');
      videoCard.className = 'video-card';

      const video = document.createElement('video');
      video.src = data.videoUrl;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;

      const caption = document.createElement('p');
      caption.innerText = `Generated Video: ${prompt}`;

      videoCard.appendChild(video);
      videoCard.appendChild(caption);
      videoContainer.appendChild(videoCard);
    }
  } catch (error) {
    status.innerText = `Error: ${error.message}`;
  }
}




function showLoginPage() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>Login</h2>
    <form id="login-form">
      <input type="email" id="email" placeholder="Enter your email" required />
      <input type="password" id="password" placeholder="Enter your password" required />
      <button type="submit">Login</button>
    </form>
    <div id="login-status"></div>
  `;

  document.getElementById('login-form').addEventListener('submit', loginUser);
}

function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const status = document.getElementById('login-status');

  status.innerText = "Logging in...";

  // Example login logic (replace with actual logic)
  if (email === "user@example.com" && password === "password123") {
    status.innerText = "Login successful!";
    // You can redirect to another page or change the page content here
  } else {
    status.innerText = "Invalid credentials.";
  }
}

function showContactPage() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2>Contact Us</h2>
    <p>If you have any questions, feel free to contact us!</p>
    <form id="contact-form">
      <input type="text" id="contact-name" placeholder="Your Name" required />
      <input type="email" id="contact-email" placeholder="Your Email" required />
      <textarea id="contact-message" placeholder="Your Message" required></textarea>
      <button type="submit">Send Message</button>
    </form>
    <div id="contact-status"></div>
  `;

  document.getElementById('contact-form').addEventListener('submit', sendContactMessage);
}

function sendContactMessage(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;
  const status = document.getElementById('contact-status');

  status.innerText = "Sending message...";

  // Example contact form logic (replace with actual logic)
  if (name && email && message) {
    status.innerText = "Message sent! Thank you for contacting us.";
  } else {
    status.innerText = "Please fill in all fields.";
  }
}

*/