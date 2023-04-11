import * as React from "react";
import { useEffect, useState } from "react";

// Components
import { Box, Container, Stack, Grid2, Typography } from "../mui";
import Navbar from "../components/Navbar";
import {
  DesktopSearchFilters,
  MobileSearchFilters,
  TSearchFilterProps,
} from "../components/search";
import ProjectsGrid from "../components/ProjectsGrid";
import MyPagination from "../components/MyPagination";

// Apis
import { TProject, getProjects } from "../api/getProjects";
import { getProjectsSearch } from "../api/getSearchProjects";

const Projects = () => {
  return (
    <Box bgcolor="#f9f9f9" width="100%">
      <MyPagination />
    </Box>
  );
};

export default Projects;
