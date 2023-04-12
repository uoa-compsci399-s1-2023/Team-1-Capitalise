import { useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";


// Components
import Navbar from "../components/Navbar";
import MyPagination from "../components/MyPagination";

// Apis
import { TProject } from "../api/getProjects";
import { getProjectsSearch } from "../api/getSearchProjects";

// Other
import { searchFilterParams, TAvailParameters, fetchCurrentParameters } from "../components/search/AvailableParams";



// Represents curr state of filters
export type TFiltersState = {
  keywords: string,
  category: TAvailParameters['category'][0],
  semester: TAvailParameters['semester'][0],
  award: TAvailParameters['award'][0],
  sortBy: TAvailParameters['sortBy'][0],
  currPage: number,
  projectsPerPage: number
}

const Projects = () => {

  const theme = useTheme();

  const [projects, setProjects] = useState<TProject[]>([]);
  const [searchFilters, setSearchFilters] = useState<TFiltersState>({
    keywords: '',
    category: searchFilterParams.category[0],
    semester: searchFilterParams.semester[0],
    award: searchFilterParams.award[0],
    sortBy: searchFilterParams.sortBy[0],
    currPage: 1,
    projectsPerPage: 6
  })

  // Fetch available search parameters on initial render
  useEffect(() => {
    fetchCurrentParameters();
  }, [])

  useEffect(() => {
    // fetch total number of projects from call to the fetch API (would be able to work with another fetch api like search)
    // need to change it to the searchProjects API.
    const fetchProjects = async () => {
      try {
        const projects = await getProjectsSearch({ ...searchFilters });
        setProjects(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, [searchFilters]);


  // const [currentPage, setCurrentPage] = useState(1);
  // const [projectsPerPage] = useState(6); // Number of items to display per page


  return (
    <Box bgcolor={theme.customColors.bgGrey} width="100%">
      <Navbar
        currFilters={searchFilters}
        setFilters={setSearchFilters}
      />
      <MyPagination
        currFilters={searchFilters}
        setFilters={setSearchFilters}
        projectsToDisplay={projects}
      />
    </Box>
  );
};

export default Projects;
