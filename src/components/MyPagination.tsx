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

  // check if there are projects to display
  const checkProjects = projectsToDisplay.length > 0;

  return (
    <Box>
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
        <Box
          sx={{
            minWidth: 300,
            minHeight: 700,
            maxHeight: 700,
          }}
        >
          <Typography
            my={4}
            variant="h4"
            component="h1"
            sx={{ textAlign: { xs: "center", md: "center" } }}
          >
            Projects
          </Typography>
          {/* Render project data into the ProjectsGrid component */}
          <ProjectsGrid projects={projectsToDisplay} />
        </Box>

        <Stack spacing={2} alignItems="center" padding={5}>
          <Box>
            {/* We will return the pagination component IF there are projects to display */}
            {checkProjects && (
              <MuiPagination
                count={Math.ceil(projects.length / projectsPerPage)}
                page={currentPage}
                onChange={(_, page) => handlePageChange(page)}
                showFirstButton
                showLastButton
                color="primary"
              />
            )}
          </Box>
          {/* If there are no projects to display, then we don't need to show pagination.
          We just display an error message instead */}
          {!checkProjects && <Typography>No projects to display</Typography>}
        </Stack>
      </Stack>
    </Box>
  );
};

export default MyPagination;
