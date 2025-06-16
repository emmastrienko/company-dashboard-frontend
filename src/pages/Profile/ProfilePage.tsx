import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import Profile from "../../components/profile/Profile";
import PasswordChange from "../../components/profile/PasswordChange";

const ProfilePage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        minHeight: "70vh",
        maxWidth: 600,
        mx: "auto",
        my: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" mb={2}>
        User Profile
      </Typography>
      <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 2 }}>
        <Tab label="Profile" />
        <Tab label="Change Password" />
      </Tabs>
      {tab === 0 && <Profile />}
      {tab === 1 && <PasswordChange />}
    </Box>
  );
};

export default ProfilePage;
