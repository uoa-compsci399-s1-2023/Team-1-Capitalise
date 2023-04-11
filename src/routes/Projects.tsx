// Yathi - margin on top of projects box to clear fixed position header.
// Also made min height of box 92vh so that it covers entire screen even if there are no projects to show.

import { Box, Container, Stack, Grid2, Typography } from "../mui";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

// Components
import Navbar from "../components/Navbar";
import { DesktopSearchFilters, MobileSearchFilters, TSearchFilterProps } from "../components/search"
import ProjectsGrid from "../components/ProjectsGrid";

// Apis
import { TProject } from "../api/getProjects";
import { getProjectsSearch } from "../api/getSearchProjects";
import { getParams } from '../components/search/AvailableParams'

import { TAvailParameters } from "../api/getSearchParameters"
import { searchFilterParams } from "../components/search/AvailableParams";

const Projects = () => {
  
  const theme = useTheme();
  const [projects, setProjects] = useState<TProject[]>([]);
  const [searchFilters, setSearchFilters] = useState<TSearchFilterProps>( {
    keywords: '',
    category: searchFilterParams.category[0],
    semester: searchFilterParams.semester[0],
    award: searchFilterParams.award[0],
    sortBy: searchFilterParams.sortBy[0]
  } )

  // Fetch available search parameters on initial render
  useEffect(() => {
    getParams();
  }, [])

  // Fetch projects every time user changes search filters
  useEffect(() => {
    async function fetchProjects() {
      const newProjects = await getProjectsSearch({...searchFilters});
      setProjects(newProjects);
    }
    fetchProjects();
  }, [searchFilters]);

  return (
    <Box bgcolor={theme.customColors.bgGrey} width='100%' mt='8vh' minHeight='92vh'>
      <Navbar />
      
      <DesktopSearchFilters 
            currFilters={searchFilters}
            setFilters={setSearchFilters}
      />
      <Stack display="flex" height="100%" flexDirection="column" sx={{ ml: { xs:"0", md:"340px" } }}>
        <MobileSearchFilters             
          currFilters={searchFilters}
           setFilters={setSearchFilters}
        />
        <Typography 
          my={4} 
          variant="h4" 
          component="h1" 
          sx={{ textAlign: {xs: "center", md: "center"} }}
        >
          Projects
        </Typography>


        <ProjectsGrid projects={projects} />
      </Stack>
    </Box>
  );
};

export default Projects;
