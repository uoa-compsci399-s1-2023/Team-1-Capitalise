import { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { getProjectsCategory } from "../api/getProjectsCategory";
import Carousel from "../components/Carousel";
import heroImage from "../assets/image-placeholderhomeplaceholder.png";
import CarouselMuiTest from "../components/CarouselMuiTest";
import { getCategories } from "../api/getCategories";
import { TCategory } from "../model/TCategory";
import { LineWeight } from "@mui/icons-material";
import { Link } from "react-router-dom";

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
        await fetchProjects(category.value).then((result) => {
          if (result) {
            if (result.length != 0) {
              projects.push({ category: category.value, value: result });
            }
          }
        });
      }
      setProjects(projects);
    };
    fetchProjectsCategories();
  }, [catergories]);

  //responsiveness for test carousel
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
          height={{ xs: "350px", md: "500px" }}
          component="img"
          src={heroImage}
          alt="hero"
          alignSelf="center"
          sx={{ objectFit: "cover" }}
        ></Box>
        <Box position="absolute" zIndex={1} top={0} padding={{ xs: 4, md: 10 }}>
          <Box width={{ xs: "100%", md: "70%" }}>
            <Typography variant="h1" color="white" fontWeight={8000}>
              Explore the talent at UoA
            </Typography>
            <Typography
              variant="h4"
              color="white"
              paddingTop="50px"
              fontWeight={200}
            >
              We are proud to showcase the exceptional skills of our students.
            </Typography>
          </Box>
          <Box paddingTop="25px">
            <Link to="../projects">
              <Button variant="contained">Explore Projects</Button>
            </Link>
          </Box>
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

      {/*
      {projects.map((project, i) => (
        <CarouselMuiTest
          category={project.category}
          items={project.value}
          numProjDisp={numProjDisp}
          bgcolor={carouselColours[i % carouselColours.length] as string}
          key={i}
        />
      ))}
      */}
    </Box>
  );
}

export default Home;
