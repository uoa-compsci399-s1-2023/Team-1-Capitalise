import * as React from "react";
import { Box, Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import service from "../services/paginationService";
import Pagination from "@mui/material/Pagination";

import { TProject } from "../api/getProjects";

interface props {
  projects: TProject[];
}

const pageSize = 6; // set amount of projects to appear per page.

export default function MyPagination({ projects }: props) {
  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });

  const service = {
    getData: ({ from, to }: { from: number; to: number }) => {
      return new Promise((resolve, reject) => {
        const data = projects.slice(from, to); // slice the project array

        resolve({
          count: projects.length,
          data: data,
        });
      });
    },
  };

  useEffect(() => {
    service
      .getData({ from: pagination.from, to: pagination.to })
      .then((response: any) => {
        setPagination({ ...pagination, count: response.count });
        projects = response.data;
        console.log(projects);
      });
  }, [pagination.from, pagination.to]);

  const handlePageChange = (event: any, page: any) => {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;

    setPagination({ ...pagination, from: from, to: to });
  };

  return (
    <Box
      justifyContent={"center"}
      alignItems="center"
      display={"flex"}
      sx={{
        margin: "20px 0px",
      }}
    >
      <Pagination
        count={Math.ceil(pagination.count / pageSize)}
        color="primary"
        onChange={handlePageChange}
      />
    </Box>
  );
}
