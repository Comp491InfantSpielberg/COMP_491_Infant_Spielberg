import React from "react";
import HorizontalStack from "./util/HorizontalStack";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const UserEntry = ({ username }) => {
  return (
    <HorizontalStack justifyContent="space-between" key={username}>
      <HorizontalStack>
        <Typography>{username}</Typography>
      </HorizontalStack>
      <Link to={"/users/" + username}>View</Link>
    </HorizontalStack>
  );
};

export default UserEntry;
