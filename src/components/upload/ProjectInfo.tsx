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
import { useState, useEffect, useRef } from "react";
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
  {projectInfoToUpload, 
  handleNext,
  handleBack, 
  projectInformation,


  }: any,
) {
  
 
  
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

  
  //Project Name State
  const projectNA = useRef('');
  
  const [projectNameErrorText, setProjectNameErrorText] = useState('');
  
  //Project Description State 
  const projectDA = useRef('');
  const [projectDescErrorText, setProjectDescErrorText] = useState('');
  
  //Semester States
  const [semester, setSemester] = React.useState(projectInformation.semesterN);
  const [semesterErrorText, setSemesterErrorText] = useState('');
  
  //Category States
  const [category, setCategory] = React.useState(projectInformation.categoryN);
  const [categoryErrorText, setCategoryErrorText] = useState('');
  
  //Tag states
  const tagList : {name: string}[] = [];
  const [selectedTags, setSelectedTags] = useState(projectInformation.tags);

  const [tagErrorText, setTagErrorText] = useState('');
  if(projectInformation.projN) {
    projectNA.current = projectInformation.projN;
  }
  if(projectInformation.projectDescription) {
    projectDA.current = projectInformation.projectDescription;
  }
  
  const validateProjectName= (projectN: any) => { 
    //Project Name Validation 
    if(validator.isEmpty(projectN)) {
      setProjectNameErrorText('Enter a project name.');
    }else if(!validator.isAscii(projectN)) {
      setProjectNameErrorText('Enter a project name with only ASCII characters.');
    }else if(projectN.length < 5) {
      setProjectNameErrorText('Enter a project name longer than five characters.');
    } else if (projectN.length > 100) { 
      setProjectNameErrorText('Team name exceeded character limit.');
      
    } else {
      setProjectNameErrorText('')
      return true
    }
  }
  const validateProjectSemester= (sem: any) => { 
    //Project Semester Validation 
    if(validator.isEmpty(sem)) {
      setSemesterErrorText('Pick your project semester.');
    } else { 
      setSemesterErrorText('');
      return true;
    }
  }
  const validateProjectCategory= (cat: any) => { 
    //Project Category Validation 
    if(validator.isEmpty(cat)) {
      setCategoryErrorText('Pick a project category.');
    } else { 
      setCategoryErrorText('');
      return true;
    }
  } 
  
  const validateProjectTags= (selectedTags: any) => { 
    //Project Tags Validation 
    if(selectedTags.length > 0) {
      let msgError = 'The following tags are invalid: ';
      for (const element of selectedTags) {
        //Check against a blacklist, inappropriate word list.
        if (nw.en.includes(element)) {
          msgError += element + '(blacklisted)' + '';   
        } else if (element > 50) {
          msgError += element + '(max char)' + ' ';   
        }
        
      }
      if (msgError != 'The following tags are invalid: ') {
        setTagErrorText(msgError);
      } else {
        return true;
      }
    } else { 
      setTagErrorText('');
      return true;
    }
  }
  const validateProjectDesc= (projectDesc: any) => { 
    //Project Description Validation 
    if(!validator.isAscii(projectDesc)) {
      setProjectDescErrorText('Enter a project description with only ASCII characters.');
      
    } else if (validator.isEmpty(projectDesc)) {
      setProjectDescErrorText('Enter a project description.');
    } else { 
      setProjectDescErrorText('');
      return true;
    }
  }



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
  
  const handleNameChange = (event: any) => {
    event.preventDefault();
    projectNA.current = (event.target.value);
  }
  const handleDescChange = (event: any) => {
    event.preventDefault();
    projectDA.current = (event.target.value);
  }
  
  //Submitting data on Next press to the main Upload parent component to store.
  const handleProjectUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const projectN = data.get("projectName") as string;
    projectNA.current = projectN;
    const sem = semester;
    const cat = category;
    const projDesc = data.get("projectDesc") as string;
    projectDA.current = projDesc;
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

      projectInfoToUpload(infoSend);
      handleNext();
      
    }
  };
  const handleGoBack = () => {
  
    const infoHold: TProjectInfo = {
      projN: projectNA.current,
      categoryN: category,
      semesterN: semester,
      tags: selectedTags,
      projectDescription: projectDA.current,
    };
    
    projectInfoToUpload(infoHold);
    handleBack();}

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        1. Project Details
      </Typography>
      <Box component="form" noValidate onSubmit={handleProjectUpload}>
        <Grid container spacing={2}>
          {/*Semester Selector*/}
          <Grid item xs={12}sm={6} md={5}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Semester</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="select-semester"
                value={semester}
                label="Semester"
                error= {!!semesterErrorText}
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

          <Grid item xs={12} sm={6} md={5}>
            <FormControl sx={{ minWidth: 120}} size="small">
              <InputLabel id="demo-select-small-label2">Category</InputLabel>
              <Select
                labelId="demo-select-small-label2"
                id="select-category"
                value={category}
              
                label="Category"
                error= {!!categoryErrorText}
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
              defaultValue={projectInformation.projN? projectInformation.projN : ''}
              fullWidth
              onChange={handleNameChange}
              error={!!projectNameErrorText}
              helperText={projectNameErrorText ? projectNameErrorText : ''}
              variant="outlined"
            />
          </Grid>
        
          <Grid item xs={12}>
            <Autocomplete
              multiple={true}
              id="tags-filled"
              defaultValue={projectInformation.tags}
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
              defaultValue={projectInformation.projectDescription? projectInformation.projectDescription : ""}
              fullWidth
              variant="outlined"
              multiline={true}
              rows={10}
              error={!!projectDescErrorText}
              helperText={projectDescErrorText? projectDescErrorText : 'Enter a short description about your project'}
              onChange={handleDescChange}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="button"
            variant="outlined"
            sx={{ mt: 3, ml: 1 }}
            onClick={handleGoBack}
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
