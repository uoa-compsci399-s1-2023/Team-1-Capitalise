import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, OutlinedInput } from '@mui/material'
import React, { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { ProjectContext } from '../../../routes/ProjectPage'

interface EditTabDialogProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  // initialValue: string
  tabIndex: number
}

export default function EditTabNameDialog({isOpen, setIsOpen, tabIndex}: EditTabDialogProps) {

  const {project, setProjectChanges} = useContext(ProjectContext);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  
  useEffect(()=> {
    setValue(project.content[tabIndex].tabName);
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false);
  } 

  const handleChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = evt.target.value;
    setValue(value);
    if (value.length > 15) {
      setError('Please keep tab names under 15 characters')
    } else {
      setError('')
    }
  }

  const handleSave = () => {
    if (value && !error) {
      project.content[tabIndex].tabName = value
      setProjectChanges({
        content: project.content
      })
    }
    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>Edit Project Name</DialogTitle>
      <DialogContent>
        <FormControl error={!!error} fullWidth>
          <OutlinedInput
            autoFocus
            value={value}
            onChange={handleChange}
            type='text'
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} // Save if enter pressed
          />
          <FormHelperText>{error}</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog >

  )
}
