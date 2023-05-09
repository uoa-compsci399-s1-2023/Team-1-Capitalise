import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, Chip, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, SelectChangeEvent, styled } from '@mui/material';
import { useState } from 'react';
import ProjectLinksForm from './ProjectLinks';
const projectTags = [
  { tag: 'Mobile'},
  
  
];

const FileInputField = styled(TextField) ({
  minWidth: 200,
  maxWidth: 350
})


export default function ProjectUploadFileForm({projectFileToUpload}: any, {handleBack}: any) {
  const [banner, setBanner] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const handleBannerFile = (event: any) => {
    setBanner(event.target.files[0]);
    
  };
  const handleProjectImages = (event: any) => {
    setImages(Array.from(event.target.files));
    
  };
  const handleThumbnail= (event: any) => {
    setThumbnail(event.target.files[0]);
    
  };

  const handleUpload = () => {
    // handle file upload logic here
    projectFileToUpload(banner, images, thumbnail);
  };

 
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        2. Project Files
      </Typography>
      <Box component="form" noValidate onSubmit={handleUpload}>
      <Grid container spacing={2}>
        {/* Upload Attach Banner */}
        <Grid item>
        <Typography variant="subtitle2" gutterBottom>
            Upload a Project Banner
          </Typography>
        </Grid>
        <Grid item xs={10} >
          <input
            type="file"
            id="bannerInput"
            style={{ display: 'none' }}
            onChange={handleBannerFile} 
          />
          <FileInputField
            disabled
            value={banner ? banner.name : ''}
            fullWidth
          />
          
        </Grid>
        <Grid item xs={12}> <label htmlFor="bannerInput">
            <Button variant="contained" component="span" size="small">
              Select file
            </Button>
          </label></Grid>
      
        
        {/* Upload Images for Page */}
        <Grid item>
        <Typography variant="subtitle2">
            Upload any Project images
          </Typography>
        </Grid>
        <Grid item xs={12} >
          <input
            type="file"
            id="projectImagesInput"
            multiple
            style={{ display: 'none' }}
            onChange={handleProjectImages} 
            
            
          />
          <FileInputField
            disabled
            value={images ? "Successful" : ''}
            fullWidth
          />
          
        </Grid>
        <Grid item xs={12}> <label htmlFor="projectImagesInput">
            <Button variant="contained" component="span" size="small">
              Select files
            </Button>
          </label></Grid>
    
         {/* Upload Images for Page */}
         <Grid item>
          <Typography variant="subtitle2">
              Upload a Project Card image
          </Typography>
        </Grid>
        <Grid item xs={12} >
          <input
            type="file"
            id="projectCardImageInput"
            style={{ display: 'none' }}
            onChange={handleThumbnail} 
            
          />
          <FileInputField
            disabled
            value={thumbnail? thumbnail.name : ''}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}> <label htmlFor="projectCardImageInput">
            <Button variant="contained" component="span" size="small">
              Select file
            </Button>
          </label></Grid>

        {/*Project Links Component*/}
        <ProjectLinksForm/>      

      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" sx={{ mt: 3, ml: 1 }} 
            onClick={()=>handleBack()}
            >Back</Button>
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
