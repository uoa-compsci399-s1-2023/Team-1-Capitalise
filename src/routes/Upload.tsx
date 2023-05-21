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
import { useEffect, useRef, useState } from "react";
import UploadComplete from "../components/upload/UploadComplete";

import { useAuth } from "../customHooks/useAuth";
import { createProject } from "../api/createProject";
import { TNewProject } from "../model/TNewProject";
import { postBanner } from "../api/postBanner";
import { postThumbnail } from "../api/postThumbnail";
import { postTab } from "../api/postTab";
import { addGallery } from "../api/addGallery";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
const options = [
  {
    value: 'gitHub',
    type: 'github',
    label: 'GitHub',
  },
  {
    value: 'codePen',
    type: 'codepen',
    label: 'CodePen',
  },
  {
    value: 'notion',
    type: 'notion',
    label: 'Notion',
  },
  {
    value: 'codesandbox',
    type: 'codesandbox',
    label: 'CodeSandbox',
  },
  {
    value: 'kaggle',
    type: 'kaggle',
    label: 'Kaggle',
  },
  { value: 'deployedSite',
    type: 'deployedSite', 
    label: 'Deployed Site'},
];

interface TProjectInfo {
  projN: string;
  categoryN: string;
  semesterN: string;
  projectDescription: string | null;
  tags:string [];
}



// different stages of the project upload form.
const steps = ["Team Details", "Project Details", "Project Files", "Upload"];
const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));
const isMobile = window.innerWidth <= 600;
// set the new project

export default function Upload() {
  const infoHold: TProjectInfo = {
    projN: '',
    categoryN: '',
    semesterN: '',
    tags: [],
    projectDescription: '',
  };
  const nav = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    if (!auth.user || auth.user.userType === "visitor" || auth.user.project) {
      nav("/")
    }
  })
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  // holds the counter for navigation between pages.
  const [activeStep, setActiveStep] = useState(0);

  // string of Team Name
  const [team, setTeam] = useState("");

  // array of Project attributes - Project Name, Project Semester, Project Category, Project Description
  const [projectInfo, setProjectInfo] = useState<TProjectInfo>(infoHold);
  const [projectLinkTemp, setProjectLinkTemp] = useState(options.map((option) => ({ value: '', type: option.type, label: option.label })));
 
  let projectLink = useRef([]);
  let projectID = useRef('');
  let bannerInfo = useRef<File | undefined>();
  let imagesInfo =  useRef([]);
  let thumbnailInfo = useRef< File | undefined>();
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

  };
  const projectFileStore = (banner:any, images:any, thumbnail: any, projectLinks:any) => {
    // stores Project Info into Project State
    if ( banner != undefined) {
      bannerInfo.current = banner;
    }
    if ( images.length > 0 ) {
      imagesInfo.current = images;
    }

    if ( thumbnail != undefined ) {
      thumbnailInfo.current = thumbnail;
    }
    projectLink.current = (projectLinks);

  
  };

  const projectFileToUpload = (banner:any, images:any, thumbnail: any, projectLinks:any) => {
    // we want to check if these files are null or not.
    console.log(projectLinks, 'Comign through from upload')
    if (banner == null) {
      isBannerEmpty = true;
    }
    if (thumbnail == null) {
      isThumbnailEmpty = true;
    }

    bannerData.append("banner", banner);
    thumbnailData.append("thumbnail", thumbnail);

    numImages = images.length;


    // go through image files and append as formdata
    images.forEach((image: any) => {
      imagesData.append("gallery", image);
  
    });
    const newLinks = projectLinks.map(({ value, type }: { value: string, type: string }) => ({ value, type }));
    projectLink.current = (newLinks);
    console.log(projectLink, 'UPLOADED')
  }
  // the final call to create a Project
  const handleUpload = async () => {
    // API Call here!
    console.log(projectLink, 'handleUpload links')
    let pL = projectLink.current
    // for now, maybe just pass the required fields to test?
    const newProject: TNewProject = {
      name: projectName,
      teamname: team,     
      semester: projectSemester,
      category: projectCategory,
      links: pL,
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
  

    const createdProject = createProject(
      newProject,
      auth.getToken() as string
    ).then((data) => {
      projectID.current = data._id;


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
    await delay(2000);
      if(projectID.current) {
        handleNext();
      }
    
    
  };

  // this acts as a Navigator for each of upload pages rendered.
  function getStepContent(step: number) {
    switch (step) {
      // enter Team details - Team Name
      case 0:
        return <ProjectTeamSelectionForm teamToUpload={teamToUpload} currentTeamInformation={team} />;

      // Project Information - project name, semester, category, tags, description
      case 1:
        return (
          <ProjectInfoForm
            projectInfoToUpload={projectInfoToUpload}
            handleNext={handleNext}
            handleBack={handleBack}
            projectInformation={projectInfo}
          />
        );

      // Project File  Upload - Banner, thumbnail, and any related imags.
      case 2:
        return (
          <ProjectUploadFileForm
            projectFileToUpload={projectFileToUpload}
            projectFileStore={projectFileStore}
            handleBack={handleBack}
            projectResources={[bannerInfo, imagesInfo, thumbnailInfo, projectLinkTemp]}
            handleUpload={handleUpload}
          />
        );

      // An API call screen. Shows a successful response for Users.
      case 3:
          return (
            <UploadComplete projectID={projectID}/>
          )
   
        

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
              {!isMobile ? <StepLabel>{label}</StepLabel> : <StepLabel></StepLabel>}
          
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
