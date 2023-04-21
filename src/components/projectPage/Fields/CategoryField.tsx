import React, { useRef, useContext, useState } from 'react'

import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select } from '@mui/material';
import { styled, Button, Typography, useTheme, Box } from '@mui/material'
import { FormControl, MenuItem, InputLabel, SelectChangeEvent } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import { ProjectContext } from '../ProjectPage';
import useSearchParams from '../../../customHooks/useSearchParams';

export default function CategoryField() {

  const [isOpen, setIsOpen] = React.useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { project, setProject } = useContext(ProjectContext)
  const [value, setValue] = useState<string>(project.category.value);
  const theme = useTheme();
  const searchParams = useSearchParams();

  const EditButton = styled(Button)({
    height: "100%",
    visibility: 'hidden',
    paddingLeft: '0',
    paddingRight: '0',
    minWidth: '64px',
    marginLeft: '5px',
    ':hover': {
      backgroundColor: theme.customColors.DividerGrey
    }
  });

  const handleMouseIn = () => {
    console.log('in')
    btnRef.current && (btnRef.current.style.visibility = 'visible');
  }

  const handleMouseOut = () => {
    console.log('out')
    btnRef.current && (btnRef.current.style.visibility = 'hidden');
  }

  const handleOpen = () => {
    setValue(project.category.value);
    setIsOpen(true);
  }

  const handleChange = (e: SelectChangeEvent<any>) => {
    setValue(e.target.value);
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    setProject({
      ...project,
      ['category']: { value: value }
    })
    setIsOpen(false);
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
          <FormControl fullWidth>
            <Select
              id="category-select"
              value={value}
              onChange={handleChange}
            >
              { // Skip index 0, which has the default category.
              searchParams.category.slice(1).map(
                (c, i) => <MenuItem key={i} value={c.value}>{c.value}</MenuItem>
              )}
            </Select>
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
        <Typography fontWeight={400} minWidth={'100px'} mr={1} variant="body1">Category:</Typography>
        <Typography flex={1} fontWeight={300} variant="body1">{project.category.value}</Typography>

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
