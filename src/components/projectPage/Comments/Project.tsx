import React, { useEffect, useState } from "react";
import { Stack, useTheme, Container, Button } from "@mui/material";
import { getProject } from "../api/getProject";
import { TProject } from "../api/getProjects";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import { getComments } from "../api/getComments";

import Comments from "../components/Comments";

import { TComment } from "../model/TComment";

import { useAuth } from "../customHooks/useAuth";

import { getProjectComments } from "../api/getProjectComments";

import { API_URL } from "../api/config";
import { useNavigate } from "react-router-dom";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Project = () => {
  const auth = useAuth();
  const navigate = useNavigate();

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

  // make an admin delete button which calls the delete project API
  // when delete project is clicked, should redirect back to projects page to get out of the individual project page
  const adminDeleteProject = async (projectId: string) => {
    const token = auth.getToken();
    if (token) {
      if (window.confirm("Are you sure you want to remove this project?")) {
        fetch(`${API_URL}/api/projects/${projectId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            projectId: projectId,
          }),
        }).then(() => {
          // we need to redirect user back to projects page
          navigate("/projects");
        });
      }
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
            {auth.isAllowed(["admin"]) && (
              <Button
                variant="outlined"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => adminDeleteProject(project._id)}
                size="small"
                color="error"
              >
                Delete
              </Button>
            )}
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