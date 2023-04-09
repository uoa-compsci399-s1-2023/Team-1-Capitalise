import { Box, Container, Stack } from "@mui/material";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { TProject, getProjects } from "../api/getProjects";
import MyPagination from "../components/MyPagination";

const Projects = () => {
  const [projects, setProjects] = useState<TProject[]>([]);

  // this is loading ALL the projects from the getProjects() api
  useEffect(() => {
    async function fetchProjects() {
      const newProjects = await getProjects();
      setProjects(newProjects);
    }
    fetchProjects();
  }, []);

  // once all the projects are fetched, we want another array to sort what happens for the pagination
  // for example, if the pagination needs to display 6 projects per page and we have 7,
  // the projects for pagination array would contain those 6 projects which can be mapped to the project cards.
  // on event click, the array would then need to update to store the 1 remaining project which will need to be mapped to be displayed

  // however, we need a way for pagination to be able to set the projects (that is, the pageProjects array)
  //

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
      <Container>
        <Box display="flex" justifyContent="center" padding=" 20px">
          <MyPagination projects={projects} />
        </Box>
      </Container>
    </Box>
  );
};

export default Projects;
