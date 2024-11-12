// script.js  NOT BEING USED FOR NOW
async function generateVideo() {
  const prompt = document.getElementById('prompt').value;
  document.getElementById('status').innerText = "Generating video...";
  document.getElementById('video').style.display = "none";

  try {
    const response = await fetch('/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (data.videoUrl) {
      document.getElementById('video').src = data.videoUrl;
      document.getElementById('video').style.display = "block";
      document.getElementById('status').innerText = "Video ready!";
    } else {
      document.getElementById('status').innerText = "Error: " + data.error;
    }
  } catch (error) {
    document.getElementById('status').innerText = "Error: " + error.message;
  }
}
