import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { MdVideoLibrary } from "react-icons/md";

const CreatePost = () => {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Button
        variant="outlined"
        size="medium"
        onClick={() => navigate("/posts/create")}
        sx={{
          gap: "0.2rem",
          whiteSpace: "nowrap",
        }}
      >
        <AiOutlinePlus style={{ flexShrink: 0 }} />
        <span>New Post</span>
      </Button>

      <Button
        variant="outlined"
        size="medium"
        onClick={() => navigate("/videos/create")}
        sx={{
          gap: "0.2rem",
          whiteSpace: "nowrap",
        }}
      >
        <MdVideoLibrary style={{ flexShrink: 0 }} />
        <span>New Video</span>
      </Button>
    </div>
  );
};

export default CreatePost;