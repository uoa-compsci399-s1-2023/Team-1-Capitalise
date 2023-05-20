import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, Chip, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';



export default function ProjectInfoForm( {projectInfoToUpload}: any, {handleBack}: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [semester, setSemester] = React.useState('');
  const [category, setCategory] = React.useState('');

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };
  const handleTagChange = (event: any, value: any) => {
    setSelectedTags(value);
  };

  const handleSemesterChange = (event: SelectChangeEvent) => {
    setSemester(event.target.value);
  };

  const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const projectN = data.get("projectName");
    const sem = semester;
    const cat = category;
    //Not working at this stage.
    //const tags = selectedTags;
    //console.log(tags);
    const projDesc = data.get("projectDesc");
    
    const projToSend = {
      projN: projectN, 
      categoryN: cat,
      semesterN: sem,
      projectDescription: projDesc

    };
    console.log(projToSend);

    projectInfoToUpload(projToSend);
    
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
                <FormControl sx={{minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Semester</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="select-semester"
                value={semester}
                label="Semester"
                onChange={handleSemesterChange}
              >
                 {/*Hard coded for now, need to add parameter api*/}
                <MenuItem value="">
                </MenuItem>
                <MenuItem value={"S1 2021"}>S1 2021</MenuItem>
                <MenuItem value={"S2 2021"}>S2 2021</MenuItem>
                <MenuItem value={"S1 2022"}>S1 2022</MenuItem>
                <MenuItem value={"S2 2022"}>S2 2022</MenuItem>
                <MenuItem value={"S2 2023"}>S2 2023</MenuItem>
              </Select>
              <FormHelperText> * When did you complete this project?</FormHelperText>
            </FormControl>
            </Grid>
            
            {/*Category Selector*/}
            
            <Grid item xs={8}> 
          
                <FormControl sx={{minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label2">Category</InputLabel>
              <Select
                labelId="demo-select-small-label2"
                id="select-category"
                value={category}
                label="Cateogry"
                onChange={handleCategoryChange}
              >
                {/*Hard coded for now, need to add parameter api*/}
                <MenuItem value="">
                </MenuItem>
                <MenuItem value={"Game Development"}>Game Development</MenuItem>
                <MenuItem value={"Mobile Development"}>Mobile Development</MenuItem>
                <MenuItem value={"Web Development"}>Web Development</MenuItem>
              </Select>
              <FormHelperText> * What does this project specialise in?</FormHelperText>
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
          
            
            <Grid item xs={12} >
          
            <Autocomplete
            multiple
            id="tags-filled"
            options={[]}
            onChange={() => handleTagChange}
            freeSolo
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" sx={{ mt: 3, ml: 1 }} 
            onClick={() => handleBack()}
            >Back</Button>
            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 3, ml: 1 }}
            > Next </Button>
            </Box>
            
      </Box>
      
    </React.Fragment>
  );
}
