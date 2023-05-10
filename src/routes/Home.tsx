import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { getProjectsCategory } from "../api/getProjectsCategory";
import Carousel from "../components/Carousel";
import heroImage from "../assets/image-placeholderhomeplaceholder.png";
import CarouselMuiTest from "../components/CarouselMuiTest";
import { getCategories } from "../api/getCategories";
import { TCategory } from "../model/TCategory";

function Home() {
  const theme = useTheme();
  const [catergories, setCategories] = useState<TCategory[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const carouselColours = ["white", theme.customColors.bgGrey];

  useEffect(() => {
    const fetchCategories = async () => {
      const respData = await getCategories();
      if (respData) {
        setCategories(respData);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProjects = async (category: string) => {
      const respData = await getProjectsCategory(category);
      if (respData) {
        respData.shift();
        return respData;
      }
    };
    const fetchProjectsCategories = async () => {
      let projects: any[] = [];
      for (let category of catergories) {
        await fetchProjects(category.value).then((result) =>
          projects.push({ category: category.value, value: result })
        );
      }
      setProjects(projects);
    };
    fetchProjectsCategories();
  }, [catergories]);

  //responsivenes for muitest carousel
  /*
  const [numProjDisp, setNumProjDisp] = useState(
    Math.round((window.innerWidth - 140) / 370)
  );
  useEffect(() => {
    const handleResize = () => {
      let width = window.innerWidth;
      if (width < 1470 && width > 1150) {
        setNumProjDisp(3);
      } else if (width < 1150 && width > 830) {
        setNumProjDisp(2);
      } else if (width < 830) {
        setNumProjDisp(1);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  */

  return (
    <Box mt="8vh">
      <Box position="relative">
        <Box
          display="flex"
          width="100%"
          height="40vh"
          component="img"
          src={heroImage}
          alt="hero"
          alignSelf="center"
          sx={{ objectFit: "cover" }}
        ></Box>
        <Box position="absolute" zIndex={1} top={0} padding={10}>
          <Typography variant="h5" color="white">
            Explore the talent at UoA
          </Typography>
          <Typography variant="body1" color="white" paddingTop="50px">
            We are proud to showcase the exceptional skills of our students.
          </Typography>
        </Box>
        {projects.map((project, i) => (
          <Carousel
            items={project.value}
            backgroundColor={
              carouselColours[i % carouselColours.length] as string
            }
            category={project.category}
            key={i}
          ></Carousel>
        ))}
      </Box>
    </Box>
  );
}

export default Home;

/*
      <Carousel
        items={projects}
        backgroundColor={theme.customColors.bgGrey as string}
        category="Web development"
      />


      */
