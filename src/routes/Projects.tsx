import { Box, Container, Stack, Grid2, Typography } from "../mui";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    async function fetchProjects() {
      const newProjects = await getProjectsSearch({...searchFilters});
      setProjects(newProjects);
    }
    fetchProjects();
  }, [searchFilters]);

  return (
    <Box bgcolor="#f9f9f9" width='100%'>
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
