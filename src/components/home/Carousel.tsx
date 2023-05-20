import { Box, IconButton, Stack, Typography } from "@mui/material";
import { TProject } from "../../model/TProject";
import ProjectCard from "../projects/ProjectCard";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {
  items: TProject[];
  backgroundColor: string;
  category: string;
  display?: any;
}

const Carousel = ({
  items,
  backgroundColor,
  category,
  display = "flex",
}: Props) => {
  const slideRight = () => {
    const element = document.getElementById(category + "carousel");
    if (element) {
      element.scrollLeft = element.scrollLeft - 390;
    }
  };

  const slideLeft = () => {
    const element = document.getElementById(category + "carousel");
    if (element) {
      element.scrollLeft = element.scrollLeft + 390;
    }
  };

  return (
    <Box
      display={display}
      alignItems="center"
      bgcolor={backgroundColor}
      position="relative"
      justifyContent="center"
      margin="auto"
    >
      <Stack padding="45px 0px">
        <Box paddingLeft={{ xs: "20px", lg: "60px" }}>
          <Typography variant="h5">{category}</Typography>
        </Box>

        <Box display="flex" alignItems="center">
          <Box
            position={{ xs: "absolute", lg: "relative" }}
            zIndex={10}
            left={{ xs: "0px", lg: "0px" }}
          >
            <IconButton onClick={slideRight}>
              <ArrowBackIosIcon />
            </IconButton>
          </Box>
          <Box
            id={category + "carousel"}
            display="flex"
            gap="70px"
            width={{ xs: "360px", md: "750px", lg: "1140px", xl: "1530px" }}
            padding="20px 20px 30px 20px"
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
                  typeof project.thumbnail != "undefined"
                    ? project.thumbnail
                    : ""
                }
                teamname={project.teamname ? project.teamname : "teamname"}
                category={project.category.value}
                likes={project.likes}
                badges={project.badges ? project.badges.value : "default"}
                projectID={project._id}
                key={project._id}
              ></ProjectCard>
            ))}
          </Box>
          <Box
            position={{ xs: "absolute", lg: "relative" }}
            zIndex={10}
            right={{ xs: "0px", lg: "0px" }}
          >
            <IconButton onClick={slideLeft}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Carousel;
