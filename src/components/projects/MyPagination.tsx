// Yathi - margin on top of projects box to clear fixed position header.
// Also made min height of box 92vh so that it covers entire screen even if there are no projects to show.

import { useState, useEffect, useContext } from "react";

// Components
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Pagination as MuiPagination } from "@mui/material";
import ProjectsGrid from "./ProjectsGrid";

import { DesktopSearchFilters, MobileSearchFilters } from "../search";

// Other
import { TProject } from "../../model/TProject";
import { getProjectsSearch } from "../../api/getSearchProjects";
import { SearchContext } from "../../app";

const MyPagination = () => {
  const [projects, setProjects] = useState<TProject[]>([]);
  const [totalNumProjects, setTotalNumProjects] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { currFilters, setFilters } = useContext(SearchContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const searchOverflow = useMediaQuery("(min-width:1062px)");

  // Fetch required number of projects based on given parameters
  useEffect(() => {
    setIsLoading(true);
    const fetchProjects = async () => {
      const respData = await getProjectsSearch({ ...currFilters });
      setTotalNumProjects(respData.searchTotal);
      setProjects(respData.projects);
      setIsLoading(false);
    };
    fetchProjects();
  }, [currFilters]);

  const handlePageChange = (page: number) => {
    setProjects([]);
    setFilters({
      ...currFilters,
      ["currPage"]: page,
    });
    window.scrollTo(0, 0);
  };

  const currentPage = currFilters.currPage;
  const totalPages = Math.ceil(totalNumProjects / currFilters.projectsPerPage);

  // check if there are projects to display
  const checkProjects = projects.length > 0;

  return (
    <Box>
      {/* Search sidebar for desktop */}
      <DesktopSearchFilters />

      <Stack
        display="flex"
        minHeight="92vh"
        flexDirection="column"
        sx={{ ml: { xs: "0", md: "340px" } }}
        px={2}
        paddingBottom="0px" // changed from 100
      >
        {/* Search section for mobile */}
        <MobileSearchFilters />

        <Box
          display="grid"
          gridTemplateColumns={{ xs: "", md: "repeat(auto-fill, 320px)" }}
          flexDirection="row"
          flexWrap="wrap"
          gap="50px"
          justifyContent="center"
        >
          <Typography
            my={4}
            variant="h1"
            whiteSpace={searchOverflow ? "nowrap" : "unset"}
            sx={{
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {currFilters.keywords
              ? `Showing results for "${currFilters.keywords}"`
              : `Projects`}
          </Typography>
        </Box>
        {/* Render project data into the ProjectsGrid component */}
        {checkProjects && <ProjectsGrid projects={projects} />}

        <Stack
          spacing={2}
          alignItems="center"
          padding={{ xs: "30px 20px", md: 5 }}
        >
          <Box>
            {/* We will return the pagination component IF there are projects to display */}
            {checkProjects && (
              <MuiPagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => handlePageChange(page)}
                showFirstButton
                showLastButton
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            )}
          </Box>
          {/* If there are no projects to display, then we don't need to show pagination.
          We just display an error message instead */}
          {!checkProjects && !isLoading && (
            <Typography>No projects to display</Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default MyPagination;
