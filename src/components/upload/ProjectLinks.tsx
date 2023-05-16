import styled from "@emotion/styled";
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
    label: 'GitHub',
  },
  {
    value: 'codePen',
    label: 'CodePen',
  },
  {
    value: 'notion',
    label: 'Notion',
  },
  {
    value: 'codesandbox',
    label: 'CodeSandbox',
  },
  {
    value: 'kaggle',
    label: 'Kaggle',
  },
];
export default function ProjectLinksForm() {
  const [selectedOptions, setSelectedOptions] = useState([{ option: '', text: '' }]);
  const handleOptionChange = (index:any, event:any) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index].option = event.target.value;
    setSelectedOptions(newSelectedOptions);
  };
  const handleTextChange = (index:any, event:any) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index].text = event.target.value;
    setSelectedOptions(newSelectedOptions);
  };

  const handleAdd = () => {
    setSelectedOptions([...selectedOptions, { option: '', text: '' }]);
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
          value={selectedOption.option}
          onChange={(event) => handleOptionChange(index, event)}
          autoWidth
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label} {index}
            </MenuItem>
          ))}
        </Select>
      </LinkForm>

      {selectedOption.option !== '' && (
        <SocialLinkField
          fullWidth
          label="Insert a Link"
          value={selectedOption.text}
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