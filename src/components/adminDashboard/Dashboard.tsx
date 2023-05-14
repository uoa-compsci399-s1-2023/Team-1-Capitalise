import * as React from "react";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  TableContainer,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stack,
} from "@mui/material";

import { DateRange, Category, EmojiEvents } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useAuth } from "../../customHooks/useAuth";

import { getCategories } from "../../api/getCategories";
import { TCategory } from "../../model/TCategory";

import { getSemesters } from "../../api/getSemesters";
import { TSemester } from "../../model/TSemester";

import { getAwards } from "../../api/getAwards";
import { TAward } from "../../model/TAward";

import MyTabs from "../../components/MyTabs";

import { addParameter } from "../../api/addParameter";

const Dashboard = () => {
  const [open, setOpen] = useState(false);

  const auth = useAuth();

  // counts displayed in paper components of overview page.
  const [categoryCount, setCategoryCount] = useState(0);
  const [semesterCount, setSemesterCount] = useState(0);
  const [awardCount, setAwardCount] = useState(0);

  const [categories, setCategories] = useState<TCategory[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const [semesters, setSemesters] = useState<TSemester[]>([]);
  const [newSemester, setNewSemester] = useState("");

  const [awards, setAwards] = useState<TAward[]>([]);
  const [newAward, setNewAward] = useState("");

  const handleNewCategory = (event: any) => {
    setNewCategory(event.target.value);
  };

  const handleNewSemester = (event: any) => {
    setNewSemester(event.target.value);
  };

  const handleNewAward = (event: any) => {
    setNewAward(event.target.value);
  };

  const handleAddCategory = async () => {
    // call the API to  add category
    console.log(newCategory);
    const token = auth.getToken();
    if (token) {
      const category = {} as TCategory;

      console.log("Adding the category:", newCategory);

      addParameter(newCategory, "category", token)
        // update the categories (need to create a TCategory object based on response using the interface)
        .then((data) => {
          category._id = data._id;
          category.value = data.value;
          category.parameterType = data.parameterType;

          setCategories([...categories, category]);
        });
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
      if (window.confirm("Are you sure you want to delete this category?")) {
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
    }
  };

  const handleAddSemester = async () => {
    // call the API to add semester
    console.log(newSemester);
    const token = auth.getToken();
    if (token) {
      const semester = {} as TSemester;

      console.log("Adding the semester:", newSemester);

      addParameter(newSemester, "semester", token).then((data) => {
        semester._id = data._id;
        semester.value = data.value;
        semester.parameterType = data.parameterType;

        setSemesters([...semesters, semester]);
      });
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
      if (window.confirm("Are you sure you want to delete this semester?")) {
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
    }
  };

  const handleAddAward = async () => {
    // call the API to  add award
    console.log(newAward);
    const token = auth.getToken();
    if (token) {
      const award = {} as TAward;

      console.log("Adding the award:", newAward);

      addParameter(newAward, "award", token)
        // update the awards (need to create a TAward object based on response using the interface)
        .then((data) => {
          award._id = data._id;
          award.value = data.value;
          award.parameterType = data.parameterType;

          setAwards([...awards, award]);
        });
    }

    // increment the award count to reflect addition
    setCategoryCount(awardCount + 1);

    // reset input field
    setNewAward("");
  };

  const handleDeleteAward = async (awardId: string) => {
    // call the API to  delete award
    const token = auth.getToken();
    if (token) {
      if (window.confirm("Are you sure you want to delete this award?")) {
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
        setAwardCount(awardCount - 1);

        console.log("Delete award:", awardId);
      }
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

  useEffect(() => {
    const fetchAwards = getAwards().then((data) => {
      setAwards(data);
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
                    <Category
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
                    <EmojiEvents
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
            <Typography paddingTop={5} variant="h6">
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
          <Typography paddingTop={3} variant="h6">
            Manage awards
          </Typography>
          <Box paddingTop={3} sx={{ overflow: "auto" }}>
            <TableContainer style={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "30%" }}>Awards</TableCell>
                    <TableCell style={{ width: "70%" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {awards.map((award) => (
                    <TableRow key={award._id}>
                      <TableCell>{award.value}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteAward(award._id)}
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
            Add award
          </Typography>
          <TextField
            label="New award"
            value={newAward}
            onChange={handleNewAward}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSemester}
          >
            Add Award
          </Button>
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
