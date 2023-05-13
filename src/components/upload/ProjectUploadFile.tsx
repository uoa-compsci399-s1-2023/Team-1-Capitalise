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
import { useState } from "react";
import ProjectLinksForm from "./ProjectLinks";
const projectTags = [{ tag: "Mobile" }];

const FileInputField = styled(TextField)({
  minWidth: 200,
  maxWidth: 450,
});

export default function ProjectUploadFileForm(
  { projectFileToUpload, projectLinkToUpload, handleBack }: any

) {
  // need to look at this again to see if we need to set it back to File, if null is giving us trouble bellow.
  // const [banner, setBanner] = useState(null);
  const [banner, setBanner] = useState<
    File | undefined
  >();

  // const [thumbnail, setThumbnail] = useState(null);
  const [thumbnail, setThumbnail] = useState<
    File | undefined
  >();

  const [images, setImages] = useState<File[]>([]);

  const [projectLinks, setProjectLinks] = useState([]);

  const handleBannerFile = (event: any) => {
    event.preventDefault();
    setBanner(event.target.files[0]);
    //console.log(event.target.files[0]);
  };

  const handleProjectImages = (event: any) => {
    event.preventDefault();
    if (Array.from(event.target.files).length > 5) {
      alert(`Only 5 files are allowed to upload.`);
      return;
    }
    setImages(Array.from(event.target.files));
  };

  const handleThumbnail = (event: any) => {
    event.preventDefault();
    setThumbnail(event.target.files[0]);
    //console.log("Thumbnail from form:", thumbnail);
  };
  const handleProjectLinks = (projLinksFromChild: any) => {
    setProjectLinks(projLinksFromChild);
    projectLinkToUpload (projectLinks);

    //console.log("Project links from form:", projectLinks);
  };

  const handleUpload = (event: any) => {
    event.preventDefault();
    // handle file upload logic here
    projectFileToUpload(banner, images, thumbnail);
  };  


  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        2. Project Files
      </Typography>
      <Box component="form" noValidate onSubmit={handleUpload}>
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
              value={banner ? banner.name : ""}
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
              helperText="*Select images you would like to feature on the gallery"
              value={
                images.length
                  ? `The number of files uploaded: ${images.length}`
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
              value={thumbnail ? thumbnail.name : ""}
              fullWidth
              helperText="*What people see when looking for your project!"
            />
          </Grid>
          <Grid item xs={12}>
            {" "}
            <label htmlFor="projectCardImageInput">
              <Button variant="contained" component="span" size="small">
                Select file
              </Button>
            </label>
          </Grid>

          {/*Project Links Component*/}
          <ProjectLinksForm handleProjectLinks={handleProjectLinks}/>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="button"
            variant="outlined"
            sx={{ mt: 3, ml: 1 }}
            onClick={handleBack}
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
