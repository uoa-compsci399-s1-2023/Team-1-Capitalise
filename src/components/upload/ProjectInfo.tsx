import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import validator from "validator";
import nw from "naughty-words";
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
  tags: string[];
  projectDescription: string | null;
}



export default function ProjectInfoForm(
  {projectInfoToUpload, handleBack }: any,
) {
  
  //Project Name State
  const [projectNameErrorText, setProjectNameErrorText] = useState('');
  
  //Project Description State 
  const [projectDescErrorText, setProjectDescErrorText] = useState('');
  
  
  //Semester States
  const [semester, setSemester] = React.useState('');
  const [semesterErrorText, setSemesterErrorText] = useState('');
  
  //Category States
  const [category, setCategory] = React.useState('');
  const [categoryErrorText, setCategoryErrorText] = useState('');
  
  //Tag states
  const tagList : {name: string}[] = [];
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagErrorText, setTagErrorText] = useState('');
  
  
  const validateProjectName= (projectN: any) => { 
    //Project Name Validation 
    if(!validator.isAscii(projectN)) {
      setProjectNameErrorText('Enter a project name with only ASCII characters.');
      
    } else if (!validator.isEmpty(projectN)) {
      setProjectNameErrorText('Enter a project name.');
    } else { 
      setProjectNameErrorText('');
      return true;
    }
  }
  const validateProjectSemester= (sem: any) => { 
    //Project Semester Validation 
    if(!validator.isEmpty(sem)) {
      setSemesterErrorText('Pick your project semester.');
    } else { 
      setSemesterErrorText('');
      return true;
    }
  }
  const validateProjectCategory= (cat: any) => { 
    //Project Category Validation 
    if(!validator.isEmpty(cat)) {
      setCategoryErrorText('Pick a project category.');
    } else { 
      setCategoryErrorText('');
      return true;
    }
  }
  
  const validateProjectTags= (selectedTags: any) => { 
    //Project Tags Validation 
    var msgError = 'The following tags are invalid: ';
    if(selectedTags) {
      for (var i = 0 ; i < selectedTags.length; i++) {
        //Check against a blacklist, inappropriate word list.
        if (nw.en.includes(selectedTags[i])) {
          msgError += selectedTags[i] + ' ';   
        }
        
      }
      setTagErrorText(msgError);
    } else { 
      setTagErrorText('');
      return true;
    }
  }
  const validateProjectDesc= (projectDesc: any) => { 
    //Project Description Validation 
    if(!validator.isAscii(projectDesc)) {
      setProjectDescErrorText('Enter a project description with only ASCII characters.');
      
    } else if (!validator.isEmpty(projectDesc)) {
      setProjectNameErrorText('Enter a project description.');
    } else { 
      setProjectNameErrorText('');
      return true;
    }
  }

  //API Fetches for Semester and Category lists 
  // Map the semesters to the MenuItems.
    const [semesterList, setSemesterList] = useState<JSX.Element[]>([]);
    useEffect(() => {
      // grab the semesters from the API
      const fetchSemesters = getSemesters().then((data) => {
        // Map the semesters to the MenuItem components
        const semesterList = data.map(semester => (
          <MenuItem key={semester._id} value={semester.value}>
            {semester.value}
          </MenuItem>
        ));
        setSemesterList(semesterList);
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


  //Setting Category State on Change
  const handleCategoryChange = (event: SelectChangeEvent) => {
    event.preventDefault();
    setCategory(event.target.value);
  };
  //Adding selected tags into a list state.
  const handleTagChange = (event: any, value: any) => {
    event.preventDefault();
    setSelectedTags(value);
  };
  //Setting Semester state upon Change
  const handleSemesterChange = (event: SelectChangeEvent) => {
    event.preventDefault();
    setSemester(event.target.value);
  };
  //Submitting data on Next press to the main Upload parent component to store.
  const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const projectN = data.get("projectName") as string;
    const sem = semester;
    const cat = category;
    const projDesc = data.get("projectDesc") as string;
    //Validation Checks on correct data.
    const okProjectName = validateProjectName(projectN);
    const okProjectSem = validateProjectSemester(sem);
    const okProjectCat = validateProjectCategory(cat);
    const okProjectDesc = validateProjectDesc(projDesc);
    const okProjectTags = validateProjectTags(selectedTags);
    
    if (okProjectName && okProjectSem && okProjectCat && okProjectDesc && okProjectTags) {
      const infoSend: TProjectInfo = {
        projN: projectN,
        categoryN: cat,
        semesterN: sem,
        tags: selectedTags,
        projectDescription: projDesc,
      };
       //console.log("Info sent from ProjectInfo:", infoSend);
      projectInfoToUpload(infoSend);
      
    }
    
    
    
    
   

   
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
                {semesterList}
              </Select>
              <FormHelperText>
              {semesterErrorText ? semesterErrorText: '* When was this project completed?'}
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
                {categoryErrorText ? categoryErrorText: '* What does this project specialise in?'}
                
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
              error={!!projectNameErrorText}
              helperText={projectNameErrorText ? projectNameErrorText : ''}
              variant="outlined"
            />
          </Grid>
        
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="tags-filled"
              options={tagList.map((option) => option.name)}
              onChange={(event: any, newValue: any) => { 
                setSelectedTags(newValue);
              }}
              freeSolo
              renderTags={(value: string[], getTagProps) =>
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
                  error={!!tagErrorText}
                  helperText={tagErrorText? tagErrorText : ''}
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
              error={!!projectDescErrorText}
              helperText={projectDescErrorText? projectDescErrorText : 'Enter a short description about your project'}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="button"
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
