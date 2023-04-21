import { Container, Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ProjectCard from "./ProjectCard";
import { TProject } from "../../model/TProject";
interface props {
  projects: TProject[];
}
export default function ProjectsGrid({ projects }: props) {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, 320px)"
      flexDirection="row"
      flexWrap="wrap"
      gap="50px"
      justifyContent="center"
      flex={1} // Grows grid to push pagination to bottom
    >
      {projects.map((project) => (
        <Box key={project._id}>
          <ProjectCard
            title={project.name}
             semester={project.semester.value}
             image={ project.thumbnail ? project.thumbnail : "" }
            teamname={project.teamname ? project.teamname : "teamname"}
            category={project.category.value}
            likes={project.likes}
            badges={project.badges ? project.badges.value : ""}
          ></ProjectCard>
        </Box>
      ))}
    </Box>
  );
}