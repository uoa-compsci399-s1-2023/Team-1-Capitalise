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

  // Search filter states
  const [keywords, setKeywords] = useState("-1");
  const [selectedCategory, setSelectedCategory] = useState("-1");
  const [selectedSemester, setSelectedSemester] = useState("-1");
  const [selectedAward, setSelectedAward] = useState("-1");
  const [sortBy, setSortBy] = useState("-1");

  
  // Props object for SearchFilters component
  const searchFilterProps: TSearchFilterProps = {
    keywords: keywords,
    setKeywords: setKeywords,
    category: selectedCategory,
    setCategory: setSelectedCategory,
    award: selectedAward,
    setAward: setSelectedAward,
    semester: selectedSemester,
    setSemester: setSelectedSemester,
    sortby: sortBy,
    setSortby: setSortBy
    } 


  useEffect(() => {
    async function fetchProjects() {
      const newProjects = await getProjectsSearch(keywords);
      setProjects(newProjects);
    }
    fetchProjects();
  }, [keywords]);

  return (
    <Box bgcolor="#f9f9f9">
      <Stack display="flex" direction="column" height="100%">
        <Navbar />
        <Stack display="flex" direction="row" height="100%">
          <Box bgcolor="white" width="340px" padding="30px 40px">
            <SearchFilters 
              {...searchFilterProps}
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
