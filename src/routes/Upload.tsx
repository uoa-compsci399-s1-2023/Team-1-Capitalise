import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ProjectInfoForm from '../components/upload/ProjectInfo';
import ProjectUploadFileForm from '../components/upload/ProjectUploadFile';
import ProjectTeamSelectionForm from '../components/upload/ProjectTeamSelection';
import { useState } from 'react';
import UploadComplete from '../components/upload/UploadComplete';

const steps = ['Team Details', 'Project Details', 'Project Files', 'Upload'];





export default function Upload() {
  //Holds the counter for navigation between pages.
  const [activeStep, setActiveStep] = useState(0);
  //String of Team Name
  const[team, setTeam] = useState('');
  //Array of Project attributes - Project Name, Project Semester, Project Category, Project Description
  const[projectInfo, setProjectInfo] = useState('');
  //Banner Image
  const[banner, setBanner] = useState('');
  //Thumbnail
  const[thumbnail, setThumbnail] = useState('');
  //Array of Project Images
  const[projectImages, setProjectImages] = useState('');
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const teamToUpload = (teamData: any) => {
    //Stores Team Info into Team State
    setTeam(teamData);
    //Navigates to next page
    handleNext();
    
  }

  const projectInfoToUpload = (projectInfoData: any) => {
    //Stores Project Info into Project State
    setProjectInfo(projectInfoData);  
    //Navigates to next page
    handleNext();
    
  }

  const projectFileToUpload = (banner: any, images: any, thumbnail: any) => {
    //Stores Project Files into respective states
    setBanner(banner);  
    setProjectImages(images);  
    setThumbnail(thumbnail);
    //Navigates to loading page  
    handleNext();
    //Calls upload function as we have all the information to create a project
    handleUpload();
  }

  //The final call to create a Project
  const handleUpload = () => {
    //API Call here!

  }
  //This acts as a Navigator for each of upload pages rendered.
  function getStepContent(step: number) {
    switch (step) {
      //Enter Team details - Team Name
      case 0: 
        return <ProjectTeamSelectionForm teamToUpload={teamToUpload}/>;
      //Project Information - project name, semester, category, tags, description
      case 1:
        return <ProjectInfoForm  projectInfoToUpload={projectInfoToUpload} handleBack={handleBack}/>;
      //Project File  Upload - Banner, thumbnail, and any related imags.
      case 2: 
        return <ProjectUploadFileForm projectFileToUpload={projectFileToUpload} handleBack={handleBack}/>; 
      //An API call screen. Shows a successful response for Users.
      case 3:
        return <UploadComplete />;
      default:
        throw new Error('Unknown step');
    }
  }

  return (

      <Container maxWidth="md"  sx={{mt: 20, mb: 4}}>
        <Paper variant="outlined" sx={{my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Upload your Project
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        
          
            {/*This renders the components for each page depending on step*/}
            {getStepContent(activeStep)}
          
           
    
        </Paper>

      </Container>
  
  );
}