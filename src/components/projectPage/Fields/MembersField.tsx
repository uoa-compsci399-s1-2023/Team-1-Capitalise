import React, { useContext, useEffect, useState, useRef } from 'react'
import { Box, Typography, emphasize } from '@mui/material'
import TeamMember from '../TeamMember'
import { ProjectContext } from '../../../routes/ProjectPage'
import { TUser } from '../../../model/TUser';
import { getUser } from '../../../api/getUser';
import EditButton from '../EditButton';
import { useAuth } from '../../../customHooks/useAuth';
import RemoveUserConfirmDialog from '../dialogs/RemoveUserConfirmDialog';

export default function MembersField() {

  const { project, setProject } = useContext(ProjectContext);
  const [members, setMembers] = useState<TUser[]>([]);
  // const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<TUser | null>(null);
  const auth = useAuth();
  // const userToDelete = useRef<TUser | null>(null);  

  // Fetch users everytime project state changes
  useEffect(() => {
    const promises: Promise<TUser | undefined>[] = []
    for (const mId of project.members) {
      promises.push(getUser(mId));
    }
    Promise.all(promises)
      .then((results) => setMembers(results.filter(e => e) as TUser[])) // Remove nulls
  }, [project])

  const handleDelete = (user: TUser) => {
    setUserToDelete(user);
  }

  return (
    <Box width={'100%'} mt={1}>
      <RemoveUserConfirmDialog
        isDialogOpen={!!userToDelete}
        setUserToDelete={setUserToDelete}
        user={userToDelete}
      />
      <Typography
        fontWeight={400}
        width={'100px'}
        variant="body1"
        mb={2}
      >
        Members ({members.length}):
      </Typography>

      {members.map((m, i) => (
        <TeamMember 
          key={i} 
          name={m.name} 
          avatar={m.profilePicture} 
          userId={m._id}
          isDeletable={auth.isAllowed(['admin'], project.members)}
          onDelete={() => handleDelete(m)}
        />
      ))}

    </Box>
  )
}
