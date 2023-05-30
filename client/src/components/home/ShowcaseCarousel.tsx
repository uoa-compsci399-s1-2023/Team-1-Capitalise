import { Box, IconButton, Stack, Typography } from "@mui/material";
import { TProject } from "../../model/TProject";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ShowcaseProjectCard from "./ShowcaseProjectCard";

interface Props {
  items: TProject[];
  backgroundColor: string;
  title: string;
  display: any;
}
const ShowcaseCarousel = ({
  items,
  backgroundColor,
  title,
  display,
}: Props) => {
  const slideRight = () => {
    const element = document.getElementById(title + "show");
    if (element) {
      element.scrollLeft = element.scrollLeft - 600;
    }
  };

  const slideLeft = () => {
    const element = document.getElementById(title + "show");
    if (element) {
      element.scrollLeft = element.scrollLeft + 600;
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
      <Stack padding="90px 0px">
        <Box display="flex" justifyContent="center">
          <Typography
            variant="body1"
            fontSize={{ xs: "20pt", md: "24pt", lg: "30pt" }}
            fontWeight={500}
            noWrap
          >
            {title}
          </Typography>
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
            id={title + "show"}
            display="flex"
            gap="100px"
            width={{ xs: "540px", lg: "1140px", xl: "1740px" }}
            padding="100px 20px 100px 20px"
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
              <ShowcaseProjectCard
                title={project.name}
                semester={project.semester.value}
                image={
                  typeof project.thumbnail != "undefined"
                    ? project.thumbnail
                    : ""
                }
                teamname={project.teamname ? project.teamname : "‎"}
                category={project.category.value}
                likes={project.likes}
                badges={project.badges ? project.badges.value : "default"}
                projectID={project._id}
                key={project._id}
              ></ShowcaseProjectCard>
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

export default ShowcaseCarousel;
