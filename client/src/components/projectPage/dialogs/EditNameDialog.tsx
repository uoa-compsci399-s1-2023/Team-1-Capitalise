import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, OutlinedInput } from '@mui/material'
import React, { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { ProjectContext } from '../../../routes/ProjectPage'

interface EditNameDialog {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  initialValue: string
}

export default function EditNameDialog({isOpen, setIsOpen, initialValue}: EditNameDialog) {

  const {project, setProjectChanges} = useContext(ProjectContext);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  
  useEffect(()=> {
    setValue(initialValue);
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false);
  } 

  const handleChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = evt.target.value;
    setValue(value);
    if (value.length > 30) {
      setError('Please project name under 30 characters')
    } else {
      setError('')
    }
  }

  const handleSave = () => {
    if (value && !error) {
      setProjectChanges({
        name: value
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
            id="category-edit-field"
            value={value}
            onChange={handleChange}
            type='text'
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} // Save if enter pressed
          />
          <FormHelperText id="component-error-text">{error}</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog >

  )
}
