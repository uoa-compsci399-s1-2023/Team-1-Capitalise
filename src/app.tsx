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
import AdminDashboard from "./routes/AdminDashboard";
import GoogleSuccessRedirect from "./routes/googleSuccessRedirect";
import GoogleFailure from "./routes/googleFailure";
import Upload from "./routes/Upload";
import { getAwardTypes } from "./api/getAwardTypes";
import { TAward } from "./model/TAward";
import ResetPassword from "./routes/ResetPassword";
import ChangePassword from "./routes/ChangePassword";
import Error from "./components/Error";

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
  getDefaultFilters: () => TFiltersState;
}

export const SearchContext = createContext<TSearchContext>(
  {} as TSearchContext
);

const initialProjectsPerPage = () => {
  let width = window.innerWidth;
  if (width >= 2510) {
    return 18;
  } else if (width < 2510 && width >= 2140) {
    return 15;
  } else if (width < 2140 && width >= 1770) {
    return 12;
  } else if (width < 1770 && width >= 1400) {
    return 9;
  } else if (width < 1400) {
    return 6;
  } else return 6;
};

export function getDefaultFilters(): TFiltersState {
  return {
    keywords: "",
    category: searchFilterParams.category[0],
    semester: searchFilterParams.semester[0],
    award: searchFilterParams.award[0],
    sortBy: searchFilterParams.sortBy[0],
    currPage: 1,
    projectsPerPage: initialProjectsPerPage(),
  };
}

export const AwardTypeContext = createContext([] as TAward[]);

export default function App() {
  // Represents curr state of filters
  const [currFilters, setFilters] = useState<TFiltersState>(
    getDefaultFilters()
  );

  const [awardTypes, setAwardTypes] = useState<TAward[]>([]);

  useEffect(() => {
    const fetchAwardTypes = async () => {
      const respData = await getAwardTypes();
      if (respData.length !== 0) {
        setAwardTypes(respData);
      }
    };
    fetchAwardTypes();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AwardTypeContext.Provider value={awardTypes}>
          <SearchContext.Provider
            value={{ currFilters, setFilters, getDefaultFilters }}
          >
            <ThemeProvider theme={customTheme1}>
              <Navbar />
              <Box mt="8vh" bgcolor={customTheme1.customColors.bgGrey}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route
                    path="/projects/:projectId"
                    element={<ProjectPage />}
                  />
                  <Route path="/About" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/user/:userID" element={<UserProfile />} />
                  <Route path="/Register" element={<Registration />} />
                  <Route path="/ResetPassword" element={<ResetPassword />} />
                  <Route path="/ChangePassword" element={<ChangePassword />} />
                  <Route
                    path="/googleSuccessRedirect"
                    element={<GoogleSuccessRedirect />}
                  />
                  <Route path="/googleFailure" element={<GoogleFailure />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/adminDashboard" element={<AdminDashboard />} />
                  <Route
                    path="/encapsulate"
                    Component={() => {
                      window.location.href = "https://compsci399.com";
                      return null;
                    }}
                  />
                  <Route path="*" element={<Error />} />
                </Routes>
              </Box>
            </ThemeProvider>
          </SearchContext.Provider>
        </AwardTypeContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}
