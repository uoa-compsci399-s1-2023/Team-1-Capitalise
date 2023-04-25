import { useEffect } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Components
import MyPagination from "../components/projects/MyPagination";

// Other
import { fetchCurrentParameters } from "../components/search/AvailableParams";



const Projects = () => {

  const theme = useTheme();

  // Fetch available search parameters on initial render
  useEffect(() => {
    fetchCurrentParameters();
  }, [])

  return (
    <Box bgcolor={theme.customColors.bgGrey} width="100%" minHeight="92vh">
      <MyPagination />
    </Box>
  );
};

export default Projects;
