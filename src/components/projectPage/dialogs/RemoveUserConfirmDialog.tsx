import React, { SetStateAction, useContext, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, FormHelperText, TextField, Typography, Stack, CircularProgress } from '@mui/material'
import { TUser } from '../../../model/TUser'
import { ProjectContext } from '../../../routes/ProjectPage'
import { addUserToProject } from '../../../api/addUserToProject'
import TeamMember from '../TeamMember'
import { removeUserFromProject } from '../../../api/removeUserFromProject'
import { useAuth } from '../../../customHooks/useAuth'


interface TextBlockDialogProps {
  isDialogOpen: boolean
  setUserToDelete: React.Dispatch<SetStateAction<TUser | null>>
  user: TUser | null
}

export default function RemoveUserConfirmDialog({ isDialogOpen, setUserToDelete, user }: TextBlockDialogProps) {

  const [isLoading, setIsLoading] = useState(false);
  const { project, setProject } = useContext(ProjectContext);
  const auth = useAuth();

  const handleClose = () => {
    setUserToDelete(null);
  }

  // Only close once member has been removed
  const handleSave = () => {
    if (user) {
      setIsLoading(true);
      removeUserFromProject(project._id, user._id, auth.getToken() as string)
        .then((resp) => {
          if (resp.ok) {
            resp.json().then((data) => {setProject(data)});
          } else {
            resp.text().then((err) => console.log(err));
          }
        }).finally(() => {
          setIsLoading(false);
          setUserToDelete(null);
        })
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      fullWidth
      maxWidth='md'
      PaperProps={{ sx: { p: 2 } }}
    >

      {isLoading ?
        <Stack
          width={'100%'}
          height={'100%'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <CircularProgress color='primary' />
        </Stack>
        :
        <>
          <DialogTitle>Are you sure you want to remove {user?.name} from {project.name}?</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={handleSave}>Yes</Button>
          </DialogActions>
        </>
      }

    </Dialog >

  )
}
