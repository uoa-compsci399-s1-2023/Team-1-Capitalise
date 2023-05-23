import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
} from "@mui/material";
import validator from "validator";
import { useRef, useState } from "react";


const FileInputField = styled(TextField)({
  minWidth: 200,
  maxWidth: 450,
});

export default function ProjectUploadFileForm({
  projectFileToUpload,
  projectFileStore,
  handleBack,
  projectResources,
  handleUpload,
}: any) {
  const options = [
    {
      value: "gitHub",
      type: "github",
      label: "GitHub",
      suffix: 'com',
    },
    {
      value: "codePen",
      type: "codepen",
      label: "CodePen",
      suffix: "io",
    },
    {
      value: "notion",
      type: "notion",
      label: "Notion",
      suffix: "so",
    },
    {
      value: "codesandbox",
      type: "codesandbox",
      label: "CodeSandbox",
      suffix: "io",
    },
    {
      value: "kaggle",
      type: "kaggle",
      label: "Kaggle",
      suffix: "com",
    },
    { value: "deployedSite", type: "deployedSite", label: "Deployed Site", suffix: "" },
  ];
  const [linkErrors, setLinkErrors] = useState<{ [key: string]: string }>({
    github: "",
    codepen: "",
    notion: "",
    codesandbox: "",
    kaggle: "",
    deployedSite: "",
  });
  const [galleryImageError, setGalleryImageError] = useState("");
  const [open, setOpen] = React.useState(false);
  const [banner, setBanner] = useState<File | undefined>();
  const [thumbnail, setThumbnail] = useState<File | undefined>();
  const [images, setImages] = useState<File[]>([]);
  const [projectLinks, setProjectLinks] = useState(
    options.map((option) => ({
      value: "",
      type: option.type,
      label: option.label,
      suffix: option.suffix,
    }))
  );
  console.log(projectLinks[0].suffix, 'hello')  
  let bannerR = useRef<File | undefined>();
  let thumbnailR = useRef<File | undefined>();
  let imagesR = useRef<File[]>([]);

  if (bannerR.current == undefined) {
    bannerR.current = projectResources[0].current;
  }
  if (imagesR.current.length == 0) {
    //setImages(projectResources[1]);
    imagesR.current = projectResources[1].current;
  }
  if (thumbnailR.current == undefined) {
    thumbnailR.current = projectResources[2].current;
  }
  if (thumbnailR.current == undefined) {
    thumbnailR.current = projectResources[2].current;
  }
  if (projectResources[3] != projectLinks) {
    setProjectLinks(projectResources[3]);
  }

  const handleLinkChange = (event: any, index: any) => {
    const newSelectedOptions = [...projectLinks];
    newSelectedOptions[index].value = event.target.value;
    setProjectLinks(newSelectedOptions);
  };
  const handleBannerFile = (event: any) => {
    event.preventDefault();
    bannerR.current = event.target.files[0];
    setBanner(event.target.files[0]);
    projectFileStore(bannerR.current, [], undefined);
  };

  const handleProjectImages = (event: any) => {
    event.preventDefault();
    if (Array.from(event.target.files).length > 5) {
      setGalleryImageError(`Only 5 files are allowed to upload. Please reupload 5 or less images!`);
      
    } else {
      setGalleryImageError('');
      setImages(Array.from(event.target.files));
      imagesR.current = Array.from(event.target.files);
      projectFileStore(undefined, imagesR.current, undefined);

    }
    
  };

  const handleThumbnail = (event: any) => {
    event.preventDefault();
    thumbnailR.current = event.target.files[0];
    setThumbnail(event.target.files[0]);
    projectFileStore(undefined, undefined, thumbnailR.current);
  };

  const handleGoBack = (event: any) => {
    event.preventDefault();
    projectFileStore(bannerR.current, imagesR.current, thumbnailR.current);

    handleBack();
  };
  const isUrlValid = (url: string, urlWebsite: string) => {
    return (
      !url.includes(" ") &&
      (url.startsWith("https://www." + urlWebsite) ||
        url.startsWith("https://" + urlWebsite) ||
        url.startsWith("http://" + urlWebsite) ||
        !url
      ));
  };

  const validateLink = (linkType: string, linkValue: string, linkSuffix: string) => {

    const errorMessages: { [key: string]: string } = {
      github: "Please make sure your link begins with https://github.com/...",
      codepen: "Please make sure your link begins with https://codepen.io/...",
      notion: "Please make sure your link begins with https://notion.so/...",
      codesandbox:
        "Please make sure your link begins with https://codesandbox.io/...",
      kaggle: "Please make sure your link begins with https://kaggle.com/...",
      deployedSite: "Please make sure your link is a website/URL. Format: https://(sitename).(suffix)/",
    };

    if (linkType && linkValue)    
    {
  
      if(linkType == "deployedSite") {
        if(!isUrlValid(linkValue, "")) {
          setLinkErrors((prevErrors) => ({
            ...prevErrors,
            [linkType]: errorMessages[linkType],
          }));
          return false;
        }
      } else if(!isUrlValid(linkValue, `${linkType}.${linkSuffix}/`)) {
        setLinkErrors((prevErrors) => ({
          ...prevErrors,
          [linkType]: errorMessages[linkType],
        }));
        
        return false;  
      } 
   
    }
    setLinkErrors((prevErrors) => ({
      ...prevErrors,
      [linkType]: "",
    }));
    return true;
  };
  const handleFileUpload = async (event: any) => {
    event.preventDefault();
    // handle file upload logic here
    if (projectLinks.length > 0) {
      const validations = projectLinks.map((option: any) => 
        validateLink(option.type, option.value, option.suffix));
    

      
      if (validations.every((isValid) => isValid)) {
        console.log('yay')
        await projectFileToUpload(
          bannerR.current,
          imagesR.current,
          thumbnailR.current,
          projectLinks
        );
        
        
        await handleUpload();
    
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
              value={
                banner
                  ? banner.name
                  : bannerR.current
                  ? bannerR.current.name
                  : ""
              }
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
              error={!!galleryImageError}
              helperText={galleryImageError ? galleryImageError : "Accepts: .jpg,.jpeg,.png,.svg,.gif,.bmp,.ico,.tiff"}
              value={
                images.length
                  ? `The number of files uploaded: ${images.length}`
                  : imagesR.current
                  ? `The number of files uploaded: ${imagesR.current.length}`
                  : ""
              }
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

          {/* Upload Project Card Image */}
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
              value={
                thumbnail
                  ? thumbnail.name
                  : thumbnailR.current
                  ? thumbnailR.current.name
                  : ""
              }
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
          <Grid item xs={12} sx={{ marginTop: 5 }}>
            <Typography variant="subtitle2" gutterBottom>
              Project Links
            </Typography>

            {projectLinks.map((option: any, index: any) => (
              <Grid item xs={12} key={index} sx={{ marginBottom: 2 }}>
                <TextField
                  sx={{ maxWidth: "450px" }}
                  key={option.type}
                  fullWidth
                  label={option.label}
                  value={option.value}
                  error={!!linkErrors[option.type]}
                  helperText={linkErrors[option.type]
                      ? linkErrors[option.type]
                      : ""
                  }
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
          <Button variant="contained" onClick={handleClickOpen} sx={{ mt: 3, ml: 1 }}>
            Next
          </Button>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          
          >
            <DialogTitle id="alert-dialog-title" sx={{paddingLeft: 5, paddingRight: 5, paddingTop: 5}}>
              {"Are you ready to submit your project?"}
            </DialogTitle>
            <DialogContent sx={{paddingLeft: 5, paddingRight: 5}}>
              <DialogContentText id="alert-dialog-description" >
                The information you have inputted will be used to create a project page. You will be redirected to the page
                shortly after submitting.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{paddingLeft: 5, paddingRight: 5, paddingBottom: 5}}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={(event) => {
                handleFileUpload(event); 
                handleClose();
                }}
                autoFocus>
                Submit
              </Button>
            </DialogActions>
          </Dialog>


        </Box>
      </Box>
    </React.Fragment>
  );
}
