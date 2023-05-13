import * as React from "react";

import Container from "@mui/material/Container";
import TeamInformation from "../assets/TeamInformation.svg"
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
import { postThumbnail } from "../api/postThumbnail";
import { postTab } from "../api/postTab";
import { addGallery } from "../api/addGallery";
import { Box } from "@mui/material";

interface TProjectInfo {
  projN: string;
  categoryN: string;
  semesterN: string;
  projectDescription: string | null;
  tags:string [];
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
  const [projectLink, setProjectLink] = useState([]);

  // seperate out fields into variables to avoid "possibly undefined".
  // force some of the fields to be string so we avoid "possibly undefined".
  // we are using the same logic of forcing the variable to be a string even though it could be undefined. Like we did with the auth token.
  const projectName = projectInfo?.projN as string;
  const projectSemester = projectInfo?.semesterN as string;
  const projectCategory = projectInfo?.categoryN as string;
  const projectDescription = projectInfo?.projectDescription as string;
  const projectTags = projectInfo?.tags  as [];
  

  //let formData = new FormData();
  let bannerData = new FormData();
  let thumbnailData = new FormData();
  let imagesData = new FormData();

  // to check if form data is empty or not
  let isBannerEmpty = false;
  let isThumbnailEmpty = false;

  // check how many images are passed
  let numImages = 0;

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
    console.log(projectInfoData);

    // navigates to next page
    handleNext();
  };

  const projectLinkToUpload = (projectLinks: any) => {
    setProjectLink(projectLinks);
    console.log(projectLink);
  }

  const projectFileToUpload = (banner: any, images: any, thumbnail: any) => {
    // stores Project Files into respective states
    
    console.log('These on upload:', projectLink);
    // we want to check if these files are null or not.
    if (banner == null) {
      console.log("Banner is null");
      isBannerEmpty = true;
    }
    if (thumbnail == null) {
      console.log("Thumbnail is null");
      isThumbnailEmpty = true;
    }

    bannerData.append("banner", banner);
    thumbnailData.append("thumbnail", thumbnail);

    numImages = images.length;
    console.log("How many images:", numImages);

    // go through image files and append as formdata
    images.forEach((image: any) => {
      imagesData.append("gallery", image);
      console.log(image);
    });

    // navigates to loading page
    // check if user wants to submit their project, otherwise keep them on this page.


    if (window.confirm("Ready to submit?")) {
      handleNext();
      
    }
    
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
      //banner: banner,             // these only accept URLs, not files.
      //thumbnail: thumbnail,       
      semester: projectSemester,
      category: projectCategory,
      links: projectLink,
      content: [
        {
          tabName: "Overview", // first tab name will be "Overview" by default.
          tabContent: [
            {
              type: "text",
              subHeading: "Description",
              value: [projectDescription],
            },
          ],
        },
      ],
      tags: projectTags,
    };

    console.log("New project:", newProject);

    const createdProject = createProject(
      newProject,
      auth.getToken() as string
    ).then((data) => {
      console.log(data._id);

      // need to perform file validation checks to check if images are null.
      if (!isBannerEmpty) {
        postBanner(data._id, bannerData);
      } 
      if (!isThumbnailEmpty) {
        postThumbnail(data._id, thumbnailData);
      } 
        
      //instead of postTab, need to use addGallery.
      if (numImages > 0) {
        addGallery(data._id, "Overview", imagesData);
      }
    });
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
            projectLinkToUpload={projectLinkToUpload}
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
    <div style={{background: "white"}}>
    <Container maxWidth="md" sx={{mt: 20, mb: 4 }}>
      <Paper
        elevation={12}

        sx={{my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Box
              component="img"
              justifyContent="center"
              alignContent="center"
              margin="auto"
              src={TeamInformation}
              alt="logo"
              sx={{
                width: "150px",
                flexGrow: 1,
                display: { xs: "flex", md: "flex" },
              }}
            ></Box>
        <Typography component="h1" variant="h4" align="center">
          {/*Team Image*/}
          
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
    </div>
  );
}
