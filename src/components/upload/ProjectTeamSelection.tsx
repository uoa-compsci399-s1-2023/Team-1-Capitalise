import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import isAlphanumeric from 'validator/lib/isAlphanumeric'


export default function ProjectTeamSelectionForm({teamToUpload, currentTeamInformation}: any) {
  const[teamName, setTeamName] = useState('');
  const [teamErrorText, setTeamErrorText] = useState("");
  const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
  
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const t = String(data.get('teamName'));
    //Alphanumeric validation for teamname. Using Validator module.
    //Ignore Spaces and 's e.g The Best Team's Project is accepted.
    if (isAlphanumeric(t,'en-US',{ignore: " '"})) { 
      setTeamName(t);
      teamToUpload(t);
      
    } else {
      setTeamErrorText('Please enter a team name with only letters and numbers.')
    }
   
    
    


  }

 
  return (
    <React.Fragment>
      <Typography variant="h6" sx = {{marginBottom: 4}} gutterBottom>
        1. Team Details
      </Typography>
      {/*This is the Team Name Field */}
      <Box component="form" noValidate onSubmit={handleNext}>
      <Grid container spacing={1}>
       
          <Grid item xs={12}>
          
            <TextField
              helperText= {teamErrorText? teamErrorText : "*This will create the team and allow you to add other team members after"}
              id="teamName"
              name="teamName"
              label="Team Name"
              error={!!teamErrorText}
              defaultValue={currentTeamInformation}
              fullWidth
              variant="outlined"
          
            />
            
          </Grid>
         
        
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
