// Yathi - margin on top of projects box to clear fixed position header.
// Also made min height of box 92vh so that it covers entire screen even if there are no projects to show.


// Components
import { Box, Stack, Typography } from "../mui";
import { Pagination as MuiPagination } from "@mui/material";
import ProjectsGrid from "../components/projectCard/ProjectsGrid";

import {
  DesktopSearchFilters,
  MobileSearchFilters
} from "../components/search";

// Other
import { SearchFilterProps } from "./search/DesktopSearchFilters";
import { TProject } from "../api/getProjects";

interface MyPaginationProps extends SearchFilterProps {
  projectsToDisplay: TProject[]
}


const MyPagination = ({
  currFilters, 
  setFilters, 
  projectsToDisplay
}: MyPaginationProps
) => {

  const handlePageChange = (page: number) => {
    setFilters({
      ...currFilters,
      ['currPage']: page
    });
  };

  const currentPage = currFilters.currPage
  const projectsPerPage = currFilters.projectsPerPage

  // calculate the start and end index of the projects to display based on the current page and projectsPerPage
  const startIndex = (currentPage - 1) * projectsPerPage;
  // const endIndex = startIndex + projectsPerPage;

  // slice the projects array to get the projects to display for the current page
  // const projectsToDisplay = projects.slice(startIndex, endIndex);

  // check if there are projects to display
  const checkProjects = projectsToDisplay.length > 0;

  return (
    <Box>
      <DesktopSearchFilters
        {...{currFilters, setFilters}}
      />
      <Stack
        display="flex"
        height="100%"
        flexDirection="column"
        sx={{ ml: { xs: "0", md: "340px" } }}
        paddingBottom="100px"
      >
        <MobileSearchFilters
          {...{currFilters, setFilters}}
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
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            {currFilters.keywords ? `Showing results for "${currFilters.keywords}"` : `Projects`}
          </Typography>
          {/* Render project data into the ProjectsGrid component */}
          <ProjectsGrid projects={projectsToDisplay} />
        </Box>

        <Stack spacing={2} alignItems="center" padding={5}>
          <Box>
            {/* We will return the pagination component IF there are projects to display */}
            {checkProjects && (
              <MuiPagination
                // count={Math.ceil(projects.length / projectsPerPage)}
                count = {10}
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
