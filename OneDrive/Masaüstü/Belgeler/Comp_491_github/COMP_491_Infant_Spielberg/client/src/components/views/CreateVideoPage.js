import axios from "axios";
import React, { useState } from "react";
import { Button, TextField, CircularProgress, Typography } from "@mui/material";
import { MdVideoLibrary } from "react-icons/md";
import { LumaAI } from "lumaai";

export default function CreateVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState("");

  // Manually set the Luma API key here
  const lumaApiKey = "luma-0d9548e2-0ffe-4486-b2b5-26b29c37650c-39db600b-b1d0-41c0-8c40-de8a4588caac"; 

  // Check if the API key is available
  if (!lumaApiKey) {
    return <div>Error: API key is missing!</div>;
  }

  const client = new LumaAI({
    authToken: lumaApiKey,
  });

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      alert("Please enter a valid prompt.");
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);
    setError("");

    try {
      // Request to create the video generation task
      const generation = await client.generations.create({
        prompt,
      });

      // Check if the generation ID was returned
      const generationId = generation.id;
      if (!generationId) {
        throw new Error("No generation ID returned from API.");
      }

      // Poll for video generation completion
      await pollForVideo(generationId);
    } catch (err) {
      setError(
        err.message || "An error occurred while generating the video."
      );
      console.error("Error generating video:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to poll the generation status and retrieve the video once it's ready
  const pollForVideo = async (generationId) => {
    try {
      let completed = false;

      while (!completed) {
        const statusResponse = await client.generations.get(generationId);

        const status = statusResponse.state;
        if (status === "completed") {
          completed = true;
          setVideoUrl(statusResponse.assets.video);
        } else if (status === "failed") {
          throw new Error("Video generation failed.");
        } else {
          console.log("Video generation in progress...");
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Poll every 3 seconds
        }
      }
    } catch (err) {
      setError(
        err.message || "Error while polling video generation."
      );
      console.error("Polling error:", err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Create Video
      </Typography>
      <TextField
        label="Enter Prompt"
        fullWidth
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        variant="outlined"
        style={{ marginBottom: "20px" }}
      />
      <Button
        onClick={handleGenerateVideo}
        disabled={isGenerating}
        variant="contained"
        startIcon={isGenerating ? <CircularProgress size={20} /> : <MdVideoLibrary />}
      >
        {isGenerating ? "Generating..." : "Generate Video"}
      </Button>

      {error && (
        <Typography color="error" style={{ marginTop: "20px" }}>
          {error}
        </Typography>
      )}

      {videoUrl && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="h6">Generated Video</Typography>
          <video width="100%" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
