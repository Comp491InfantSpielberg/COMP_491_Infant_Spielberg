import {Container } from "@mui/material";

import React, { useEffect, useState } from "react";

import GridLayout from "../GridLayout";
import Navbar from "../Navbar";

import PostBrowser from "../PostBrowser";

const ExploreView = () => {
  return (
    <Container>
      <Navbar />
      <GridLayout
        left={<PostBrowser createPost contentType="posts" />}
      />
    </Container>
  );
};

export default ExploreView;
