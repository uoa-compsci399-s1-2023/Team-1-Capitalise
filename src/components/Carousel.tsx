import { Box, Stack, Typography } from "@mui/material";
import { TProject } from "../model/TProject";
import ProjectCard from "./projects/ProjectCard";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {
  items: TProject[];
  backgroundColor: string;
  category: string;
}

const Carousel = ({ items, backgroundColor, category }: Props) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      bgcolor={backgroundColor}
      position="relative"
    >
      <Box
        position="absolute"
        zIndex={1}
        top="50px"
        left={{ xs: "45px", md: "90px" }}
      >
        <Typography variant="h5">{category}</Typography>
      </Box>

      <Box position="absolute" zIndex={1} left="20px">
        <ArrowBackIosIcon />
      </Box>
      <Box
        display="flex"
        gap="100px"
        overflow="scroll"
        padding={{ xs: "90px 45px", md: "90px 90px" }}
      >
        {items.map((project) => (
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
              typeof project.badges != "undefined" ? project.badges.value : ""
            }
            projectID={project._id}
            key={project._id}
          ></ProjectCard>
        ))}
      </Box>
      <Box position="absolute" zIndex={1} right="20px">
        <ArrowForwardIosIcon />
      </Box>
    </Box>
  );
};

export default Carousel;
