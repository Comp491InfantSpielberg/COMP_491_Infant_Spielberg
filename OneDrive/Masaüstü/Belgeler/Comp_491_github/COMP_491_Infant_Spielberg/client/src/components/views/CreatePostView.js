import { Container, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import GoBack from "../GoBack";
import Navbar from "../Navbar";
import GridLayout from "../GridLayout";
import Sidebar from "../Sidebar";
import { createPost } from "../../api/posts";

const CreatePostView = () => {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!video) {
      alert("Please select a video to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", video);
  
    try {
      const response = await createPost(formData);
      console.log("Post created successfully:", response);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  
  

  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout
        left={
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              required
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Submit
            </Button>
          </form>
        }
        right={<Sidebar />}
      />
    </Container>
  );
};

export default CreatePostView;
