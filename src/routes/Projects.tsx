import { Box, Container, Grid, Stack } from "@mui/material";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { TProject, getProjects } from "../api/getProjects";
import MyPagination from "../components/MyPagination";

const Projects = () => {
  // initially empty array, will be populated through pagination.
  const [projects, setProjects] = useState<TProject[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // total number of pages should be dependent on number of projects.

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // FETCH PROJECTS
    const fetchProjects = async () => {
      const newProjects = await getProjects();
      setProjects(newProjects);
    };
    fetchProjects();
  };

  return (
    <Box bgcolor="#f9f9f9">
      <Stack display="flex" direction="column" height="100%">
        <Navbar />
        <Stack display="flex" direction="row" height="100%">
          <Box bgcolor="white" minWidth="220px">
            Search :)
          </Box>
          <Container maxWidth={false}>
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
                    image={
                      typeof project.content[0] != "undefined"
                        ? project.content[0].tab[0].photo
                        : ""
                    }
                  ></ProjectCard>
                </Grid2>
              ))}
            </Grid2>
          </Container>
        </Stack>
      </Stack>
      <Container></Container>
      <Box display="flex" justifyContent="center" padding=" 20px">
        <MyPagination />
      </Box>
    </Box>
  );
};

export default Projects;
