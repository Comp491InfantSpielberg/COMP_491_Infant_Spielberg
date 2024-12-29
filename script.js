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
  console.log("Hello, World! gernerate video");
  status.innerText = "Generating video............";
  console.log("Hello, World! generate video ");
  try {
    const response = await fetch('/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    console.log(data);

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
  console.log("Hello, login!");
  setTimeout(() => {
    console.log("Hello world!"); // This will print after 3 seconds
  }, 3000);
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
}

document.getElementById('login-form').addEventListener('submit', loginUser);


async function loginUser(event) {
  event.preventDefault();
  setTimeout(3000)
  console.log("Hello world!1");
/*
  setTimeout(() => {
    console.log("Hello world!2"); // This will print after 3 seconds
  }, 3000);
  */

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const status = document.getElementById('login-status');
  console.log("Hello world!3");

  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  console.log(response);

  const data = await response.json();
  console.log("Hello world!4");


  if (status) {
    status.innerText = "Logging in...";
  } else {
    console.log(password);
    console.error('Login status element not found');
  }
  //status.innerText = "Logging in...";
  alert('Please enter both email and password.');

  // Example login logic (replace with actual logic)
  if (email === "user@example.com" && password === "password123") {
    
    status.innerText = "Login successfasdfasul!";
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
