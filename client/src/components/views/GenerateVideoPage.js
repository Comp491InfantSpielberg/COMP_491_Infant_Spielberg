import React, { useState } from 'react';
import axios from 'axios';

export default function CreateVideoPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);  // For displaying the generated video URL

  // Getting the Luma API key from environment variables (stored in .env)
  const lumaApiKey = process.env.LUMA_API;

  const handleGenerateVideo = async () => {
    if (!prompt) {
      alert('Please enter a prompt.');
      return;
    }
    setIsGenerating(true);
    try {
      // Make the API call to Luma to generate the video using the prompt
      const response = await axios.post('https://api.luma.ai/generate', 
        { prompt },
        { headers: { Authorization: `Bearer ${lumaApiKey}` } }
      );
      
      // Assuming Luma API returns the video URL in the response
      setVideoUrl(response.data.videoUrl); // Update as needed based on Luma API response
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Failed to generate video.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create Video</h1>
      <div>
        <label>
          Enter Prompt:
          <input
            type="text"
            placeholder="Enter your video prompt here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ padding: '10px', margin: '10px 0', width: '300px' }}
          />
        </label>
      </div>
      <button
        onClick={handleGenerateVideo}
        disabled={isGenerating || !prompt}
        style={{
          padding: '10px 20px',
          backgroundColor: isGenerating ? '#ccc' : '#0070f3',
          color: '#fff',
          border: 'none',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
        }}
      >
        {isGenerating ? 'Generating...' : 'Generate Video'}
      </button>

      {videoUrl && (
        <div style={{ marginTop: '20px' }}>
          <h2>Generated Video</h2>
          <video width="500" height="300" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
