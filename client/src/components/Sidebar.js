import { Stack } from "@mui/material";
import React, { useState } from "react";
import FindUsers from "./FindUsers";

const Sidebar = () => {
  return (
    <Stack spacing={2}>
      <FindUsers />
    </Stack>
  );
};

export default Sidebar;
