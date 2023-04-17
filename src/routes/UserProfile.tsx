import { Box, Stack, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { getUser, TUser } from "../api/getUser";
import { useEffect, useState } from "react";
import { TabPanel } from "@mui/lab";
import MyTabs from "../components/MyTabs";

const UserProfile = () => {
  const [user, setUser] = useState<TUser | undefined>();
  let { userName } = useParams();
  const theme = useTheme();
  const userTabs = [
    {
      label: "Overview",
      index: "1",
      Component: <div>Hello, I am tab 1</div>,
    },
    {
      label: "Likes",
      index: "2",
      Component: <div>Hello, I am tab 2</div>,
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      if (!userName) return;
      const newUser = await getUser(userName);
      setUser(newUser);
    };
    fetchUser();
  }, [userName]);

  if (typeof user === "undefined") {
    return (
      <Box
        justifyContent="center"
        display="flex"
        width="100%"
        minHeight="92vh"
        mt="8vh"
      >
        <Typography>{userName} does not exist</Typography>
      </Box>
    );
  }

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent={{ xs: "start", md: "center" }}
      spacing={0}
      minHeight="92vh"
      margin="8vh auto"
    >
      <Stack
        display="flex"
        direction="column"
        alignItems="start"
        width={{ xs: "100%", md: "300px" }}
        paddingTop="20px"
      >
        <Box
          width="90%"
          component="img"
          src={user.profilePicture}
          alt="user profile"
          referrerPolicy="no-referrer"
          borderRadius="50%"
          alignSelf="center"
        ></Box>
        <Typography>{user.userType}</Typography>
        <Typography
          width="100%"
          variant="h6"
          style={{ wordBreak: "break-all" }}
        >
          {user.name}
        </Typography>
      </Stack>
      <Box width={{ xs: "100%", md: "1000px" }}>
        <MyTabs tabs={userTabs} />
      </Box>
    </Stack>
  );
};

export default UserProfile;
