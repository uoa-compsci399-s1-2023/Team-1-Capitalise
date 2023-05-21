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
  Button,
  Stack,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useAuth } from "../../customHooks/useAuth";
import { ChromePicker, ColorResult } from "react-color";

import { getCategories } from "../../api/getCategories";
import { TCategory } from "../../model/TCategory";

import { getSemesters } from "../../api/getSemesters";
import { TSemester } from "../../model/TSemester";

import { getAwards } from "../../api/getAwards";
import { TAward } from "../../model/TAward";

import MyTabs from "../../components/MyTabs";

import { addParameter } from "../../api/addParameter";
import { addAward, uploadAwardImage } from "../../api/addAward";

import { deleteParameter } from "../../api/deleteParameter";
import { deleteAwardImage } from "../../api/deleteAwardImage";
import DashboardOverview from "./DashboardOverview";
import { getHeroBanners, getMobileHeroBanners } from "../../api/getHeroBanners";
import DashboardHeroBanners from "./DashboardHeroBanners";
import DashboardMobileHeroBanners from "./DashboardMobileHeroBanners";

const Dashboard = () => {
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
  const [newAwardImage, setNewAwardImage] = useState<File | undefined>();
  const [awardImageString, setAwardImageString] = useState("");

  // check if image has been added
  const [imageAdded, setImageAdded] = useState(false);

  const [validImage, setValidImage] = useState(true);

  // set gradient colours
  const [colour1, setColour1] = useState("#FFFFFF");
  const [colour2, setColour2] = useState("#FFFFFF");

  const [heroBanners, setHeroBanners] = useState<string[]>([]);
  const [mobileHeroBanners, setMobileHeroBanners] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

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
    // call the API to delete category
    const token = auth.getToken();
    if (token) {
      if (
        window.confirm(
          "This will permanently delete this category, are you sure?"
        )
      ) {
        deleteParameter(categoryId, token).then(() => {
          // we need to update the categories.
          const updatedCategories = categories.filter(
            (category) => category._id != categoryId
          );
          setCategories(updatedCategories);
        });

        // decrement the category count to reflect deletion.
        setCategoryCount(categoryCount - 1);
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
      if (
        window.confirm(
          "This will permanently delete this semester and the associated projects, are you sure?"
        )
      ) {
        deleteParameter(semesterId, token).then(() => {
          // we need to update the semesters.
          const updatedSemesters = semesters.filter(
            (semester) => semester._id != semesterId
          );
          setSemesters(updatedSemesters);
        });

        // decrement the category count to reflect deletion.
        setSemesterCount(semesterCount - 1);
      }
    }
  };

  const constHandleImage = async (file: File) => {
    if (!file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg)$/)) {
      setValidImage(false);
    } else {
      setValidImage(true);

      setNewAwardImage(file);
      //setAwardImageString(file.name);
    }
  };

  const handleColour1Change = (newColour: ColorResult) => {
    setColour1(newColour.hex);
  };

  const handleColour2Change = (newColour: ColorResult) => {
    setColour2(newColour.hex);
  };

  const handleNewAwardImage = async () => {
    if (typeof newAwardImage !== "undefined") {
      let formData = new FormData();
      formData.append("award", newAwardImage);
      setLoading(true);

      const response = await uploadAwardImage(formData);
      setLoading(false);
      setAwardImageString(response);
      setImageAdded(true);
    }
  };

  const handleAddAward = async () => {
    // call the API to  add award
    console.log(newAward);
    const token = auth.getToken();
    if (token) {
      const award = {} as TAward;

      console.log("Adding the award:", newAward);
      console.log("New award image:", awardImageString);
      console.log("New gradient:", [colour1, colour2]);
      const newGradient = [colour1, colour2];

      addAward(newAward, "award", token, awardImageString, newGradient)
        // update the awards (need to create a TAward object based on response using the interface)
        .then((data) => {
          award._id = data._id;
          award.value = data.value;
          award.parameterType = data.parameterType;
          award.image = data.image;
          award.gradient = data.gradient;

          setAwards([...awards, award]);
        });
    }

    // increment the award count to reflect addition
    setAwardCount(awardCount + 1);

    // reset input field
    setNewAward("");
    setImageAdded(false);
  };

  const handleDeleteAward = async (awardId: string, awardImage: string) => {
    // call the API to  delete award
    const token = auth.getToken();
    if (token) {
      if (
        window.confirm("This will permanently delete this award, are you sure?")
      ) {
        deleteParameter(awardId, token).then(() => {
          // we also need to delete the associated award image from s3 by grabbing the image name
          var last = awardImage.substring(
            awardImage.lastIndexOf("/") + 1,
            awardImage.length
          );
          deleteAwardImage(last);

          // we need to update the awards display.
          const updatedAwards = awards.filter((award) => award._id != awardId);
          setAwards(updatedAwards);
        });

        // decrement the category count to reflect deletion.
        setAwardCount(awardCount - 1);
      }
    }
  };

  const fetchHeroBanners = async () => {
    const respData = await getHeroBanners();
    if (respData) {
      setHeroBanners(respData);
    }
  };
  const fetchMobileHeroBanners = async () => {
    const respData = await getMobileHeroBanners();
    if (respData) {
      setMobileHeroBanners(respData);
    }
  };

  useEffect(() => {
    // grab the categories from the API
    getCategories().then((data) => {
      setCategories(data);
      setCategoryCount(data.length);
    });
    // grab the semesters from the API
    getSemesters().then((data) => {
      setSemesters(data);
      setSemesterCount(data.length);
    });
    // grab the awards from the API
    getAwards().then((data) => {
      setAwards(data);
      setAwardCount(data.length);
    });
    fetchHeroBanners();
    fetchMobileHeroBanners();
  }, []);

  const dashboardTabs = [
    {
      label: "Overview",
      index: "1",
      Component: (
        <DashboardOverview
          categoryCount={categoryCount}
          semesterCount={semesterCount}
          awardCount={awardCount}
        />
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
              <TableContainer style={{ maxHeight: 400, maxWidth: 800 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "50%" }}>Categories</TableCell>
                      <TableCell style={{ width: "50%" }}></TableCell>
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
            <Box
              width={{ xs: "300px", sm: "600px" }}
              component={"form"}
              display={"flex"}
              alignItems={"center"}
              gap={2}
            >
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
                disabled={newCategory.length === 0}
                color="primary"
                onClick={handleAddCategory}
              >
                Submit
              </Button>
            </Box>
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
            <TableContainer style={{ maxHeight: 400, maxWidth: 800 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "50%" }}>Semesters</TableCell>
                    <TableCell style={{ width: "50%" }}></TableCell>
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
          <Box
            width={{ xs: "300px", sm: "600px" }}
            component={"form"}
            display={"flex"}
            alignItems={"center"}
            gap={2}
          >
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
              disabled={newSemester.length === 0}
              color="primary"
              onClick={handleAddSemester}
            >
              Submit
            </Button>
          </Box>
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
            <TableContainer style={{ maxHeight: 400, maxWidth: 800 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "20%" }}>Awards</TableCell>
                    <TableCell style={{ width: "30%" }}></TableCell>
                    <TableCell style={{ width: "50%" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {awards.map((award) => (
                    <TableRow key={award._id}>
                      <TableCell>{award.value}</TableCell>
                      <TableCell>
                        <Box
                          display="flex"
                          width="50px"
                          height="50px"
                          component="img"
                          src={award.image}
                          alt="badge"
                          alignSelf="center"
                          sx={{
                            objectFit: "cover",
                            objectPosition: "bottom right",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() =>
                            handleDeleteAward(award._id, award.image)
                          }
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
            Create a new award
          </Typography>
          <Typography paddingTop={5} variant="body1">
            1) Add new award image
          </Typography>
          <Box
            width={{ xs: "300px", sm: "600px" }}
            component={"form"}
            display={"flex"}
            alignItems={"center"}
            gap={2}
          >
            <TextField
              label="New award image"
              variant="outlined"
              fullWidth
              margin="normal"
              type="file"
              InputLabelProps={{
                shrink: true,
              }}
              error={!validImage}
              helperText={!validImage ? "Select a valid image type" : ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.files) {
                  constHandleImage(event.target.files[0]);
                }
              }}
            />
            <Box alignSelf="flex-start" paddingTop="25px">
              <Button
                variant="contained"
                color="primary"
                onClick={handleNewAwardImage}
              >
                Submit
              </Button>
            </Box>
          </Box>
          <Typography paddingTop={5} variant="body1">
            2) Add new award name and pick a gradient
          </Typography>
          <Box
            width={{ xs: "400px", sm: "505px" }}
            component={"form"}
            display={"flex"}
            alignItems={"center"}
            gap={2}
            paddingBottom={0}
          >
            <TextField
              label="Name of new award"
              value={newAward}
              onChange={handleNewAward}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Box>

          <Box
            width={{ xs: "500px", sm: "550px" }}
            component={"form"}
            display={"flex"}
            alignItems={"center"}
            gap={2}
            paddingBottom={5}
          >
            <Stack paddingTop={5}>
              <ChromePicker
                color={colour1}
                onChange={(updatedColor1) =>
                  setColour1(updatedColor1.hex.toUpperCase())
                }
              />

              <Typography paddingTop={5} paddingLeft={5} variant="body2">
                Colour 1: {colour1}
              </Typography>
            </Stack>

            <Stack paddingLeft={3} paddingTop={5}>
              <ChromePicker
                color={colour2}
                onChange={(updatedColor2) =>
                  setColour2(updatedColor2.hex.toUpperCase())
                }
              />

              <Typography paddingTop={5} paddingLeft={5} variant="body2">
                Colour 2: {colour2}
              </Typography>
            </Stack>
            <Box paddingLeft={3} paddingTop={25}>
              <Button
                variant="contained"
                color="primary"
                disabled={!imageAdded}
                onClick={handleAddAward}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      label: "Hero Banners",
      index: "5",
      Component: (
        <DashboardHeroBanners
          heroBanners={heroBanners}
          refreshBanners={fetchHeroBanners}
        />
      ),
    },
    {
      label: "Mobile Hero Banners",
      index: "6",
      Component: (
        <DashboardMobileHeroBanners
          mobileHeroBanners={mobileHeroBanners}
          refreshBanners={fetchMobileHeroBanners}
        />
      ),
    },
  ];

  return (
    <Stack
      direction="column"
      spacing={0}
      minHeight="92vh"
      margin="8vh auto 0vh auto"
      paddingTop="20px"
      alignItems="center"
      width={{ xs: "100%", md: "1150px" }}
    >
      <Box display="flex" alignSelf="start" justifySelf="start">
        <Typography variant="h1">Welcome Admin</Typography>
      </Box>
      <Box height="inherit" width={{ xs: "100%", md: "1150px" }}>
        <MyTabs tabs={dashboardTabs} />
      </Box>
    </Stack>
  );
};

export default Dashboard;
