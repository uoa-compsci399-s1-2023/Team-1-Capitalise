import React, { useRef, useContext, useState } from 'react'

import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select } from '@mui/material';
import { styled, Button, Typography, useTheme, Box } from '@mui/material'
import { FormControl, MenuItem, InputLabel, SelectChangeEvent } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import { ProjectContext } from '../ProjectPage';
import useSearchParams from '../../../customHooks/useSearchParams';

export default function SemesterField() {

  const [isOpen, setIsOpen] = React.useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { project, setProject } = useContext(ProjectContext)
  const [value, setValue] = useState<string>(project.semester.value);
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
    setValue(project.semester.value);
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
      ['semester']: { value: value }
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
        <DialogTitle>Edit semester</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <Select
              id="semester-select"
              value={value}
              onChange={handleChange}
            >
              { // Skip index 0, which has the default category.
              searchParams.semester.slice(1).map(
                (s, i) => <MenuItem key={i} value={s.value}>{s.value}</MenuItem>
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
        <Typography fontWeight={400} minWidth={'100px'} mr={1} variant="body1">Semester:</Typography>
        <Typography flex={1} fontWeight={300} variant="body1">{project.semester.value}</Typography>

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
