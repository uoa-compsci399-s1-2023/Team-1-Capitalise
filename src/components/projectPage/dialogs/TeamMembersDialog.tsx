import React, { SetStateAction, useContext, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, FormHelperText, TextField } from '@mui/material'
import { TUser } from '../../../model/TUser'
import { ProjectContext } from '../../../routes/ProjectPage'
import { addUserToProject } from '../../../api/addUserToProject'
import TeamMember from '../TeamMember'


interface TextBlockDialogProps {
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<SetStateAction<boolean>>
  initialMembers: TUser[]
}

export default function TeamMembersDialog({ isDialogOpen, setIsDialogOpen, initialMembers }: TextBlockDialogProps) {

  const [currMembers, setCurrMembers] = useState<TUser[]>([]);
  const [newMembers, setNewMembers] = useState<TUser[]>([]);
  const { project, setProjectChanges } = useContext(ProjectContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrMembers(initialMembers);
    setNewMembers([]);
  }, [isDialogOpen])

  const handleClose = () => {
    setIsDialogOpen(false);
  }

  // Only close once all members have been added
  const handleSave = () => {
    setIsLoading(true);
    const promises: Promise<Response>[] = []
    newMembers.forEach(user => {
      promises.push(addUserToProject(project._id, user._id));
    })
    Promise.all(promises).finally(() => {
      setIsLoading(false);
      setIsDialogOpen(false);
    })
  }

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      fullWidth
      maxWidth='lg'
      PaperProps={{ sx: { p: 2 } }}
    >

      <DialogTitle>Edit Team Members</DialogTitle>
      <DialogContent
      >
        {currMembers.map((m, i) => (
          <TeamMember key={i} name={m.name} avatar={m.profilePicture} userId={m._id} />
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog >

  )
}
