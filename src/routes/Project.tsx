import React, { useEffect, useState } from "react";
import { Stack, useTheme, Container } from "@mui/material";
import { getProject } from "../api/getProject";
import { TProject } from "../api/getProjects";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import { getComments } from "../api/getComments";

import Comments from "../components/Comments";

import { TComment } from "../api/getComments";

import { useAuth } from "../customHooks/useAuth";

import { getProjectComments } from "../api/getProjectComments";

const Project = () => {
  const auth = useAuth();

  const [project, setProject] = useState<TProject | undefined>();
  let { projectId } = useParams();

  const [comments, setComments] = useState<TComment[]>([]);

  // this use effect grabs to project by id so we can display info about it.
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      const newProject = await getProject(projectId);
      setProject(newProject);

      // We are using the get all comments endpoint to test rendering
      const respData = await getProjectComments(projectId);
      setComments(respData);
    };
    fetchProject();
  }, [projectId]);

  const handleSignin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uname = e.target.username.value;
    const password = e.target.password.value;
    auth.signin(uname, password);
  };

  let currentId = "";
  const handleComment = () => {
    auth.onlyAuthenticated(); // Redirects the use to the signin page if not signed in (currently just redirects to projects page)
    if (auth.user) {
      currentId = auth.user._id;
      console.log("User id of the current user:", currentId);
    }
  };

  return (
    <div>
      <Box
        sx={{
          paddingLeft: 44,
          paddingTop: 5,
          backgroundColor: "white",
        }}
      >
        {project ? (
          <div>
            <Stack mt={2} paddingLeft={4} paddingTop={4} spacing={1}>
              <Typography variant="h5" color="initial" fontWeight={500}>
                NAME: {project.name}
              </Typography>
              <Typography variant="h5" color="initial" fontWeight={500}>
                LIKES: {project.likes}
              </Typography>
            </Stack>
            <Stack mt={2} paddingLeft={4} paddingTop={4} spacing={1}>
              <Typography variant="h5" color="initial" fontWeight={500}>
                Comments
              </Typography>
              <Comments comments={comments} projectId={projectId} />
            </Stack>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Box>
    </div>
  );
};

export default Project;
