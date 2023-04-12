import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Components
import Navbar from "../components/Navbar";
import MyPagination from "../components/MyPagination";

// Other
import { fetchCurrentParameters } from "../components/search/AvailableParams";
import { SearchFilterProps } from "../components/search/DesktopSearchFilters";
import { TProject } from "../api/getProjects";


interface TProjectsRouteProps extends SearchFilterProps {
  projects: TProject[]
  totalNumProjects: number
}


const Projects = (props: TProjectsRouteProps) => {

  const theme = useTheme();

  // Fetch available search parameters on initial render
  useEffect(() => {
    fetchCurrentParameters();
  }, [])

  return (
    <Box bgcolor={theme.customColors.bgGrey} width="100%" minHeight="92vh">

      <MyPagination
        {...props}
      />
    </Box>
  );
};

export default Projects;
