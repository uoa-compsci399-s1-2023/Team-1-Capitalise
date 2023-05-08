import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

export default function ProjectTeamSelectionForm({teamToUpload}: any) {
  const[teamName, setTeamName] = useState('');

  const handleNext = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const t = String(data.get('teamName'));
    setTeamName(t);
    teamToUpload(t);
    


  }

 
  return (
    <React.Fragment>
      <Typography variant="h6" sx = {{marginBottom: 4}} gutterBottom>
        1. Team Details
      </Typography>
      {/*This is the Team Name Field */}
      <Grid container spacing={1}>
        <Box component="form" noValidate onSubmit={handleNext}>
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ mt: 3, ml: 1 }}
          > Next </Button>
          </Box>
        </Box>
      </Grid>
     
    </React.Fragment>


  );
}
