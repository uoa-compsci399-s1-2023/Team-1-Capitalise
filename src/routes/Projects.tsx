import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";

// Components
import Navbar from "../components/Navbar";
import {
  DesktopSearchFilters,
  MobileSearchFilters,
  TSearchFilterProps,
} from "../components/search";
import ProjectsGrid from "../components/projectCard/ProjectsGrid";
import MyPagination from "../components/MyPagination";

// Apis
import { TProject, getProjects } from "../api/getProjects";
import { getProjectsSearch } from "../api/getSearchProjects";
const Projects = () => {
  return (
    <Box bgcolor="#f9f9f9" width="100%">
      <Navbar />
      <MyPagination />
    </Box>
  );
};

export default Projects;
