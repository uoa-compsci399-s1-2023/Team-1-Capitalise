import { useEffect } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Components
import MyPagination from "../components/MyPagination";

// Other
import { fetchCurrentParameters } from "../components/search/AvailableParams";
import { SearchProps } from "../components/MyPagination"


const Projects = (props: SearchProps) => {

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
