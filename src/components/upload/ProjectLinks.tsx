import styled from "@emotion/styled";
import { CollectionsBookmarkOutlined } from "@mui/icons-material";
import { FormControl, TextField, Grid, InputLabel, Select, MenuItem, Button, Typography, IconButton} from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import validator from 'validator';

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
];
export default function ProjectLinksForm({handleProjectLinks}: any) {

  const [selectedOptions, setSelectedOptions] = useState(
    options.map((option) => ({ value: '', type: option.type }))
  );
  const [githubLinkError, setgithubLinkError] = useState('');
  const [codepenLinkError, setcodepenLinkError] = useState('');
  const [codesandboxLinkError, setcodesandboxLinkError] = useState('');
  const [kaggleLinkError, setkaggleLinkError] = useState('');
  const [notionlinkError, setnotionLinkError] = useState('');

  console.log(selectedOptions[0].type);
  const handleLinkChange = (event: any, index: any) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index].value = event.target.value;
    setSelectedOptions(newSelectedOptions);
    handleProjectLinks(newSelectedOptions);
  };


    //Validate the Links are appropriate
    const validateLinks = () => {
      for (const link of selectedOptions) {
        if(link.type == 'github') {
            if(!validator.matches(link.value, "https://github.com/")) {
              setgithubLinkError('Please make sure your link begins with https://github.com/...')
            } else {
              setgithubLinkError('');
            }
        
        } else if (link.type == 'codepen') {
            if(!validator.matches(link.value, "https://codepen.io/")) {
                setcodepenLinkError('Please make sure your link begins with https://codepen.io/...')
              } else {
                setcodepenLinkError('');
              }
        } else if (link.type == 'notion') {
            if(!validator.matches(link.value, "https://notion.so/")) {
              setnotionLinkError('Please make sure your link begins with https://notion.so/...')
            } else {
              setnotionLinkError('');
            }
        } else if (link.type == 'codesandbox') {
            if(!validator.matches(link.value, "https://codesandbox.io")) {
              setcodesandboxLinkError('Please make sure your link begins with https://codesandbox.io/...')
            } else {
              setcodesandboxLinkError('');
            }
        } else {
            if(!validator.matches(link.value, "https://kaggle.com/")) {
              setkaggleLinkError('Please make sure your link begins with https://kaggle.com/...')
            } else {
              setkaggleLinkError('');
            }
  
      }
    }
     
  
  
    }

  return (
    <Grid item xs={12} sx={{marginTop: 5}}>
    <Typography variant="subtitle2" gutterBottom>
      Project Links
    </Typography>

    {selectedOptions.map((option, index) => (
      <Grid item xs={12} key={index}>
      <TextField sx={{marginBottom: 3, maxWidth: '450px'}}       
        key={option.type}
        fullWidth
        label={option.type.charAt(0).toUpperCase() + option.type.slice(1).toLowerCase()}
        defaultValue={option.value}
        value={option.value}
        error={!!`${option.type}LinkError`}
        helperText={`${option.type}LinkError` ? `${option.type}LinkError` : ''}
        onChange={(event) => handleLinkChange(event, index)}
      />
      </Grid>
    ))}
  </Grid>    
    )
}