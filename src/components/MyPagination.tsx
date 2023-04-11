import * as React from "react";
import { Box, Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Pagination as MuiPagination } from "@mui/material";
import ProjectsGrid from "../components/ProjectsGrid";

import { TProject, getProjects } from "../api/getProjects";

import ProjectCard from "../components/ProjectCard";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

const pageSize = 6; // set amount of projects to appear per page.

interface Project {
  _id: string;
  name: string;
  semester: string;
  repoLink: string;
  likes: number;
}

interface PaginationProps {
  onPageChange: (page: number) => void;
}

const MyPagination: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(6); // Number of items to display per page
  const [projects, setProjects] = useState<TProject[]>([]);

  useEffect(() => {
    // fetch total number of projects from call to the fetch API (would be able to work with another fetch api like search)
    // need to change it to the searchProjects API.
    const fetchProjects = async () => {
      try {
        const projects = await getProjects();
        setProjects(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // calculate the start and end index of the projects to display based on the current page and projectsPerPage
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;

  // slice the projects array to get the projects to display for the current page
  const projectsToDisplay = projects.slice(startIndex, endIndex);

  return (
    <div>
      {/* Render project data into the ProjectsGrid component */}
      <ProjectsGrid projects={projectsToDisplay} />
      <MuiPagination
        count={Math.ceil(projects.length / projectsPerPage)}
        page={currentPage}
        onChange={(_, page) => handlePageChange(page)}
        showFirstButton
        showLastButton
        color="primary"
      />
    </div>
  );
};

export default MyPagination;
