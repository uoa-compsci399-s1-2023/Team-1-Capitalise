import React, { useRef, useContext, useState } from 'react'

import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { styled, Button, Typography, useTheme, Box } from '@mui/material'
import { FormControl, OutlinedInput, InputLabel, FormHelperText } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import { ProjectContext } from '../../../routes/ProjectPage';
import EditButton from '../EditButton';


export default function TeamnameField() {

  const [isHovering, setIsHovering] = useState(false); // For showing edit button
  const [isOpen, setIsOpen] = React.useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { project, setProjectChanges } = useContext(ProjectContext)
  const [value, setValue] = useState<string>(project.teamname);
  const [error, setError] = useState<string>('');
  const theme = useTheme();


  const handleMouseIn = () => {
    setIsHovering(true);
  }

  const handleMouseOut = () => {
    setIsHovering(false);
  }

  const handleOpen = () => {
    setValue(project.teamname);
    setIsOpen(true);
  }

  // Team name can't be more than 30 characters
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 30) {
      setError('Please keep your teamname under 30 characters')
    } else {
      setError('')
    }
    setValue(e.target.value);
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    if (!error) {
      setProjectChanges({
        ['teamname']: value
      })
      setIsOpen(false);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Edit team name</DialogTitle>
        <DialogContent>
          <FormControl error={!!error} fullWidth>
            <OutlinedInput
              autoFocus
              id="category-edit-field"
              value={value}
              onChange={handleChange}
              type='text'
            />
            <FormHelperText id="component-error-text">{error}</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog >

      <Box
        width='100%'
        minHeight={'40px'}
        display='flex'
        flexDirection={'row'}
        alignItems={'center'}
        onMouseEnter={handleMouseIn}
        onMouseLeave={handleMouseOut}
      >
        <Typography fontWeight={400} minWidth={'100px'} mr={1} variant="body1">Team name:</Typography>
        <Typography flex={1} fontWeight={300} variant="body1">{project.teamname}</Typography>

        <EditButton clickHandler={handleOpen} isShow={isHovering}/>
      </Box>
    </>
  )
}
