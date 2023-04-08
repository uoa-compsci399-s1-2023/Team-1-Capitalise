import { Box, Container, Stack, Grid2 } from "../mui";
import { useEffect, useState } from "react";

// Components
import Navbar from "../components/Navbar";
import SearchFilters, { TSearchFilterProps } from "../components/SearchFilters";
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
      <Stack display="flex" height="100%" sx={{ flexDirection: { xs: "column", md: "row"} }}>
        <SearchFilters 
            currFilters={searchFilters}
            setFilters={setSearchFilters}
        />
        <ProjectsGrid projects={projects} />
      </Stack>
    </Box>
  );
};

export default Projects;
