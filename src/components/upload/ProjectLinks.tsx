import styled from "@emotion/styled";
import { CollectionsBookmarkOutlined } from "@mui/icons-material";
import { FormControl, TextField, Grid, InputLabel, Select, MenuItem, Button, Typography, IconButton} from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import validator from 'validator';

const LinkForm = styled(FormControl)({
    marginBottom: 8,
    minWidth: 150,
    maxWidth: 300
    
  }
);

const SocialLinkField = styled(TextField)({
  marginLeft: 8,
  maxWidth: 250

}
);
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
  const [githubLinkError, setGitHubLinkError] = useState('');
  const [codepenLinkError, setcodepenLinkError] = useState('');
  const [codesandboxLinkError, setcodesandboxLinkError] = useState('');
  const [kaggleLinkError, setkaggleLinkError] = useState('');
  const [notionlinkError, setnotionLinkError] = useState('');

  console.log(selectedOptions[0].type);
  const handleLinkChange = (event, index) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index].value = event.target.value;
    setSelectedOptions(newSelectedOptions);
    handleProjectLinks(newSelectedOptions);
  };

  //
  //const handleAdd = (event: any) => {
    //event.preventDefault();
    //setSelectedOptions([...selectedOptions, {value: '', type: '' }]);
    
  //};
  //const handleRemove = (index: number) => {
    //const newSelectedOptions = [...selectedOptions];
    //newSelectedOptions.splice(index, 1);
    //setSelectedOptions(newSelectedOptions);
  //};

    //Validate the Links are appropriate
    const validateLinks = () => {
      for (const link of selectedOptions) {
        if(link.type == 'github') {
            if(!validator.matches(link.value, "https://github.com/")) {


            }
        }
  
      }
     
  
  
    }



  return (
    <Grid item xs={12}>
    <Typography variant="subtitle2" gutterBottom>
      Project Resources
    </Typography>

    {selectedOptions.map((option, index) => (
      <Grid item xs={12}>
      <SocialLinkField
        
        key={index}
        fullWidth
        label={options[index].label}
        defaultValue={option.value}
        value={option.value}
        onChange={(event) => handleLinkChange(event, index)}
      />
      </Grid>
    ))}
  </Grid>
        
    )
  {/*  <React.Fragment>
   
  
    {selectedOptions.map((selectedOption, index) => (
      <Grid item xs={12} key={index}>
        <LinkForm>
          <Select
            labelId={`select-label-${index}`}
            value={selectedOption.type}
            onChange={(event) => handleOptionChange(index, event)}
            autoWidth>
            {options.map((option) => (
              <MenuItem key={option.type} value={option.type}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
            </LinkForm> 
  
      {selectedOption.type !== '' &&  (
        <SocialLinkField
          fullWidth
          label="Insert a Link"
          defaultValue={selectedOption.value}
          value={selectedOption.value}
          onChange={(event) => handleTextChange(index, event)}
        />)}
     
      {selectedOptions.length > 1 && (
        <IconButton onClick={() => handleRemove(index)}>
          <DeleteIcon />
        </IconButton>
      )}
    </Grid>
  ))}
 
  {selectedOptions.length < 5 && ( <Button onClick={handleAdd}>Add more links  </Button>)}
    </Grid>
    

  </React.Fragment>  */}
  
}