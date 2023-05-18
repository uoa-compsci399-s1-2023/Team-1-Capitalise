import { Box, IconButton, Stack, Typography } from "@mui/material";
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
  const slideRight = () => {
    const element = document.getElementById(category);
    if (element) {
      element.scrollLeft = element.scrollLeft - 420;
    }
  };

  const slideLeft = () => {
    const element = document.getElementById(category);
    if (element) {
      element.scrollLeft = element.scrollLeft + 420;
    }
  };

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
        <IconButton onClick={slideRight}>
          <ArrowBackIosIcon />
        </IconButton>
      </Box>
      <Box
        id={category}
        display="flex"
        gap="100px"
        padding={{ xs: "90px 45px", md: "90px 90px" }}
        sx={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          overflowX: "scroll",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            width: 0,
          },
        }}
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
              project.badges ? project.badges.value : "" 
            }
            projectID={project._id}
            key={project._id}
          ></ProjectCard>
        ))}
      </Box>
      <Box position="absolute" zIndex={1} right="20px">
        <IconButton onClick={slideLeft}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Carousel;
