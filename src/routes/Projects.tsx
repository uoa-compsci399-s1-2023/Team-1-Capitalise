import { Box, Container, Stack, Grid2 } from "../mui";
import { useEffect, useState } from "react";

// Components
import ProjectCard from "../components/ProjectCard";
import Navbar from "../components/Navbar";
import SearchFilters, { TSearchFilterProps } from "../components/SearchFilters";

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
    <Box bgcolor="#f9f9f9">
      <Stack display="flex" direction="column" height="100%">
        <Navbar />
        <Stack display="flex" direction="row" height="100%">
          <Box bgcolor="white" width="340px" padding="30px 40px">
            <SearchFilters 
              currFilters={searchFilters}
              setFilters={setSearchFilters}
            />
          </Box>
          <Container>
            <Box display="flex" justifyContent="center" padding=" 30px 0px">
              <h1>Projects</h1>
            </Box>
            <Grid2
              container
              gap="50px"
              justifyContent="center"
              sx={{ margin: "px" }}
            >
              {projects.map((project) => (
                <Grid2 key={project._id}>
                  <ProjectCard
                    title={project.name}
                    semester={project.semester}
                  ></ProjectCard>
                </Grid2>
              ))}
            </Grid2>
          </Container>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Projects;
