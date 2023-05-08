import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, Chip, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, SelectChangeEvent, styled } from '@mui/material';
import { useState } from 'react';
import ProjectLinksForm from './ProjectLinks';

export default function ProjectTeamSelectionForm() {


 
  return (
    <React.Fragment>
      <Typography variant="h6" sx = {{marginBottom: 4}} gutterBottom>
        1. Team Details
      </Typography>
      {/*This is the Team Name Field */}
      <Grid item xs={12}>
      
        <TextField
          helperText= "*This will create the team and allow you to add other team members after"
          id="teamName"
          name="teamName"
          label="Team Name"
          fullWidth
          variant="outlined"
      
        />
      </Grid>
      
    </React.Fragment>
  );
}
