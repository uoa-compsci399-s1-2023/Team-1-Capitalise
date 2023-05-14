import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { List, ListItem, ListItemText } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useAuth } from "../../customHooks/useAuth";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  TableContainer,
} from "@mui/material";

import { DateRange, EmojiEvents } from "@mui/icons-material";
import CategoryIcon from "@mui/icons-material/Category";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { getCategories } from "../../api/getCategories";
import { TCategory } from "../../model/TCategory";

import { getSemesters } from "../../api/getSemesters";
import { TSemester } from "../../model/TSemester";

import { getAwards } from "../../api/getAwards";
import { TAward } from "../../model/TAward";

import { Button, Stack } from "@mui/material";
import MyTabs from "../../components/MyTabs";

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  const auth = useAuth();

  // counts displayed in paper components of overview page.
  const [categoryCount, setCategoryCount] = useState(0);
  const [semesterCount, setSemesterCount] = useState(0);
  const [awardCount, setAwardCount] = useState(0);

  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<TCategory[]>([]);

  const [newSemester, setNewSemester] = useState("");
  const [semesters, setSemesters] = useState<TSemester[]>([]);

  const handleNewCategory = (event: any) => {
    setNewCategory(event.target.value);
  };

  const handleNewSemester = (event: any) => {
    setNewSemester(event.target.value);
  };

  const handleAddCategory = async () => {
    // call the API to  add category
    console.log(newCategory);
    const token = auth.getToken();
    if (token) {
      const category = {} as TCategory;

      console.log("we can access the endpoint");
      // replace with call to add parameter endpoint in api folder.
      //fetch(`${API_URL}/api/projects/comment`, {
      //  method: "POST",
      //  headers: {
      //    Accept: "application/json",
      //    "Content-Type": "application/json",
      //    "x-auth-token": token,
      //  },
      //  body: JSON.stringify({
      //    projectId: projectId,
      //    commentBody: text,
      //  }),
      //})
      // update the categories (need to create a TCategory object based on response using the interface)
      //.then((data) => {
      //category._id = data._id;
      //category.value = data.value;
      //category.parameterType = data.parameterType;

      //setCategories([categories, ...category]);
      //});
    }

    // increment the category count to reflect addition
    setCategoryCount(categoryCount + 1);

    // reset input field
    setNewCategory("");
  };

  const handleDeleteCategory = async (categoryId: string) => {
    // call the API to  delete category
    const token = auth.getToken();
    if (token) {
      // replace with call to delete parameter endpoint in api folder.
      //fetch(`${API_URL}/api/projects/comment/${commentId}`, {
      //  method: "DELETE",
      //  headers: {
      //    "x-auth-token": token,
      //  },

      //}).then(() => {
      // we need to update the categories.
      //const updatedCategories = categories.filter(
      //  (category) => category._id != categoryId
      //);
      //setCategories(updatedCategories);
      //});

      // decrement the category count to reflect deletion.
      setCategoryCount(categoryCount - 1);

      console.log("Delete category:", categoryId);
    }
  };

  const handleAddSemester = async () => {
    // call the API to  add semester
    console.log(newSemester);
    const token = auth.getToken();
    if (token) {
      const semester = {} as TSemester;

      console.log("we can access the endpoint");
      // replace with call to add parameter endpoint in api folder.
      //fetch(`${API_URL}/api/projects/comment`, {
      //  method: "POST",
      //  headers: {
      //    Accept: "application/json",
      //    "Content-Type": "application/json",
      //    "x-auth-token": token,
      //  },
      //  body: JSON.stringify({
      //    projectId: projectId,
      //    commentBody: text,
      //  }),
      //})
      // update the categories (need to create a TCategory object based on response using the interface)
      //.then((data) => {
      //category._id = data._id;
      //category.value = data.value;
      //category.parameterType = data.parameterType;

      //setCategories([categories, ...category]);
      //});
    }

    // increment the semester count to reflect addition
    setSemesterCount(semesterCount + 1);

    // reset input field
    setNewSemester("");
  };

  const handleDeleteSemester = async (semesterId: string) => {
    // call the API to  delete category
    const token = auth.getToken();
    if (token) {
      // replace with call to delete parameter endpoint in api folder.
      //fetch(`${API_URL}/api/projects/comment/${commentId}`, {
      //  method: "DELETE",
      //  headers: {
      //    "x-auth-token": token,
      //  },

      //}).then(() => {
      // we need to update the categories.
      //const updatedCategories = categories.filter(
      //  (category) => category._id != categoryId
      //);
      //setCategories(updatedCategories);
      //});

      // decrement the category count to reflect deletion.
      setSemesterCount(semesterCount - 1);

      console.log("Delete semester:", semesterId);
    }
  };

  useEffect(() => {
    const fetchCategories = getCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  useEffect(() => {
    const fetchSemesters = getSemesters().then((data) => {
      setSemesters(data);
    });
  }, []);

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
                    <EmojiEventsIcon
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
        <Stack height="100%">
          <Box height="100%" padding="0px 24px 10px 24px">
            <Typography paddingTop={3} variant="h6">
              Manage categories
            </Typography>
            <Box paddingTop={3} sx={{ overflow: "auto" }}>
              <TableContainer style={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "30%" }}>Categories</TableCell>
                      <TableCell style={{ width: "70%" }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>{category.value}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteCategory(category._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Typography paddingTop={13} variant="h6">
              Add category
            </Typography>
            <TextField
              label="New category"
              value={newCategory}
              onChange={handleNewCategory}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCategory}
            >
              Add Category
            </Button>
          </Box>
        </Stack>
      ),
    },
    {
      label: "Semesters",
      index: "3",
      Component: (
        <Box height="100%" padding="0px 24px 10px 24px">
          <Typography paddingTop={3} variant="h6">
            Manage semesters
          </Typography>
          <Box paddingTop={3} sx={{ overflow: "auto" }}>
            <TableContainer style={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "30%" }}>Semesters</TableCell>
                    <TableCell style={{ width: "70%" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {semesters.map((semester) => (
                    <TableRow key={semester._id}>
                      <TableCell>{semester.value}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteSemester(semester._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Typography paddingTop={5} variant="h6">
            Add semester
          </Typography>
          <TextField
            label="New semester"
            value={newSemester}
            onChange={handleNewSemester}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSemester}
          >
            Add Semester
          </Button>
        </Box>
      ),
    },
    {
      label: "Awards",
      index: "4",
      Component: (
        <Box height="100%" padding="0px 24px 10px 24px">
          <Typography variant="h6">Manage awards</Typography>
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
