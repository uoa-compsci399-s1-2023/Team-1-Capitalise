import styled from "@emotion/styled";
import { CollectionsBookmarkOutlined } from "@mui/icons-material";
import { FormControl, TextField, Grid, InputLabel, Select, MenuItem, Button, Typography } from "@mui/material";
import React, { useState } from "react";


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
  const [selectedOptions, setSelectedOptions] = useState([{ value: '', type: '' }]);
  const handleOptionChange = (index:any, event:any) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index].type = event.target.value;
    setSelectedOptions(newSelectedOptions);
  };
  const handleTextChange = (index:any, event:any) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index].value = event.target.value;
    setSelectedOptions(newSelectedOptions);
    handleProjectLinks(selectedOptions);
  };

  const handleAdd = (event: any) => {
    event.preventDefault();
    setSelectedOptions([...selectedOptions, {value: '', type: '' }]);
    
  };

  return (
    <React.Fragment>
        
  <Grid item xs={12}>
  <Typography variant="subtitle2" gutterBottom>
        Project Resources
      </Typography>
    {selectedOptions.map((selectedOption, index) => (
    <Grid item xs={12} key={index}>
      <LinkForm>
        <Select
          labelId={`select-label-${index}`}
          value={selectedOption.type}
          onChange={(event) => handleOptionChange(index, event)}
          autoWidth
        >
          {options.map((option) => (
            <MenuItem key={option.type} value={option.type}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </LinkForm>

      {selectedOption.type !== '' && (
        <SocialLinkField
          fullWidth
          label="Insert a Link"
          value={selectedOption.value}
          onChange={(event) => handleTextChange(index, event)}
        />
      )}
    </Grid>
    
    
  ))}

  
<Button onClick={handleAdd}>Add more links  </Button>
    </Grid>

  </React.Fragment>
  )
}