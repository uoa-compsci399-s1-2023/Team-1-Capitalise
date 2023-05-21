import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { getBadges } from '../../../api/getBadges';
import { TParameter } from '../../../model/TParameter';
import { ProjectContext } from '../../../routes/ProjectPage';
import LoadingDialog from './LoadingDialog';

interface EditAwardDialogProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export default function EditAwardDialog({ isOpen, setIsOpen }: EditAwardDialogProps) {

  const [value, setValue] = useState('No badge'); // For onchange input validation
  const [badges, setBadges] = useState<TParameter[]>([])
  const { project, setProjectChanges } = useContext(ProjectContext);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getBadges()
    .then((resp) => {
      if (resp.ok) {
        resp.json().then((data) => setBadges(data))
      } else {
        resp.text().then((err) => console.log(err))
      }
    });
    if (project.badges) {
      setValue(project.badges._id)
    }
  }, [isOpen])

  function handleChange(e: SelectChangeEvent<string>): void {
    setValue(e.target.value);
  }

  function handleClose(): void {
    setIsOpen(false);
  }

  function handleSave(): void {
    if (value === "No badge") {
      setProjectChanges({
        badges: null
      });
    } else {
      const badge = badges.find((b) => b._id === value)
      if (badge) {
        setProjectChanges({
          badges: badge.value
        })
      }
    }
    setIsOpen(false);
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Edit Award</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <Select
              value={value}
              onChange={handleChange}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '250px'
                  }
                }
              }}
            >
              <MenuItem 
                key={"No badge"} 
                value={"No badge"}
                color='black'
              >
                {"No Award"}</MenuItem>
              {
                badges.map(
                  (b, i) => <MenuItem key={b._id} value={b._id}>{b.value}</MenuItem>
                )}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog >
    </>
  )
}
