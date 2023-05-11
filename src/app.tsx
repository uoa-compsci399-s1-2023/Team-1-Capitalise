import React, {
  useState,
  useEffect,
  createContext,
  SetStateAction,
} from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@mui/material";
import { Box } from "@mui/material";
import { Home, Projects, About, Login, Registration } from "./routes";
import customTheme1 from "./themes/custom1";

// Other
import {
  searchFilterParams,
  TAvailParameters,
} from "./components/search/AvailableParams";
import ProjectPage from "./routes/ProjectPage";
import Navbar from "./components/Navbar";
import UserProfile from "./routes/UserProfile";
import { AuthProvider } from "./customHooks/useAuth";
import GoogleSuccessRedirect from "./routes/googleSuccessRedirect";
import GoogleFailure from "./routes/googleFailure";

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

interface TSearchContext {
  currFilters: TFiltersState;
  setFilters: React.Dispatch<SetStateAction<TFiltersState>>;
}

export const SearchContext = createContext<TSearchContext>(
  {} as TSearchContext
);

export function getDefaultFilters(): TFiltersState {
  return {
    keywords: "",
    category: searchFilterParams.category[0],
    semester: searchFilterParams.semester[0],
    award: searchFilterParams.award[0],
    sortBy: searchFilterParams.sortBy[0],
    currPage: 1,
    projectsPerPage: 6,
  };
}

export default function App() {
  // Represents curr state of filters
  const [currFilters, setFilters] = useState<TFiltersState>(
    getDefaultFilters()
  );

  return (
    <BrowserRouter>
      <AuthProvider>
        <SearchContext.Provider value={{ currFilters, setFilters }}>
          <ThemeProvider theme={customTheme1}>
            <Navbar />
            <Box mt="8vh" bgcolor={customTheme1.customColors.bgGrey}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:projectId" element={<ProjectPage />} />
                <Route path="/About" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user/:userID" element={<UserProfile />} />
                <Route path="/Register" element={<Registration />} />
                <Route
                  path="/googleSuccessRedirect"
                  element={<GoogleSuccessRedirect />}
                />
                <Route path="/googleFailure" element={<GoogleFailure />} />
              </Routes>
            </Box>
          </ThemeProvider>
        </SearchContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}
