import React, { useRef, useContext, useState, useEffect } from 'react'

import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, useMediaQuery } from '@mui/material';
import { styled, Button, Typography, useTheme, Box } from '@mui/material'
import { FormControl, MenuItem, InputLabel, SelectChangeEvent } from '@mui/material'
import { ProjectContext } from '../../../routes/ProjectPage';
import useSearchParams from '../../../customHooks/useSearchParams';
import EditButton from '../EditButton';
import { TProject } from '../../../model/TProject';
import { TProjectPost } from '../../../model/TPostProject';
import { searchFilterParams, TAvailParameters, fetchCurrentParameters } from "../../search/AvailableParams";
import { useAuth } from '../../../customHooks/useAuth';


export default function CategoryField() {

  const { project, setProjectChanges, checkIsEdit } = useContext(ProjectContext) // Project context

  const [isHovering, setIsHovering] = useState(false); // For showing edit button
  const [isOpen, setIsOpen] = React.useState(false); // For opening dialog box
  const [value, setValue] = useState<string>(''); // For onchange input validation
  const theme = useTheme();
  const auth = useAuth();

  useEffect(() => {
    fetchCurrentParameters()
  }, [])

  const handleMouseIn = () => {
    setIsHovering(true);
  }

  const handleMouseOut = () => {
    setIsHovering(false);
  }

  const handleOpen = () => {
    setIsHovering(false);
    setValue(project.category.value);
    setIsOpen(true);
  }

  const handleChange = (e: SelectChangeEvent<any>) => {
    setValue(e.target.value);
  }

  const handleClose = (evt: React.SyntheticEvent, reason: string = '') => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    setIsOpen(false);
  };

  const handleSave = () => {
    setProjectChanges({
      ['category']: value as TProjectPost['category']
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
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <Select
              id="category-select"
              value={value}
              onChange={handleChange}
            >
              { // Skip index 0, which has the default category.
                searchFilterParams.category.slice(1).map(
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
        minHeight={'40px'}
        display='flex'
        flexDirection={'row'}
        alignItems={'center'}
        mt={2}
        onMouseEnter={handleMouseIn}
        onMouseLeave={handleMouseOut}
      >
        <Typography fontWeight={400} minWidth={'100px'} mr={1} variant="body1">Category:</Typography>
        <Typography
          flex={1}
          fontWeight={300}
          variant="body1"
          sx={{wordBreak: "break-all"}}
        >
          {project.category.value}
        </Typography>

        {checkIsEdit() &&
          <EditButton clickHandler={handleOpen} isShow={isHovering} fontSize='small' />
        }
      </Box>
    </>
  )
}
