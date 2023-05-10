import Carousel from "react-material-ui-carousel";
import { TProject } from "../model/TProject";
import ProjectCard from "./projects/ProjectCard";
import { Box, Typography } from "@mui/material";

interface Props {
  items: TProject[];
  numProjDisp: number;
}

const CarouselMuiTest = ({ items, numProjDisp }: Props) => {
  const sliderItems: number =
    items.length > numProjDisp ? numProjDisp : items.length;
  const cards: Array<any> = [];
  let remainder: Array<any> = [];
  for (let i = 0; i < items.length % sliderItems; i++) {
    remainder.push(<Box />);
  }

  for (let i = 0; i < items.length; i += sliderItems) {
    if (i % sliderItems === 0) {
      cards.push(
        <Box
          display="flex"
          justifyContent="space-between"
          padding="0px 70px 70px 70px"
          key={i}
        >
          {items.slice(i, i + sliderItems).map((project) => {
            return (
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
                badges={
                  typeof project.badges != "undefined"
                    ? project.badges.value
                    : ""
                }
                projectID={project._id}
                key={project._id}
              ></ProjectCard>
            );
          })}
        </Box>
      );
    }
  }

  console.log(cards);

  return (
    <Box bgcolor="white">
      <Box padding="70px 0px 0px 70px">
        <Typography variant="h5">hihihi</Typography>
      </Box>
      <Carousel animation="slide">{cards}</Carousel>
    </Box>
  );
};

export default CarouselMuiTest;
