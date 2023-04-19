import React, { useRef, useContext, useState } from 'react'

import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { styled, Button, Typography, useTheme, Box } from '@mui/material'
import { FormControl, OutlinedInput, InputLabel, FormHelperText } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import { ProjectContext } from '../ProjectPage';


export default function TeamnameField() {

  const [isOpen, setIsOpen] = React.useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { project, setProject } = useContext(ProjectContext)
  const [value, setValue] = useState<string>(project.teamname);
  const [error, setError] = useState<string>('');
  const theme = useTheme();

  const EditButton = styled(Button)({
    height: "100%",
    visibility: 'hidden',
    flex: '1',
    ':hover': {
      backgroundColor: theme.customColors.DividerGrey
    }
  });

  const handleMouseIn = () => {
    btnRef.current && (btnRef.current.style.visibility = 'visible');
  }

  const handleMouseOut = () => {
    btnRef.current && (btnRef.current.style.visibility = 'hidden');
  }

  const handleOpen = () => {
    setValue(project.teamname);
    setIsOpen(true);
  }

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
      setProject({
        ...project,
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
        <DialogTitle>Edit category</DialogTitle>
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
        display='flex'
        flexDirection={'row'}
        alignItems={'center'}
        onMouseEnter={handleMouseIn}
        onMouseLeave={handleMouseOut}
      >
        <Typography fontWeight={400} width={'100px'} variant="body1">Teamname:</Typography>
        <Typography width={140} fontWeight={300} variant="body1">{project.teamname}</Typography>

        <EditButton
          ref={btnRef}
          onClick={handleOpen}
          color='editBtnGrey'
        >
          <EditIcon fontSize='small' />
        </EditButton>
      </Box>
    </>
  )
}
