import React, { useState } from "react";
import { Button, Card, Stack, TextField, Typography, Box } from "@mui/material";
import HorizontalStack from "./util/HorizontalStack";
import { isLoggedIn } from "../helpers/authHelper";

const PostEditor = () => {
  const [formData, setFormData] = useState({
    prompt: "",
  });
  const [videoUrl, setVideoUrl] = useState("");

  const user = isLoggedIn();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { prompt } = formData;

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();


      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        setServerError("An error occurred while generating the video.");
      }
    } catch (error) {
      console.log("Error catched")
    }
  };

  return (
    <Card>
      <Stack spacing={2}>
        {user && (
          <HorizontalStack spacing={2}>
            <Typography variant="h5">
              What would you like to generate today
            </Typography>
          </HorizontalStack>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Describe your video"
            multiline
            rows={4}
            name="prompt"
            value={formData.prompt}
            margin="normal"
            onChange={handleChange}
            error={errors.prompt !== undefined}
            helperText={errors.prompt}
            required
          />
          <Button
            variant="outlined"
            type="submit"
            sx={{ mt: 2 }}
          >
          </Button>
        </Box>

        {videoUrl && (
          <div>
            <h2>Generated Video</h2>
            <video controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </Stack>
    </Card>
  );
};

export default PostEditor;
