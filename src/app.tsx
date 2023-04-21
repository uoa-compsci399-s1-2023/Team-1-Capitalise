import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@mui/material";
import { Box } from "@mui/material";
import { Home, Projects, About } from "./routes";
import customTheme1 from "./themes/custom1";

// Apis
import { TProject } from "./api/getProjects";
import { getProjectsSearch } from "./api/getSearchProjects";

// Other
import { searchFilterParams, TAvailParameters } from "./components/search/AvailableParams";
import ProjectPage from './components/projectPage/ProjectPage';
import Navbar from "./components/Navbar";
import { TUser } from './model/TUser';
import { AuthProvider } from "./customHooks/useAuth";


// Represents curr state of filters
export type TFiltersState = {
  keywords: string,
  category: TAvailParameters['category'][0],
  semester: TAvailParameters['semester'][0],
  award: TAvailParameters['award'][0],
  sortBy: TAvailParameters['sortBy'][0],
  // These two are for pagination
  currPage: number,
  projectsPerPage: number,
}

export default function App() {


  const [currFilters, setFilters] = useState<TFiltersState>({
    keywords: '',
    category: searchFilterParams.category[0],
    semester: searchFilterParams.semester[0],
    award: searchFilterParams.award[0],
    sortBy: searchFilterParams.sortBy[0],
    currPage: 1,
    projectsPerPage: 6
  })


  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={customTheme1}>
          <Navbar {...{ currFilters, setFilters }} />
          <Box mt="8vh" bgcolor={customTheme1.customColors.bgGrey} >
            <Routes >
              <Route path="/" element={<Home />} />
              <Route path="/projects/*" element={
                <Projects
                  {...{ currFilters, setFilters }}
                />
              } />
              <Route path="/projectpage" element={<ProjectPage projectId="6442068f7297a06fc1659115"/>} />
              <Route path="/About" element={<About />} />
            </Routes>
          </Box>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
