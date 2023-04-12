import { Container, Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ProjectCard from "./ProjectCard";
import { TProject } from "../../api/getProjects";

interface props {
  projects: TProject[];
}

export default function ProjectsGrid({ projects }: props) {
  return (
    <Grid2 container gap="50px" justifyContent="center" sx={{ margin: "px" }}>
      {projects.map((project) => (
        <Grid2 key={project._id}>
          <ProjectCard
            title={project.name}
            semester={project.semester.value}
            image={
              typeof project.content[0] != "undefined"
                ? project.content[0].tab[0].photo
                : ""
            }
            teamname={project.teamname ? project.teamname : "teamname"}
            category={project.category.value}
            likes={project.likes}
          ></ProjectCard>
        </Grid2>
      ))}
    </Grid2>
  );
}
