import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { getUser, TUser } from "../api/getUser";
import { useEffect, useState } from "react";
import MyTabs from "../components/MyTabs";
import ProjectCard from "../components/projectCard/ProjectCard";
import { TProject, getProject } from "../api/getProject";

import ProjectsGrid from "../components/projectCard/ProjectsGrid";

const UserProfile = () => {
  const [user, setUser] = useState<TUser | undefined>();
  const [project, setProject] = useState<TProject | undefined>();
  const [likedProjects, setLikedProjects] = useState<TProject[]>([]);
  let { userName } = useParams();
  const theme = useTheme();
  const userTabs = [
    {
      label: "Overview",
      index: "1",
      Component: (
        <Stack height="100%">
          <Box height="30%" padding="0px 24px 10px 24px">
            <Typography variant="h6">Bio</Typography>
            <Typography>Hi</Typography>
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
      if (!userName) return;
      const newUser = await getUser(userName);
      setUser(newUser);
    };
    fetchUser();
  }, [userName]);

  useEffect(() => {
    if (typeof user === "undefined") return;

    const fetchProject = async () => {
      if (typeof user.project === "undefined") return;
      const newProject = await getProject(user.project._id);
      setProject(newProject);
    };
    const fetchLikes = async () => {
      let likedProjects = [];
      for (const projectId of user.likedProjects) {
        const newProject = await getProject(projectId);
        likedProjects.push(newProject);
      }
      setLikedProjects(likedProjects);
    };
    fetchProject();
    fetchLikes();
  }, [user]);

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
      margin="8vh 0vh auto"
    >
      <Stack
        display="flex"
        direction="column"
        alignItems="start"
        width={{ xs: "100%", md: "300px" }}
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
            <Typography>{user.username}</Typography>
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
