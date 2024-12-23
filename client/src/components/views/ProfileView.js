import { Card, Container, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getUser, updateUser } from "../../api/users";
import { isLoggedIn } from "../../helpers/authHelper";

import ErrorAlert from "../ErrorAlert";
import FindUsers from "../FindUsers";
import GridLayout from "../GridLayout";
import Navbar from "../Navbar";
import PostBrowser from "../PostBrowser";
import Profile from "../Profile";
import ProfileTabs from "../ProfileTabs";

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState("posts");
  const user = isLoggedIn();
  const [error, setError] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = async () => {
    const data = await getUser(params);
    setProfile(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;

    setProfile({ ...profile, user: { ...profile.user } });
    setEditing(false);
  };


  useEffect(() => {
    fetchUser();
  }, [location]);


  let tabs;
  if (profile) {
    tabs = {
      posts: (
        <PostBrowser
          profileUser={profile.user}
          contentType="posts"
          key="posts"
        />
      ),
      liked: (
        <PostBrowser
          profileUser={profile.user}
          contentType="liked"
          key="liked"
        />
      ),
    };
  }

  return (
    <Container>
      <Navbar />

      <GridLayout
        left={
            <Stack spacing={2}>
              {profile ? (
                <>
                  <ProfileTabs tab={tab} setTab={setTab} />

                  {tabs[tab]}
                </>
              ) : (
                <>Loading...</>
              )}
              {error && <ErrorAlert error={error} />}
            </Stack>
          
        }
        right={
          <Stack spacing={2}>
            <Profile
              profile={profile}
              editing={editing}
              handleSubmit={handleSubmit}
            />
            <FindUsers />
          </Stack>
        }
      />
    </Container>
  );
};

export default ProfileView;
