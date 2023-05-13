import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getSemesters } from "../../api/getSemesters";
import { TSemester } from "../../model/TSemester";
import { getCategories } from "../../api/getCategories";
import { TCategory } from "../../model/TCategory";

interface TProjectInfo {
  projN: string;
  categoryN: string;
  semesterN: string;
  projectDescription: string | null;
}

export default function ProjectInfoForm(
  { projectInfoToUpload }: any,
  { handleBack }: any
) {

  // Map the semesters to the MenuItems.
  const [semesters, setSemesters] = useState<JSX.Element[]>([]);
  useEffect(() => {
    // grab the semesters from the API
    const fetchSemesters = getSemesters().then((data) => {
      // Map the semesters to the MenuItem components
      const semesters = data.map(semester => (
        <MenuItem key={semester._id} value={semester.value}>
          {semester.value}
        </MenuItem>
      ));
      setSemesters(semesters);
    })
  }, []);

  // Map the categories to the MenuItems.
  const [categories, setCategories] = useState<JSX.Element[]>([]);
  useEffect(() => {
    // grab the categories from the API
    const fetchCategories = getCategories().then((data) => {
      // Map the categories to the MenuItem components
      const categories = data.map(category => (
        <MenuItem key={category._id} value={category.value}>
          {category.value}
        </MenuItem>
      ));
      setCategories(categories);
    })
  }, []);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const [semester, setSemester] = React.useState("");
  const [category, setCategory] = React.useState("");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    event.preventDefault();
    setCategory(event.target.value);
  };
  const handleTagChange = (event: any, value: any) => {
    event.preventDefault();
    setSelectedTags(value);
  };

  const handleSemesterChange = (event: SelectChangeEvent) => {
    setSemester(event.target.value);
  };

  const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const projectN = data.get("projectName") as string;

    const sem = semester;
    const cat = category;
    //Not working at this stage.
    //const tags = selectedTags;
    //console.log(tags);

    const projDesc = data.get("projectDesc") as string;

    const infoSend: TProjectInfo = {
      projN: projectN,
      categoryN: cat,
      semesterN: sem,
      projectDescription: projDesc,
    };
    console.log("Info sent from ProjectInfo:", infoSend);

    projectInfoToUpload(infoSend);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        1. Project Details
      </Typography>
      <Box component="form" noValidate onSubmit={handleNext}>
        <Grid container spacing={2}>
          {/*Semester Selector*/}
          <Grid item xs={4}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Semester</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="select-semester"
                value={semester}
                label="Semester"
                onChange={handleSemesterChange}
              >
                {semesters}
              </Select>
              <FormHelperText>
                {" "}
                * When did you complete this project?
              </FormHelperText>
            </FormControl>
          </Grid>

          {/*Category Selector*/}

          <Grid item xs={8}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label2">Category</InputLabel>
              <Select
                labelId="demo-select-small-label2"
                id="select-category"
                value={category}
                label="Cateogry"
                onChange={handleCategoryChange}
              >
                {categories}
              </Select>
              <FormHelperText>
                {" "}
                * What does this project specialise in?
              </FormHelperText>
            </FormControl>
          </Grid>

          {/*This is the Project Name Field*/}
          <Grid item xs={12}>
            <TextField
              required
              id="projectName"
              name="projectName"
              label="Project Name"
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="tags-filled"
              options={[]}
              onChange={() => handleTagChange}
              freeSolo
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Project Tags"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="projectDesc"
              name="projectDesc"
              label="Project Description"
              fullWidth
              variant="outlined"
              multiline={true}
              rows={10}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            sx={{ mt: 3, ml: 1 }}
            onClick={() => handleBack()}
          >
            Back
          </Button>
          <Button variant="contained" type="submit" sx={{ mt: 3, ml: 1 }}>
            {" "}
            Next{" "}
          </Button>
        </Box>
      </Box>
    </React.Fragment>
  );
}
