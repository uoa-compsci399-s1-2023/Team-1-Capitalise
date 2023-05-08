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


export default function ProjectUploadFileForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadClick = () => {
    // handle file upload logic here
    console.log(selectedFile);
  };

 
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        2. Project Files
      </Typography>
      <Box component="form">
      <Grid container spacing={2}>
        {/* Upload Attach Banner */}
        <Grid item>
        <Typography variant="subtitle2" gutterBottom>
            Attach a Project Banner
          </Typography>
        </Grid>
        <Grid item xs={10} >
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleFileChange} 
          />
          <FileInputField
            disabled
            value={selectedFile ? selectedFile.name : ''}
            fullWidth
          />
          
        </Grid>
        <Grid item xs={12}> <label htmlFor="fileInput">
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
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleFileChange} 
            
          />
          <FileInputField
            disabled
            value={selectedFile ? selectedFile.name : ''}
            fullWidth
          />
          
        </Grid>
        <Grid item xs={12}> <label htmlFor="fileInput">
            <Button variant="contained" component="span" size="small">
              Select files
            </Button>
          </label></Grid>
    

        <ProjectLinksForm/>


      
      </Grid>
      </Box>
      
    </React.Fragment>
  );
}
