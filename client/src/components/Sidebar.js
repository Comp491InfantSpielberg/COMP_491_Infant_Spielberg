import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { getPosts } from "../api/posts";
import FindUsers from "./FindUsers";
import PostCard from "./PostCard";
import TopPosts from "./TopPosts";

const Sidebar = () => {
  return (
    <Stack spacing={2}>
      <TopPosts />
      <FindUsers />
z    </Stack>
  );
};

export default Sidebar;
