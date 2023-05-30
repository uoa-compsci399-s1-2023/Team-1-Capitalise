import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, OutlinedInput } from '@mui/material'
import React, { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { ProjectContext } from '../../../routes/ProjectPage'

interface EditTabDialogProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  // initialValue: string
  tabIndex?: number
  mode?: 'edit' | 'create'
}

export default function EditTabNameDialog({isOpen, setIsOpen, tabIndex}: EditTabDialogProps) {

  const {project, setProjectChanges} = useContext(ProjectContext);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  
  useEffect(()=> {
    if (tabIndex) {
      setValue(project.content[tabIndex].tabName);
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false);
  } 

  const handleChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = evt.target.value;
    setValue(value);
    
    const uniqueCheck = () => {
      const tabNames = project.content.map(tab => tab.tabName)
      const index = tabNames.indexOf(value);
      if (index > -1 && index != tabIndex) {
        return false;
      }
      return true;
    }

    const allowedRegex = /[^a-zA-Z0-9 ]/
    if (value.length > 30) {
      setError('Please keep tab names under 15 characters')
    } else if (allowedRegex.test(value)) {
      setError('Tab names can only contain letters and spaces')
    } else if (!uniqueCheck()) {
      setError('Tab names must be unique')
    } else {
      setError('')
    }
  }

  const handleSave = () => {
    if (!value || error) {
      setError(error || 'Tab names can\'t be blank')
      return;
    }
		const content = JSON.parse(JSON.stringify(project.content))
    if (tabIndex === undefined) {
      // Create new tab and add empty text block
      content[content.length] = {
        tabName: value,
        tabContent: [
          {
            type: 'text',
            value: []
          }
        ]
      }
    }
    else {
      content[tabIndex].tabName = value
    }
    setProjectChanges({
      content: content
    })
    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>{tabIndex === undefined ? "Create" : "Edit"} Tab Name</DialogTitle>
      <DialogContent>
        <FormControl error={!!error} fullWidth>
          <OutlinedInput
            autoFocus
            value={value}
            onChange={handleChange}
            type='text'
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} // Save if enter pressed
          />
          <FormHelperText>{error || ' '}</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog >
  )
}
