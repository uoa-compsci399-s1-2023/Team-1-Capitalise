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
import Dashboard from "../components/adminDashboard/Dashboard";

const AdminDashboard = () => {
  // need to connect up all the admin functionality we want here
  // useEffect() can be used to load in all the stuff we might want to display.

  return <Dashboard />;
};

export default AdminDashboard;
