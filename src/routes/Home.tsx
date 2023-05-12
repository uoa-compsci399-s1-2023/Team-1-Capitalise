import { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { TCategory } from "../model/TCategory";
import { TProject } from "../model/TProject";
import { getHomeCategories } from "../api/getHomeCategories";
import { getProjectsCategory } from "../api/getProjectsCategory";
import Hero from "../components/home/Hero";
import Carousel from "../components/home/Carousel";
import { getAwardShowcase } from "../api/getAwardShowcase";
import ShowcaseCarousel from "../components/home/ShowcaseCarousel";
import { getProjects } from "../api/getProjects";

function Home() {
  const theme = useTheme();
  const [catergories, setCategories] = useState<TCategory[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [awardShowcase, setAwardShowcase] = useState<TProject[]>([]);
  const carouselColours = [theme.customColors.bgGrey, "white"];

  useEffect(() => {
    const fetchCategories = async () => {
      const respData = await getHomeCategories();
      if (respData) {
        setCategories(respData);
      }
    };
    const fetchAwardShowcase = async () => {
      const respData = await getProjects();
      if (respData) {
        setAwardShowcase(respData);
      }
    };
    fetchCategories();
    fetchAwardShowcase();
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
      <Hero />
      <ShowcaseCarousel
        items={awardShowcase}
        backgroundColor={"white"}
        //title={awardShowcase[0].semester.value Capstone Winners}
        title={"S1 2023 Capstone Winners"}
        display={{ xs: "none", md: "flex" }}
      />
      <Carousel
        items={awardShowcase}
        backgroundColor={"white"}
        //title={awardShowcase[0].semester.value Capstone Winners}
        category={"S1 2023 Capstone Winners"}
        display={{ xs: "flex", md: "none" }}
      />

      {projects.map((project, i) => (
        <Carousel
          items={project.value}
          backgroundColor={
            carouselColours[i % carouselColours.length] as string
          }
          category={project.category}
          key={i}
        />
      ))}
    </Box>
  );
}

export default Home;
