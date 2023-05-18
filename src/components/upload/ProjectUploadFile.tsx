import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";


import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
} from "@mui/material";
import validator from 'validator';
import { useEffect, useRef, useState } from "react";
import ProjectLinksForm from "./ProjectLinks";
const projectTags = [{ tag: "Mobile" }];



const FileInputField = styled(TextField)({
  minWidth: 200,
  maxWidth: 450,
});

export default function ProjectUploadFileForm(
  { projectFileToUpload,
    projectFileStore,
    handleBack, 
    projectResources, 
    handleUpload}: any) {
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
    const [githubLinkError, setgithubLinkError] = useState('');
    const [codepenLinkError, setcodepenLinkError] = useState('');
    const [codesandboxLinkError, setcodesandboxLinkError] = useState('');
    const [kaggleLinkError, setkaggleLinkError] = useState('');
    const [notionLinkError, setnotionLinkError] = useState('');
    const [deployedSiteLinkError, setdeployedSiteLinkError] = useState('');


  // need to look at this again to see if we need to set it back to File, if null is giving us trouble bellow.
  // const [banner, setBanner] = useState(null);
  console.log(projectResources, 'ok!');


  let bannerR = useRef< File|undefined>();
  const [banner, setBanner] = useState<File | undefined>();
  const [thumbnail, setThumbnail] = useState<File | undefined>();
  const [images, setImages] = useState<File[]>([]);
  let thumbnailR = useRef< File|undefined>();

  let imagesR = useRef<File[]>([]);

  const [projectLinks, setProjectLinks] = useState(
    options.map((option) => ({ value: '', type: option.type, label: option.label }))
  );


  if(bannerR.current == undefined) {
      bannerR.current = projectResources[0].current
  }

  if(imagesR.current.length == 0) {
      //setImages(projectResources[1]);
      imagesR.current = projectResources[1].current
  }
  if(thumbnailR.current == undefined) {
      thumbnailR.current = projectResources[2].current;

  }
  if(thumbnailR.current == undefined) {
    thumbnailR.current = projectResources[2].current;

  }
  if(projectResources[3] != projectLinks) {

    setProjectLinks(projectResources[3]);
  }
 
  

  const handleLinkChange = (event: any, index: any) => {
    const newSelectedOptions = [...projectLinks];
    newSelectedOptions[index].value = event.target.value;
    setProjectLinks(newSelectedOptions);
  
    
  };

  const handleBannerFile = (event: any) => {
    event.preventDefault();
    bannerR.current = (event.target.files[0]);
    setBanner(event.target.files[0]);
    projectFileStore(bannerR.current, [], undefined);
  };

  const handleProjectImages = (event: any) => {
    
    event.preventDefault();
    if (Array.from(event.target.files).length > 5) {
      alert(`Only 5 files are allowed to upload.`);
      return;
    }
    setImages(Array.from(event.target.files));
    imagesR.current = (Array.from(event.target.files));
    projectFileStore(undefined, imagesR.current, undefined);
  };

  const handleThumbnail = (event: any) => {
    event.preventDefault();
    thumbnailR.current =(event.target.files[0]);
    setThumbnail(event.target.files[0]);
    projectFileStore(undefined, undefined, thumbnailR.current);
  };


  const handleGoBack = (event: any) => {
    event.preventDefault();
    projectFileStore(bannerR.current, imagesR.current, thumbnailR.current);
    console.log(bannerR.current, imagesR.current, "ok" )
    handleBack();}
  
  const validateGithub = () => {   if(projectLinks[0].type == 'github') {
    if(!validator.matches(projectLinks[0].value, "https://github.com/") && !validator.isEmpty(projectLinks[0].value)) {
      setgithubLinkError('Please make sure your link begins with https://github.com/...')
  
    } else {
      setgithubLinkError('');
      return true;
    }
}}
  const validateCodepen = () => {if (projectLinks[1].type == 'codepen') {
    if(!validator.matches(projectLinks[1].value, "https://codepen.io/") && !validator.isEmpty(projectLinks[1].value)) {
        setcodepenLinkError('Please make sure your link begins with https://codepen.io/...')

      } else {
        setcodepenLinkError('');
        return true;
      }}
  }
  const validateNotion= () => { if (projectLinks[2].type == 'notion') {
    if(!validator.matches(projectLinks[2].value, "https://notion.so/") && !validator.isEmpty(projectLinks[2].value)) {
      setnotionLinkError('Please make sure your link begins with https://notion.so/...')
    } else {
      setnotionLinkError('');
      return true;
    }}

  }
  const validateCodeSandbox = () => {  
    if (projectLinks[3].type == 'codesandbox') {
        if(!validator.matches(projectLinks[3].value, "https://codesandbox.io") && !validator.isEmpty(projectLinks[3].value)) {
          setcodesandboxLinkError('Please make sure your link begins with https://codesandbox.io/...')
        } else {
          setcodesandboxLinkError('');
          return true;
        }
    } }
  const validateKaggle = () => {if(!validator.matches(projectLinks[4].value, "https://kaggle.com/") && !validator.isEmpty(projectLinks[4].value)) {
    setkaggleLinkError('Please make sure your link begins with https://kaggle.com/...')
  } else {
    setkaggleLinkError('');
    return true;
  }
}
  
  const validateDeployedWebsite = () => {if(!validator.isURL(projectLinks[5].value) && !validator.isEmpty(projectLinks[5].value)) {
    setdeployedSiteLinkError('Please make sure your link is a website/URL.')
  } else {
    setdeployedSiteLinkError('');
    return true;
  }
  }
        
  

  const handleFileUpload = (event: any) => {
    event.preventDefault();
    
    // handle file upload logic here
    if(projectLinks.length > 0) {
      const g = validateGithub();
      const cp = validateCodepen();
      const n = validateNotion();
      const sb = validateCodeSandbox();
      const k = validateKaggle()
      const ds = validateDeployedWebsite();
      if (g && cp && n && sb && k && ds) {
        projectFileToUpload(bannerR.current, imagesR.current, thumbnailR.current, projectLinks);
        if (window.confirm("Ready to submit?")) {
        console.log('passed')
        handleUpload();
        }
      }
  
    
   
  };  

  }
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        2. Project Files
      </Typography>
      <Box component="form" noValidate onSubmit={handleFileUpload}>
        <Grid container spacing={1}>
          {/* Upload Attach Banner */}
          <Grid item>
            <Typography variant="subtitle2" gutterBottom>
              Upload a Project Banner
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              id="bannerInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleBannerFile}
            />
            <FileInputField
              disabled

              value={banner ? banner.name : bannerR.current ? bannerR.current.name: ''}
              
              fullWidth
              helperText="*This features at the top of your project page!"
            />
          </Grid>
          <Grid item xs={12}>
            {" "}
            <label htmlFor="bannerInput">
              <Button variant="contained" component="span" size="small">
                Select File
              </Button>
            </label>
          </Grid>

          {/* Upload Images for Page */}
          <Grid item>
            <Typography variant="subtitle2">
              Upload any Project images for your Gallery
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              id="projectImagesInput"
          
              multiple
              style={{ display: "none" }}
              onChange={handleProjectImages}
            />
            <FileInputField
              disabled
              helperText="Accepts: .jpg,.jpeg,.png,.svg,.gif,.bmp,.ico,.tiff"
              value={images.length  ? `The number of files uploaded: ${images.length}`: imagesR.current ? `The number of files uploaded: ${imagesR.current.length}` : ''}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            {" "}
            <label htmlFor="projectImagesInput">
              <Button variant="contained" component="span" size="small">
                Select Files
              </Button>
            </label>
          </Grid>

          {/* Upload Images for Page */}
          <Grid item>
            <Typography variant="subtitle2">
              Upload a Project Card image
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              id="projectCardImageInput"
              style={{ display: "none" }}
              onChange={handleThumbnail}
            />
            <FileInputField
              disabled
              value={thumbnail ? thumbnail.name : thumbnailR.current ? thumbnailR.current.name : ''}
              fullWidth
              helperText="Accepts: .jpg,.jpeg,.png,.svg,.gif,.bmp,.ico,.tiff"
            />
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="projectCardImageInput">
              <Button variant="contained" component="span" size="small">
                Select file
              </Button>
            </label>
          </Grid>

          {/*Project Links Component*/}
          <Grid item xs={12} sx={{marginTop: 5}}>
            <Typography variant="subtitle2" gutterBottom>
              Project Links
            </Typography>

            {projectLinks.map((option:any , index:any) => (
              <Grid item xs={12} key={index} sx={{marginBottom: 2}}>
              <TextField sx={{maxWidth: '450px'}}       
                key={option.type}
                fullWidth
                label={option.label}
                value={option.value}
                error={eval(`${option.type}` + `LinkError`)}
                helperText={ eval(`${option.type}` + `LinkError`) ? eval(`${option.type}` + `LinkError`)  : ''}
                onChange={(event) => handleLinkChange(event, index)}
              />
              </Grid>
            ))} 
          </Grid> 
        </Grid>


        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="button"
            variant="outlined"
            sx={{ mt: 3, ml: 1 }}
            onClick={handleGoBack}
          >
            Back
          </Button>
          <Button variant="contained" type="submit" sx={{ mt: 3, ml: 1 }}>
            {" "}
            Next{" "}
          </Button>
        </Box>
      </Box>
    </React.Fragment>
  );
}