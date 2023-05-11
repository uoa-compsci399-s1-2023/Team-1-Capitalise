import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Components
import MyPagination from "../components/projects/MyPagination";

// Other
import { fetchCurrentParameters } from "../components/search/AvailableParams";
import { SearchContext } from "../app";

const Projects = () => {
  const theme = useTheme();
  const { currFilters, setFilters } = useContext(SearchContext);
  const [numProjDisp, setNumProjDisp] = useState(1);

  const handleResize = () => {
    let width = window.innerWidth;
    if (width > 2140) {
      setNumProjDisp(15);
    } else if (width < 2140 && width > 1770) {
      setNumProjDisp(12);
    } else if (width < 1770 && width > 1400) {
      setNumProjDisp(9);
    } else if (width < 1400) {
      setNumProjDisp(6);
    }
  };

  // Fetch available search parameters on initial render
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    fetchCurrentParameters();
    setFilters({
      ...currFilters,
      ["projectsPerPage"]: numProjDisp,
    });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setFilters({
      ...currFilters,
      ["projectsPerPage"]: numProjDisp,
    });
  }, [numProjDisp]);

  return (
    <Box bgcolor={theme.customColors.bgGrey} width="100%" minHeight="92vh">
      <MyPagination />
    </Box>
  );
};

export default Projects;
