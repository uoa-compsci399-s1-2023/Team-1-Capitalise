import { useEffect, useState } from "react";
import { Box, Container, Stack, Grid2, Typography } from "../mui";

// Components
import Navbar from "../components/Navbar";
import {
  DesktopSearchFilters,
  MobileSearchFilters,
  TSearchFilterProps,
} from "../components/search";
import ProjectsGrid from "../components/ProjectsGrid";
import MyPagination from "../components/MyPagination";
import { getProjectsSearch } from "../api/getSearchProjects";

// Apis
import { TProject, getProjects } from "../api/getProjects";

const Projects = () => {
  const [projects, setProjects] = useState<TProject[]>([]);
  const [searchFilters, setSearchFilters] = useState<TSearchFilterProps>({
    keywords: "",
    category: "",
    semester: "",
    award: "",
    sortby: "",
  });

  useEffect(() => {
    async function fetchProjects() {
      const newProjects = await getProjectsSearch({ ...searchFilters });
      setProjects(newProjects);
    }
    fetchProjects();
  }, [searchFilters]);

  return (
    <Box bgcolor="#f9f9f9" width="100%">
      <Navbar />

      <DesktopSearchFilters
        currFilters={searchFilters}
        setFilters={setSearchFilters}
      />
      <Stack
        display="flex"
        height="100%"
        flexDirection="column"
        sx={{ ml: { xs: "0", md: "340px" } }}
      >
        <MobileSearchFilters
          currFilters={searchFilters}
          setFilters={setSearchFilters}
        />
        <Typography
          my={4}
          variant="h4"
          component="h1"
          // textAlign="center"
          sx={{ textAlign: { xs: "center", md: "center" } }}
        >
          Projects
        </Typography>
        <MyPagination />
      </Stack>
    </Box>
  );
};

export default Projects;
