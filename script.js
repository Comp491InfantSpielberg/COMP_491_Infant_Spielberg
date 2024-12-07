document.getElementById('generate-button').addEventListener('click', generateVideo);

async function generateVideo() {
  const prompt = document.getElementById('prompt').value;
  const status = document.getElementById('status');
  const videos = document.querySelectorAll('video');

  status.innerText = "Generating video...";
  
  try {
    const response = await fetch('/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.videoUrl) {
      // Find the first available video slot
      const availableVideo = Array.from(videos).find(video => !video.src);
      if (availableVideo) {
        availableVideo.src = data.videoUrl;
        availableVideo.style.display = "block";
      } else {
        alert("All video slots are full!");
      }

      status.innerText = "Video ready!";
    } else {
      status.innerText = "Error: " + data.error;
    }
  } catch (error) {
    status.innerText = "Error: " + error.message;
  }
}
