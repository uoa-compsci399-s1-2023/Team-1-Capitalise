import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Autocomplete, Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, styled } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useState } from 'react';
import ProjectLinksForm from '../upload/ProjectLinks';
import { Form } from 'react-router-dom';
const projectTags = [
  { tag: 'Mobile'},
  
];


export default function ProjectInfoForm() {
  

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        1. Project Details
      </Typography>
      
      <Grid container spacing={2}>
      <Box component="form">
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
        
       
        <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" gutterBottom>
        Attach a Project Banner
      </Typography>
        <label htmlFor="upload-banner">
            <input
              style={{ display: 'none' }}
              id="upload-banner"
              name="upload-banner"
              type="file"
            />

            <Button variant="contained" component="span">
              Upload button
            </Button>
          </label>
        </Grid>

        <ProjectLinksForm/>
        <Button variant="outlined" color="secondary" type="submit">Login</Button>
        </Box>
      </Grid>
        
      
    </React.Fragment>
  );
}
