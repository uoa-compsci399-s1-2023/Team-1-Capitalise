import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Autocomplete, Button, Chip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
const projectTags = [
  { tag: 'Mobile'},
  
];
export default function ProjectInfoForm() {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        1. Project Details
      </Typography>
      <Grid container spacing={2}>
      
        <Grid item xs={12}>
        <Typography variant="subtitle1">
        Project Name
        </Typography>
          <TextField
            required
            id="projectName"
            name="projectName"
           
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} >
        <Typography variant="subtitle1">
        Project Tags
        </Typography>
        <Autocomplete
        multiple
        id="tags-filled"
        options={projectTags.map((option) => option.tag)}
        freeSolo
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            
    
          />
        )}
      />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="projectDesc"
            name="projectDesc"
            label="Project Description"
            fullWidth
            variant="filled"
            
            multiline={true}
            rows={10}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">
          GitHub Repository
          </Typography>
          <TextField
            id="github"
            name="github"
            fullWidth
            
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">
          CodePen
          </Typography>
          <TextField
            id="github"
            name="github"
            fullWidth
            
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" gutterBottom>
        Attach a Project Banner
      </Typography>
        <label htmlFor="upload-banner">
            <input
              style={{ display: 'none' }}
              id="upload-banner"
              name="upload-banner"
              type="file"
            />

            <Button variant="contained" component="span">
              Upload button
            </Button>
          </label>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
            label="Use this address for payment details"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
