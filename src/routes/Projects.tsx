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
import { TProject, getProjects } from "../api/getProjects";
import { getProjectsSearch } from "../api/getSearchProjects";

const Projects = () => {
  
  const [projects, setProjects] = useState<TProject[]>([]);
  const [searchFilters, setSearchFilters] = useState<TSearchFilterProps>( {
    keywords: '',
    category: '',
    semester: '',
    award: '',
    sortby: ''
  } )

  const theme = useTheme();

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
          // textAlign="center"
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
