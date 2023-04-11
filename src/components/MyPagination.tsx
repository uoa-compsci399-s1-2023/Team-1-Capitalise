import * as React from "react";
import { useEffect, useState } from "react";

// Components
import { Box, Container, Stack, Grid2, Typography } from "../mui";
import { Pagination as MuiPagination } from "@mui/material";
import ProjectsGrid from "../components/projectCard/ProjectsGrid";
import Navbar from "../components/Navbar";
import {
  DesktopSearchFilters,
  MobileSearchFilters,
  TSearchFilterProps,
} from "../components/search";

// APIs
import { TProject, getProjects } from "../api/getProjects";
import { getProjectsSearch } from "../api/getSearchProjects";

const MyPagination: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6); // Number of items to display per page
  const [projects, setProjects] = useState<TProject[]>([]);

  const [searchFilters, setSearchFilters] = useState<TSearchFilterProps>({
    keywords: "",
    category: "",
    semester: "",
    award: "",
    sortby: "",
  });

  useEffect(() => {
    // fetch total number of projects from call to the fetch API (would be able to work with another fetch api like search)
    // need to change it to the searchProjects API.
    const fetchProjects = async () => {
      try {
        const projects = await getProjectsSearch({ ...searchFilters });
        setProjects(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, [searchFilters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // calculate the start and end index of the projects to display based on the current page and projectsPerPage
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;

  // slice the projects array to get the projects to display for the current page
  const projectsToDisplay = projects.slice(startIndex, endIndex);

  return (
    <div>
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
        paddingBottom="100px"
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
        {/* Render project data into the ProjectsGrid component */}
        <ProjectsGrid projects={projectsToDisplay} />

        <Stack spacing={2} alignItems="center" padding={10}>
          <MuiPagination
            count={Math.ceil(projects.length / projectsPerPage)}
            page={currentPage}
            onChange={(_, page) => handlePageChange(page)}
            showFirstButton
            showLastButton
            color="primary"
          />
        </Stack>
      </Stack>
    </div>
  );
};

export default MyPagination;
