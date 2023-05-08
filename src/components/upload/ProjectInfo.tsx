import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Autocomplete, Box, Button, Chip, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, SelectChangeEvent, styled } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useState } from 'react';
import ProjectLinksForm from '../upload/ProjectLinks';
import { Form } from 'react-router-dom';
const projectTags = [
  { tag: 'Mobile'},
  
];


export default function ProjectInfoForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [semester, setSemester] = React.useState('');
  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadClick = () => {
    // handle file upload logic here
    console.log(selectedFile);
  };

  const handleSemesterChange = (event: SelectChangeEvent) => {
    setSemester(event.target.value);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        1. Project Details
      </Typography>
      <Box component="form">
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
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          <FormHelperText> * When did you complete this project?</FormHelperText>
        </FormControl>
        </Grid>
        
        {/*Category Selector*/}
        
        <Grid item xs={8}> 
      
            <FormControl sx={{minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Category</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="select-semester"
            value={semester}
            label="Semester"
            onChange={handleSemesterChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          <FormHelperText> * What does this project specialise in?</FormHelperText>
        </FormControl>
        </Grid> 
        {/*This is the Team Name Field */}
        <Grid item xs={12}>
      
          <TextField
        
            id="teamName"
            name="teamName"
            label="Team Name"
            fullWidth
            variant="outlined"
         
          />
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

        options={projectTags.map((option) => option.tag)}
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
      </Box>
      
    </React.Fragment>
  );
}
