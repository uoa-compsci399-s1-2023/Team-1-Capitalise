// when a project card is selected,
// should redirec to the project details page
// of the project that had been selected.

import React, { useEffect, useState } from "react";
import { Stack, useTheme, Container } from "@mui/material";
import { getProjectbyId } from "../api/getProjectbyId";
import { TProject } from "../api/getProjects";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const ProjectDetails = () => {
  const [project, setProject] = useState<TProject | undefined>();
  let { projectId } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      const newProject = await getProjectbyId(projectId);
      setProject(newProject);
    };
    fetchProject();
  }, [projectId]);

  return (
    <Box
      justifyContent="center"
      display="flex"
      alignItems="center"
      width="100%"
      minHeight="92vh"
      mt="8vh"
    >
      <Typography>
        {project?.name} {project?._id}
      </Typography>
    </Box>
  );
};

export default ProjectDetails;
