import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { getProject } from "../api/getProject";
import { getUser } from "../api/getUser";
import { TUser } from "../model/TUser";
import { TProject } from "../model/TProject";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import MyTabs from "../components/MyTabs";
import ExternalLinkBtn from "../components/projectPage/ExternalLinkBtn";
import { useAuth } from "../customHooks/useAuth";
import EditUser from "../components/EditUser";
import Error from "../components/Error";

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<TUser | undefined>();
  const [project, setProject] = useState<TProject | undefined>();
  const [likedProjects, setLikedProjects] = useState<TProject[]>([]);
  const [open, setOpen] = useState(false);
  let { userID } = useParams();
  const userTabs = [
    {
      label: "Overview",
      index: "1",
      Component: (
        <Stack height="100%">
          <Box padding="0px 24px 10px 24px">
            <Typography variant="h6">Bio</Typography>
            {typeof user != "undefined" && (
              <Typography whiteSpace="pre">
                {typeof user.bio != "undefined" ? user.bio : ""}
              </Typography>
            )}
          </Box>
          <Divider />
          {typeof project != "undefined" && (
            <Box padding="10px 24px 0px 24px">
              <Typography variant="h6">Project</Typography>
              <ProjectCard
                title={project.name}
                semester={project.semester.value}
                image={
                  typeof project.thumbnail != "undefined"
                    ? project.thumbnail
                    : ""
                }
                teamname={project.teamname ? project.teamname : "teamname"}
                category={project.category.value}
                likes={project.likes}
                badges={
                  typeof project.badges != "undefined"
                    ? project.badges.value
                    : ""
                }
                projectID={project._id}
              ></ProjectCard>
            </Box>
          )}
        </Stack>
      ),
    },
    {
      label: "Likes",
      index: "2",
      Component: (
        <Box height="100%" padding="0px 24px 10px 24px">
          <Typography variant="h6">Likes</Typography>
          <ProjectsGrid projects={likedProjects} justifyContent="start" />
        </Box>
      ),
    },
  ];
  useEffect(() => {
    const fetchUser = async () => {
      if (!userID) return;
      const newUser = await getUser(userID);
      setUser(newUser);
      setIsLoading(false);
    };
    fetchUser();
  }, [userID]);

  let isLoggedIn = false;
  let token = "";
  const auth = useAuth();
  if (auth.user) {
    if (auth.user._id === user?._id || auth.user.userType === "admin") {
      isLoggedIn = true;
      token = auth.getToken() as string;
    }
  }

  useEffect(() => {
    if (typeof user === "undefined") return;
    const fetchProject = async () => {
      if (typeof user.project === "undefined") return;
      const newProject = await getProject(user.project._id);
      setProject(newProject);
    };
    const fetchLikes = async () => {
      let likedProjects: TProject[] = [];
      for (const projectId of user.likedProjects) {
        const newProject = await getProject(projectId);
        if (newProject) {
          likedProjects.push(newProject);
        }
      }
      setLikedProjects(likedProjects);
    };
    fetchProject();
    fetchLikes();
  }, [user]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (typeof user === "undefined") {
    return <Box>{isLoading ? <Box /> : <Error />}</Box>;
  }

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent={{ xs: "start", md: "center" }}
      spacing={0}
      minHeight="92vh"
      margin="8vh 0vh auto"
      paddingTop="20px"
    >
      <Stack
        display="flex"
        direction="column"
        alignItems="start"
        width={{ xs: "100%", md: "305px" }}
        padding="24px"
      >
        <Box display={{ xs: "flex", md: "block" }} width="100%">
          <Box
            width={{ xs: "25%", md: "90%" }}
            component="img"
            src={user.profilePicture}
            alt="user profile"
            referrerPolicy="no-referrer"
            borderRadius="50%"
            alignSelf="center"
            sx={{ aspectRatio: "1 / 1", objectFit: "cover" }}
          ></Box>
          <Box paddingLeft={{ xs: "24px", md: "0px" }}>
            <Typography>{user.userType}</Typography>
            <Typography
              width="100%"
              variant="h6"
              style={{ wordBreak: "break-all" }}
            >
              {user.name}
            </Typography>
            <Stack direction={{ xs: "row", md: "column" }} spacing={1}>
              {user.links.map((link) => (
                <Box key={link._id}>
                  <ExternalLinkBtn
                    type={link.type}
                    value={link.value}
                    _id={link._id}
                  />
                </Box>
              ))}
            </Stack>
            {isLoggedIn && (
              <Box paddingTop="10px">
                <Button
                  onClick={handleClickOpen}
                  variant="outlined"
                  sx={{ width: "180px" }}
                >
                  Edit Profile
                </Button>
                <EditUser
                  open={open}
                  handleClose={handleClose}
                  user={user}
                  token={token}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Stack>
      <Box height="inherit" width={{ xs: "100%", md: "1150px" }}>
        <MyTabs tabs={userTabs} />
      </Box>
    </Stack>
  );
};

export default UserProfile;
