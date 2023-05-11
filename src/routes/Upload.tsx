import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProjectInfoForm from "../components/upload/ProjectInfo";
import ProjectUploadFileForm from "../components/upload/ProjectUploadFile";
import ProjectTeamSelectionForm from "../components/upload/ProjectTeamSelection";
import { useState } from "react";
import UploadComplete from "../components/upload/UploadComplete";

import { useAuth } from "../customHooks/useAuth";
import { createProject } from "../api/createProject";
import { TNewProject } from "../model/TNewProject";
import { postBanner } from "../api/postBanner";

interface TProjectInfo {
  projN: string;
  categoryN: string;
  semesterN: string;
  projectDescription: string | null;
}

// different stages of the project upload form.
const steps = ["Team Details", "Project Details", "Project Files", "Upload"];

// set the new project

export default function Upload() {
  const auth = useAuth();

  // holds the counter for navigation between pages.
  const [activeStep, setActiveStep] = useState(0);

  // string of Team Name
  const [team, setTeam] = useState("");

  // array of Project attributes - Project Name, Project Semester, Project Category, Project Description
  const [projectInfo, setProjectInfo] = useState<TProjectInfo>();

  // seperate out fields into variables to avoid "possibly undefined".
  // force some of the fields to be string so we avoid "possibly undefined".
  // we are using the same logic of forcing the variable to be a string even though it could be undefined. Like we did with the auth token.
  const projectName = projectInfo?.projN as string;
  const projectSemester = projectInfo?.semesterN as string;
  const projectCategory = projectInfo?.categoryN as string;
  const projectDescription = projectInfo?.projectDescription as string;

  // set up the form data field
  let formData = new FormData();

  // banner Image (changed from string)
  const [banner, setBanner] = useState(null);

  // thumbnail (changed from string)
  const [thumbnail, setThumbnail] = useState(null);

  // array of Project Images
  const [projectImages, setProjectImages] = useState("");

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const teamToUpload = (teamData: any) => {
    // stores Team Info into Team State
    setTeam(teamData);

    // navigates to next page
    handleNext();
  };

  const projectInfoToUpload = (projectInfoData: any) => {
    // stores Project Info into Project State
    setProjectInfo(projectInfoData);

    // console log to check fields are being passed as TProjectInfo interface.
    console.log(projectName);
    console.log(projectSemester);
    console.log(projectCategory);
    console.log(projectDescription);

    // navigates to next page
    handleNext();
  };

  const projectFileToUpload = (banner: any, images: any, thumbnail: any) => {
    // stores Project Files into respective states

    setBanner(banner);
    console.log("banner passed", banner);

    setProjectImages(images);

    setThumbnail(thumbnail);
    console.log("thumnnail passed", banner);

    formData.append("banner", banner);
    formData.append("thumbnail", thumbnail);

    // navigates to loading page
    handleNext();

    // calls upload function as we have all the information to create a project
    handleUpload();
  };

  // the final call to create a Project
  const handleUpload = () => {
    // API Call here!

    // for now, maybe just pass the required fields to test?
    const newProject: TNewProject = {
      name: projectName,
      teamname: team,
      //banner: banner,
      //thumbnail: thumbnail,
      semester: projectSemester,
      category: projectCategory,
      content: [
        {
          tabName: "Overview", // set as a default first tab name.
          tabContent: [
            {
              type: "text",
              subHeading: "Description",
              value: [projectDescription],
            },
          ],
        },
      ],
    };

    // access the projectId from the returned JSON response.
    // const createdProject = createProject(newProject, auth.getToken() as string);
    // console.log(createdProject);

    // call the s3 upload bannner endpoint to add the banner file (change banner from string to file?)
    //postBanner("645c45fcfca33a873cfdef47", );
  };

  // this acts as a Navigator for each of upload pages rendered.
  function getStepContent(step: number) {
    switch (step) {
      // enter Team details - Team Name
      case 0:
        return <ProjectTeamSelectionForm teamToUpload={teamToUpload} />;

      // Project Information - project name, semester, category, tags, description
      case 1:
        return (
          <ProjectInfoForm
            projectInfoToUpload={projectInfoToUpload}
            handleBack={handleBack}
          />
        );

      // Project File  Upload - Banner, thumbnail, and any related imags.
      case 2:
        return (
          <ProjectUploadFileForm
            projectFileToUpload={projectFileToUpload}
            handleBack={handleBack}
          />
        );

      // An API call screen. Shows a successful response for Users.
      case 3:
        return <UploadComplete />;

      default:
        throw new Error("Unknown step");
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 20, mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
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
