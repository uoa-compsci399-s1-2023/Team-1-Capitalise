import React, { SetStateAction, useContext, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, FormHelperText, TextField, Typography, Stack, CircularProgress } from '@mui/material'
import { TUser } from '../../../model/TUser'
import { ProjectContext } from '../../../routes/ProjectPage'
import { addUserToProject } from '../../../api/addUserToProject'
import TeamMember from '../TeamMember'
import { removeUserFromProject } from '../../../api/removeUserFromProject'
import { useAuth } from '../../../customHooks/useAuth'
import LoadingDialog from './LoadingDialog'
import { fetchUsers } from '../Fields/MembersField'


interface TextBlockDialogProps {
  isDialogOpen: boolean
  setUserToDelete: React.Dispatch<SetStateAction<TUser | null>>
  user: TUser | null
  setMembers: React.Dispatch<SetStateAction<TUser[]>>
}

export default function RemoveUserConfirmDialog({ isDialogOpen, setUserToDelete, user, setMembers }: TextBlockDialogProps) {

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
            return resp.json();
          } else {
            resp.text().then((err) => console.log(err));
          }
        }).then((data) => {
          if (data) {
            fetchUsers(data.members).then(users => setMembers(users))
          }
          auth.getLatestUser(); // So that the upload button is enabled if user removes themselves.
        })
        .finally(() => {
          setIsLoading(false);
          setUserToDelete(null);
        })
    }
  }

  return (
    isLoading ? 
      <LoadingDialog isOpen={isLoading}/>
      :
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth='sm'
        PaperProps={{ sx: { p: 2 } }}
      >
        <DialogContent>
          <Typography sx={{wordBreak: 'break-all'}} variant='body1'>Are you sure you want to remove <strong>{user?.name}</strong> from <strong>{project.name}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleSave}>Yes</Button>
        </DialogActions>
      </Dialog >
  )
}
