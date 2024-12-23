import React, { useState } from "react";
import { Button, Card, Stack, TextField, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import HorizontalStack from "./util/HorizontalStack";
import UserAvatar from "./UserAvatar";
import { isLoggedIn } from "../helpers/authHelper";

const PostEditor = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    prompt: "",
  });
  const [videoUrl, setVideoUrl] = useState(""); // To store the video URL

  const user = isLoggedIn();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const errors = validate();
    setErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { prompt } = formData;

    try {
      const response = await fetch("/api/generate-video", { // Call the backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        // Handle server-side errors
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();


      if (data.videoUrl) {
        setVideoUrl(data.videoUrl); // Set the returned video URL
      } else {
        setServerError("An error occurred while generating the video.");
      }
    } catch (error) {
      setServerError(error.message);
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.prompt) {
      errors.prompt = "Prompt is required";
    }
    return errors;
  };

  return (
    <Card>
      <Stack spacing={2}>
        {user && (
          <HorizontalStack spacing={2}>
            <UserAvatar width={50} height={50} username={user.username} />
            <Typography variant="h5">
              What would you like to generate today, {user.username}?
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
          <ErrorAlert error={serverError} />
          <Button
            variant="outlined"
            type="submit"
            fullWidth
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