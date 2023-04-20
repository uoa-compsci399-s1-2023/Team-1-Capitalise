import { Box, Stack, Typography, useTheme, Button, Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";

import { useAuth } from "../../customHooks/useAuth";
import { API_URL } from "../../api/config";

interface ProjectHeaderProps {
  name: string;
  blurb?: string;
  likes: number;
  projectId: string;
}

export default function ProjectHeader({
  name,
  blurb,
  likes,
  projectId,
}: ProjectHeaderProps) {
  const theme = useTheme();
  const auth = useAuth();

  // function to handle liking a project
  const likeProject = async (projectId: string) => {
    const token = auth.getToken();
    if (token) {
      fetch(`${API_URL}/api/projects/${projectId}/like`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      })
        .then((response) => response.json())
        .then((response) => console.log(JSON.stringify(response)));
    } else {
      // console.log("user is not authenticated and cannot leave a like");
      alert("You must be logged in to leave a like");
    }
  };

  return (
    <>
      <Stack
        // style={theme.contentBlock}
        padding={"0 40px"}
        width={"100%"}
        mt={4}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box>
          <Typography
            variant="h1"
            color="initial"
            mt={1}
            fontWeight={600}
            alignSelf={"center"}
          >
            {name}
          </Typography>
          <Typography component="p" variant="body2" fontSize={16} mt={1}>
            {blurb}
          </Typography>
        </Box>

        <Stack flexDirection={"row"} gap={2}>
          <Button
            onClick={() => {
              likeProject("6432fd557b09c2f91d48a112"); // pass in a projectId
            }}
            variant="contained"
            color="error"
            startIcon={<FavoriteIcon />}
          >
            {`Like (${likes})`}
          </Button>
          <Button
            variant="outlined"
            color="neutral"
            startIcon={<ChatOutlinedIcon />}
          >
            Comment
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
