// need to add comment support

import React, { useEffect, useState } from "react";
import { Stack, useTheme, Container } from "@mui/material";
import { getProjectbyId } from "../api/getProjectbyId";
import { TProject } from "../api/getProjects";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import CommentBox from "../components/CommentBox";
import Comment from "../components/Comment";
import { writeComment } from "../api/writeComment";

const ProjectDetails = () => {
  const [project, setProject] = useState<TProject | undefined>();
  let { projectId } = useParams();

  // this use effect grabs to project by id so we can display info about it.
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      const newProject = await getProjectbyId(projectId);
      setProject(newProject);
    };
    fetchProject();
  }, [projectId]);

  const handleCommentSubmit = (comment: string) => {
    // add the comment to te comments array in the state
    // setComments([...comments, comment]);
    writeComment();
    console.log("Comment submited");
  };

  return (
    <Box width="100%" minHeight="92vh" mt="10vh">
      <h1>Project test</h1>
      <Stack spacing={1}>
        <Typography>Project name: {project?.name}</Typography>
        <Typography>Project id: {project?._id}</Typography>
        <Typography>Likes: {project?.likes}</Typography>
      </Stack>

      {/* Grab the comments from the current project and display them */}
      <Stack paddingTop={5}>
        <h1>Comments</h1>
        {project?.comments.map((comment, index) => (
          <Comment key={index} text={comment} />
        ))}
      </Stack>

      {/* Display area for write comment */}
      <Box
        sx={{
          width: 600,
          height: 200,
        }}
      >
        {/* This is where we can write a comment - NEEDS TO BE CONNECTED TO WRITECOMMENT ENDPOINT */}
        <Stack padding={5}>
          <CommentBox onSubmit={handleCommentSubmit} />
        </Stack>
      </Box>
    </Box>
  );
};

export default ProjectDetails;
