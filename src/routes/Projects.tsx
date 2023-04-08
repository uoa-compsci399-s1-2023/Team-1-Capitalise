import { Box, Container, Stack } from "@mui/material";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { TProject, getProjects } from "../api/getProjects";

const Projects = () => {
  const [projects, setProjects] = useState<TProject[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const newProjects = await getProjects();
      setProjects(newProjects);
    }
    fetchProjects();
  }, []);

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
    </Box>
  );
};

export default Projects;
