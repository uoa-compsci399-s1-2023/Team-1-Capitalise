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
      const respData = await getComments();
      setComments(respData);
      console.log(comments);
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
      <h1>About {auth.user?.name} </h1>
      {auth.error && <h3>{auth.error}</h3>}
      <Box mb={6}>
        <form onSubmit={handleSignin}>
          username: <input type="text" name="username" id="username" />
          password: <input type="text" name="password" />
          <input type="submit" value={"signin"} />
          <input type="button" onClick={auth.signout} value={"signout"} />
        </form>
      </Box>
      {project ? (
        <div>
          <h2>NAME: {project.name}</h2>
          <p>LIKES: {project.likes}</p>
          <Comments comments={comments} projectId={projectId} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Project;
