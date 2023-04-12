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
  projects: TProject[]
  totalNumProjects: number
}

const MyPagination = ({
  currFilters,
  setFilters,
  projects: projectsToDisplay, 
  totalNumProjects: totalProjects,
}: MyPaginationProps
) => {

  const handlePageChange = (page: number) => {
    setFilters({
      ...currFilters,
      ['currPage']: page
    });
  };

  const currentPage = currFilters.currPage
  const totalPages = Math.ceil(totalProjects / currFilters.projectsPerPage)
  console.log(totalProjects)

  // check if there are projects to display
  const checkProjects = projectsToDisplay.length > 0;

  return (
    <Box mt='8vh' >
      <DesktopSearchFilters
        {...{ currFilters, setFilters }}
      />
      <Stack
        display="flex"
        minHeight="92vh"
        flexDirection="column"
        sx={{ ml: { xs: "0", md: "340px" } }}
        paddingBottom="0px" // changed from 100
      >
        <MobileSearchFilters
          {...{ currFilters, setFilters }}
        />
        <Typography
          my={4}
          variant="h4"
          component="h1"
          sx={{
            textAlign: { xs: "center", md: "left" },
            ml: { md: "40px" }
          }}
        >
          {currFilters.keywords ? `Showing results for "${currFilters.keywords}"` : `Projects`}
        </Typography>
        {/* Render project data into the ProjectsGrid component */}
        {checkProjects && <ProjectsGrid projects={projectsToDisplay} />}
        {/* <Box
          sx={{
            minWidth: 300,
            height: '100%',
            // minHeight: 700,
            // maxHeight: 700,
          }}
        >
          
        </Box> */}

        <Stack spacing={2} alignItems="center" padding={5}>
          <Box>
            {/* We will return the pagination component IF there are projects to display */}
            {checkProjects && (
              <MuiPagination
                // count={Math.ceil(projects.length / projectsPerPage)}
                count={totalPages}
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
