import { Container, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import GoBack from "../GoBack";
import GridLayout from "../GridLayout";
import Navbar from "../Navbar";
import PostCard from "../PostCard";
import { useParams } from "react-router-dom";
import { getPost } from "../../api/posts";
import { isLoggedIn } from "../../helpers/authHelper";

const PostView = () => {
  const params = useParams();

  const [post, setPost] = useState(null);
  const user = isLoggedIn();

  const fetchPost = async () => {
    const data = await getPost(params.id, user && user.token);
   
      setPost(data);
  };

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout
      left={
        post ? (
          <Stack spacing={2}>
            <PostCard post={post} key={post._id} />
          </Stack>
        ) : (
          <p>Loading post...</p>
        )
      }
    />

    </Container>
  );
};

export default PostView;
