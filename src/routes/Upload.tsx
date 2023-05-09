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
  const [activeStep, setActiveStep] = useState(0);
  const[team, setTeam] = useState('');
  const[projectInfo, setProjectInfo] = useState('');
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
    //Stores Project Info into Project State
    console.log(banner?.name);
    console.log(images);
    console.log(thumbnail?.name);
    //Navigates to next page
    handleNext();
    
  }
  function getStepContent(step: number) {
    switch (step) {
      case 0: 
        return <ProjectTeamSelectionForm teamToUpload={teamToUpload}/>;
      case 1:
        return <ProjectInfoForm  projectInfoToUpload={projectInfoToUpload} handleBack={handleBack}/>;
      case 2: 
        return <ProjectUploadFileForm projectFileToUpload={projectFileToUpload} />; 
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