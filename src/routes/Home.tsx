import { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { getProjectsCategory } from "../api/getProjectsCategory";
import Carousel from "../components/Carousel";
import heroImage from "../assets/image-placeholderhomeplaceholder.png";
import { TCategory } from "../model/TCategory";
import { Link } from "react-router-dom";
import { getHomeCategories } from "../api/getHomeCategories";

function Home() {
  const theme = useTheme();
  const [catergories, setCategories] = useState<TCategory[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const carouselColours = ["white", theme.customColors.bgGrey];

  useEffect(() => {
    const fetchCategories = async () => {
      const respData = await getHomeCategories();
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
        await fetchProjects(category.category.value).then((result) => {
          if (result) {
            if (result.length != 0) {
              projects.push({
                category: category.category.value,
                value: result,
              });
            }
          }
        });
      }
      setProjects(projects);
    };
    fetchProjectsCategories();
  }, [catergories]);

  return (
    <Box mt="8vh">
      <Box position="relative">
        <Box
          display="flex"
          width="100%"
          height={{ xs: "350px", lg: "400px", xl: "500px" }}
          component="img"
          src={heroImage}
          alt="hero"
          alignSelf="center"
          sx={{ objectFit: "cover" }}
        ></Box>
        <Box position="absolute" zIndex={1} top={0} padding={{ xs: 4, lg: 10 }}>
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
    </Box>
  );
}

export default Home;
