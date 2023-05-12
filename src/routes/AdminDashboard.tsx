import {
  Box,
  Divider,
  Stack,
  Typography,
  useTheme,
  Paper,
  colors,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getUser } from "../api/getUser";
import { TUser } from "../model/TUser";
import { TProject } from "../model/TProject";
import { useEffect, useState } from "react";
import MyTabs from "../components/MyTabs";
import ProjectCard from "../components/projects/ProjectCard";
import { getProject } from "../api/getProject";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import MyButton from "../components/MyButton";
import { error } from "console";
import { Card, Container } from "@mui/material";
import { ClearAll, DateRange, EmojiEvents } from "@mui/icons-material";

const AdminDashboard = () => {
  // need to connect up all the admin functionality we want here
  // useEffect() can be used to load in all the stuff we might want to display.

  return (
    <Box flex={1} justifyContent={"center"}>
      <Typography variant="h1" paddingTop={10} paddingLeft={10}>
        Admin dashboard
      </Typography>
      <Divider />
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, 400px)"
        flexDirection="row"
        gap="50px"
        justifyContent={"center"}
        paddingTop={5}
        paddingLeft={21}
      >
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4">Categories</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ClearAll sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }} />
            <Typography variant="h4">10</Typography>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4">Semesters</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DateRange sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }} />
            <Typography variant="h4">10</Typography>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4">Awards</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EmojiEvents
              sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }}
            />
            <Typography variant="h4">10</Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
