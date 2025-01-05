import React, { useState } from "react";
import { Button, TextField, CircularProgress, Typography, Grid } from "@mui/material";
import { MdVideoLibrary } from "react-icons/md";
import { LumaAI } from "lumaai";
import GoBack from "../GoBack";


export default function CreateVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState("");

  const lumaApiKey = "luma-0d9548e2-0ffe-4486-b2b5-26b29c37650c-39db600b-b1d0-41c0-8c40-de8a4588caac";

  const videoPaths = [
    "/videos/video1.mp4",
    "/videos/video2.mp4",
    "/videos/video3.mp4",
    "/videos/video4.mp4",
    "/videos/video5.mp4",
    "/videos/video6.mp4",
    "/videos/video7.mp4",
    "/videos/video8.mp4",
    "/videos/video9.mp4",
  ];

  if (!lumaApiKey) {
    return <div>Error: API key is missing!</div>;
  }

  const client = new LumaAI({ authToken: lumaApiKey });

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      alert("Please enter a valid prompt.");
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);
    setError("");

    try {
      const generation = await client.generations.create({ prompt });
      const generationId = generation.id;
      if (!generationId) {
        throw new Error("No generation ID returned from API.");
      }
      await pollForVideo(generationId);
    } catch (err) {
      setError(err.message || "An error occurred while generating the video.");
      console.error("Error generating video:", err);
    } finally {
      setIsGenerating(false);
    }
  };

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
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    } catch (err) {
      setError(err.message || "Error while polling video generation.");
      console.error("Polling error:", err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
      <GoBack />
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
          <Typography variant="h6">Generated Video Link</Typography>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Click here to view the generated video
          </a>
        </div>
      )}

      <div style={{ marginTop: "40px" }}>
        <Typography variant="h5" gutterBottom>
          Featured Videos
        </Typography>
        <Grid container spacing={2}>
          {videoPaths.map((path, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <video
                style={{
                  height: "400px",
                  width: "100%",
                  borderRadius: "8px",
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                }}
                autoPlay
                loop
                muted
                controls
              >
                <source src={path} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}
