import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";

import { DateRange, EmojiEvents } from "@mui/icons-material";
import CategoryIcon from "@mui/icons-material/Category";

import { getCategories } from "../../api/getCategories";
import { TCategory } from "../../model/TCategory";

import { getSemesters } from "../../api/getSemesters";
import { TSemester } from "../../model/TSemester";

import { getAwards } from "../../api/getAwards";
import { TAward } from "../../model/TAward";

import { Button, Stack } from "@mui/material";
import MyTabs from "../../components/MyTabs";

const Dashboard = () => {
  const [categoryCount, setCategoryCount] = useState(0);
  const [semesterCount, setSemesterCount] = useState(0);
  const [awardCount, setAwardCount] = useState(0);

  const [open, setOpen] = useState(false);

  const dashboardTabs = [
    {
      label: "Overview",
      index: "1",
      Component: (
        <Stack height="100%">
          <Box padding="15px 24px 10px 24px" minHeight="10%" width="100%">
            <Typography variant="h6">Summary</Typography>

            <Grid container spacing={3} paddingTop={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h4">Categories</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CategoryIcon
                      color="primary"
                      sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }}
                    />
                    <Typography variant="h4">{categoryCount}</Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h4">Semesters</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DateRange
                      color="primary"
                      sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }}
                    />
                    <Typography variant="h4">{semesterCount}</Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h4">Awards</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DateRange
                      color="primary"
                      sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }}
                    />
                    <Typography variant="h4">{awardCount}</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            <Typography paddingTop={10} variant="h6">
              {/* Show newly created projects over a timeframe (maybe for the week??) */}
              Recently created projects
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      label: "Categories",
      index: "2",
      Component: (
        <Box height="100%" padding="0px 24px 10px 24px">
          <Typography variant="h6">Category Info</Typography>
        </Box>
      ),
    },
    {
      label: "Semesters",
      index: "3",
      Component: (
        <Box height="100%" padding="0px 24px 10px 24px">
          <Typography variant="h6">Semester info</Typography>
        </Box>
      ),
    },
    {
      label: "Awards",
      index: "4",
      Component: (
        <Box height="100%" padding="0px 24px 10px 24px">
          <Typography variant="h6">Award info</Typography>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    // grab the categories from the API
    const fetchCategories = getCategories().then((data) => {
      setCategoryCount(data.length);
    });
  }, []);

  useEffect(() => {
    // grab the semesters from the API
    const fetchCategories = getSemesters().then((data) => {
      setSemesterCount(data.length);
    });
  }, []);

  useEffect(() => {
    // grab the semesters from the API
    const fetchAwards = getAwards().then((data) => {
      setAwardCount(data.length);
    });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent={{ xs: "start", md: "center" }}
      spacing={0}
      minHeight="92vh"
      margin="8vh 0vh auto"
      paddingTop="20px"
    >
      <Stack
        display="flex"
        direction="column"
        alignItems="start"
        width={{ xs: "100%", md: "305px" }}
        padding="24px"
      >
        <Box display={{ xs: "flex", md: "block" }} width="100%">
          {/* The Paper components overviewing number of categories, semesters and awards  */}
          <Box paddingLeft={{ xs: "24px", md: "0px" }}>
            <Typography variant="h1">Welcome Admin</Typography>
          </Box>
        </Box>
      </Stack>
      <Box height="inherit" width={{ xs: "100%", md: "1150px" }}>
        <MyTabs tabs={dashboardTabs} />
      </Box>
    </Stack>
  );
};

export default Dashboard;
