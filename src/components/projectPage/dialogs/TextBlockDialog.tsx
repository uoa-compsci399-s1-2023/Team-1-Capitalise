import React, { SetStateAction, useContext, useState, useEffect } from 'react'
import { TProject } from '../../../model/TProject'
import { Dialog, DialogContent, DialogTitle, FormControl, OutlinedInput, DialogActions, Button, FormHelperText, InputLabel, TextField } from '@mui/material'
import { ProjectContext } from '../../../routes/ProjectPage'


interface TextBlockDialogProps {
  tabIndex: number
  blockIndex: number
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<SetStateAction<boolean>>
  initialValue: string
}

export default function TextBlockDialog({ tabIndex, blockIndex, isDialogOpen, setIsDialogOpen, initialValue }: TextBlockDialogProps) {

  const { project, setProjectChanges } = useContext(ProjectContext);
  const [value, setValue] = useState(initialValue);
  const [subHeading, setSubHeading] = useState(project.content[tabIndex].tabContent[blockIndex].subHeading ?? '') // if undefined set to empty string
  const [valueError, setValueError] = useState('');
  const [headingError, setErrorHeading] = useState('');

  useEffect(() => {
    setValue(initialValue)
  }, [isDialogOpen])

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 2000) {
      setValueError('Please keep content under 2000 characters')
    } else {
      setValueError('')
    }
    setValue(e.target.value);
  }

  const handleSubHeadingChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const heading = e.target.value;
    if (heading.length > 100) {
      setErrorHeading('Please keep heading under 100 characters')
    } else {
      setErrorHeading('')
    }
    setSubHeading(e.target.value);
  }

  const handleSave = () => {
    if (!valueError && !headingError) {

      // Get current content, and change the required block value.
      const content: TProject['content'] = JSON.parse(JSON.stringify(project.content))
      if (value) {
        content[tabIndex].tabContent[blockIndex].value = [value,]
      } else {
        content[tabIndex].tabContent[blockIndex].value = []
      }
      if (subHeading.length > 0) {
        content[tabIndex].tabContent[blockIndex].subHeading = subHeading
      } else {
        content[tabIndex].tabContent[blockIndex].subHeading = undefined
      }

      setProjectChanges({
        ['content']: content
      })
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      fullWidth
      maxWidth='lg'
      PaperProps= {{sx: {p: 2}}}
    >

      <DialogTitle>Edit sub-heading</DialogTitle>
      <DialogContent
      >
        <TextField
          id='block-heading-edit'
          hiddenLabel
          placeholder='Enter sub-heading...'
          variant='outlined'
          error={!!headingError}
          helperText={headingError}
          value={subHeading}
          onChange={handleSubHeadingChange}
          onKeyDown={(e) => {if (e.key === 'Enter') handleSave()}} // Save if enter pressed
          fullWidth
          sx={{ mt: 1, mb: 1 }}
        />
      </DialogContent>

      <DialogTitle>Edit content</DialogTitle>
      <DialogContent>

        <TextField
          id='block-content-edit'
          hiddenLabel
          variant='outlined'
          error={!!valueError}
          helperText={valueError}
          value={value}
          onChange={handleValueChange}
          onKeyDown={(e) => {if (e.key === 'Enter') handleSave()}}
          fullWidth
          multiline
          sx={{ mt: 1, mb: 1 }}

        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog >

  )
}
