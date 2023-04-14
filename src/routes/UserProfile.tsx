import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { getUser, TUser } from "../api/getUser";
import { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState<TUser | undefined>();
  let { userName } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userName) return;
      const newUser = await getUser(userName);
      setUser(newUser);
    };
    fetchUser();
  }, [userName]);

  return (
    <Box
      justifyContent="center"
      display="flex"
      alignItems="center"
      width="100%"
      minHeight="92vh"
      mt="8vh"
    >
      <Typography>{user?.name}</Typography>
    </Box>
  );
};

export default UserProfile;
