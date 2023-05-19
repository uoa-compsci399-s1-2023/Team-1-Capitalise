import React, { useRef, useContext, useState, useEffect } from 'react'

import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select } from '@mui/material';
import { styled, Button, Typography, useTheme, Box } from '@mui/material'
import { FormControl, MenuItem, InputLabel, SelectChangeEvent } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import { ProjectContext } from '../../../routes/ProjectPage';
import useSearchParams from '../../../customHooks/useSearchParams';
import EditButton from '../EditButton';
import { searchFilterParams, TAvailParameters, fetchCurrentParameters } from "../../search/AvailableParams";
import { useAuth } from '../../../customHooks/useAuth';


export default function SemesterField() {

  const [isHovering, setIsHovering] = useState(false); // For showing edit button
  const [isOpen, setIsOpen] = useState(false);
  const { project, setProjectChanges } = useContext(ProjectContext);
  const [value, setValue] = useState<string>('');
  const theme = useTheme();
  const auth = useAuth();

  useEffect(() => {
    fetchCurrentParameters()
  }, [])

  const handleMouseIn = () => {
    if (auth.user && auth.isAllowed(['admin'], project.members)) {
      setIsHovering(true);
    }
  }

  const handleMouseOut = () => {
    setIsHovering(false);
  }

  const handleOpen = () => {
    setValue(project.semester.value);
    setIsOpen(true);
    setIsHovering(false);
  }

  const handleChange = (e: SelectChangeEvent<any>) => {
    setValue(e.target.value);
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    setProjectChanges({
      ['semester']: value,
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
        <DialogTitle>Edit Semester</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <Select
              id="semester-select"
              value={value}
              onChange={handleChange}
            >
              { // Skip index 0, which has the default category.
                searchFilterParams.semester.slice(1).map(
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
        minHeight={'40px'}
        flexDirection={'row'}
        alignItems={'center'}
        onMouseEnter={handleMouseIn}
        onMouseLeave={handleMouseOut}
      >
        <Typography fontWeight={400} minWidth={'100px'} mr={1} variant="body1">Semester:</Typography>
        <Typography flex={1} fontWeight={300} variant="body1">{project.semester.value}</Typography>

        {auth.isAllowed(['admin'], project.members) &&
          <EditButton clickHandler={handleOpen} isShow={isHovering} fontSize='small' />
        }
      </Box>
    </>
  )
}
