import React, { useState, useEffect } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@mui/material";
import { Box } from "@mui/material";
import { Home, Projects, About, Registration, Login } from "./routes";
import customTheme1 from "./themes/custom1";

// Apis
import { TProject } from "./api/getProjects";
import { getProjectsSearch } from "./api/getSearchProjects";

// Other
import {
  searchFilterParams,
  TAvailParameters,
} from "./components/search/AvailableParams";
import ProjectPage from "./components/projectPage/ProjectPage";
import Navbar from "./components/Navbar";

import { TUser, mockUser } from "./model/TUser";
import { AuthProvider } from "./customHooks/useAuth";

// Project page
import Project from "./routes/Project";

// Represents curr state of filters
export type TFiltersState = {
  keywords: string;
  category: TAvailParameters["category"][0];
  semester: TAvailParameters["semester"][0];
  award: TAvailParameters["award"][0];
  sortBy: TAvailParameters["sortBy"][0];
  // These two are for pagination
  currPage: number;
  projectsPerPage: number;
};

// Represents current projectId
export type TProjectState = {
  projectId: string;
};

export default function App() {
  const [projects, setProjects] = useState<TProject[]>([]);
  const [totalNumProjects, setTotalNumProjects] = useState(0);
  const [currFilters, setFilters] = useState<TFiltersState>({
    keywords: "",
    category: searchFilterParams.category[0],
    semester: searchFilterParams.semester[0],
    award: searchFilterParams.award[0],
    sortBy: searchFilterParams.sortBy[0],
    currPage: 1,
    projectsPerPage: 6,
  });

  // Fetch required number of projects based on given parameters
  useEffect(() => {
    const fetchProjects = async () => {
      const respData = await getProjectsSearch({ ...currFilters });
      setTotalNumProjects(respData.searchTotal);
      setProjects(respData.projects);
    };
    fetchProjects();
  }, [currFilters]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={customTheme1}>
          <Navbar {...{ currFilters, setFilters }} />
          <Box mt="8vh" bgcolor={customTheme1.customColors.bgGrey}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/projects/*"
                element={
                  <Projects
                    {...{ currFilters, setFilters, totalNumProjects, projects }}
                  />
                }
              />
              <Route path="/projectpage" element={<ProjectPage />} />
              <Route path="/About" element={<About />} />
              <Route path="/project/:projectId" element={<Project />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Register" element={<Registration />} />
            </Routes>
          </Box>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
