import { Box } from "@mui/material";
import ProjectCard from "./ProjectCard";
import { TProject } from "../../model/TProject";
interface props {
  projects: TProject[];
  justifyContent?: string;
}
export default function ProjectsGrid({
  projects,
  justifyContent = "center",
}: props) {
  return (
    <Box flex={1}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 320px)"
        flexDirection="row"
        flexWrap="wrap"
        gap="50px"
        justifyContent={justifyContent}
      >
        {projects.map((project) => (
          <Box key={project._id}>
            <ProjectCard
              title={project.name}
              semester={project.semester.value}
              image={
                typeof project.thumbnail != "undefined" ? project.thumbnail : ""
              }
              teamname={project.teamname ? project.teamname : "teamname"}
              category={project.category.value}
              likes={project.likes}
              badges={
                typeof project.badges != "undefined"
                  ? project.badges.value
                  : "default"
              }
              projectID={project._id}
            ></ProjectCard>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
