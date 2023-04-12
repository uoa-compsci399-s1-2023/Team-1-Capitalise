// Yathi - margin on top of projects box to clear fixed position header.
// Also made min height of box 92vh so that it covers entire screen even if there are no projects to show.

// MUI & React
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

// Components
import Navbar from "../components/Navbar";
import { DesktopSearchFilters, MobileSearchFilters } from "../components/search"
import ProjectsGrid from "../components/ProjectsGrid";

// Apis
import { TProject } from "../api/getProjects";
import { getProjectsSearch } from "../api/getSearchProjects";

// Other
import { searchFilterParams, TAvailParameters, fetchCurrentParameters } from "../components/search/AvailableParams";

// Represents curr state of filters
export type TFiltersState = {
  keywords: string,
  category: TAvailParameters['category'][0],
  semester: TAvailParameters['semester'][0],
  award: TAvailParameters['award'][0],
  sortBy: TAvailParameters['sortBy'][0],
}

const Projects = () => {

  const theme = useTheme();
  const [projects, setProjects] = useState<TProject[]>([]);
  const [searchFilters, setSearchFilters] = useState<TFiltersState>({
    keywords: '',
    category: searchFilterParams.category[0],
    semester: searchFilterParams.semester[0],
    award: searchFilterParams.award[0],
    sortBy: searchFilterParams.sortBy[0]
  })

  // Fetch available search parameters on initial render
  useEffect(() => {
    fetchCurrentParameters();
  }, [])

  // Fetch projects every time user changes search filters
  useEffect(() => {
    async function fetchProjects() {
      const newProjects = await getProjectsSearch({ ...searchFilters });
      setProjects(newProjects);
    }
    fetchProjects();
  }, [searchFilters]);

  return (
    <Box bgcolor={theme.customColors.bgGrey} width='100%' mt='8vh' minHeight='92vh'>
      <Navbar currFilters={searchFilters} setFilters={setSearchFilters} />
      <DesktopSearchFilters
        currFilters={searchFilters}
        setFilters={setSearchFilters}
      />
      <Stack display="flex" height="100%" flexDirection="column" sx={{ ml: { xs: "0", md: "340px" } }}>
        <MobileSearchFilters
          currFilters={searchFilters}
          setFilters={setSearchFilters}
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
          {searchFilters.keywords ? `Showing results for "${searchFilters.keywords}"` : `Projects`}
        </Typography>
        <ProjectsGrid projects={projects} />
      </Stack>
    </Box>
  );
};

export default Projects;
