import React, { useContext, useEffect, useState, useRef } from 'react'
import { Box, Button, Typography, useTheme } from '@mui/material'
import TeamMember from '../TeamMember'
import { ProjectContext } from '../../../routes/ProjectPage'
import { TUser } from '../../../model/TUser';
import { getUser } from '../../../api/getUser';
import EditButton from '../EditButton';
import { useAuth } from '../../../customHooks/useAuth';
import RemoveUserConfirmDialog from '../dialogs/RemoveUserConfirmDialog';
import AddIcon from '@mui/icons-material/Add';
import TeamMembersDialog from '../dialogs/TeamMembersDialog';

export async function fetchUsers(members: string[] | {_id:string}[]) {
  // Some endpoints are returning an object for members
  if (typeof members[0] === 'object') {
    members = members.map((m: any) => m._id);
  }
  const promises: Promise<TUser | undefined>[] = []
  for (const mId of members) {
    promises.push(getUser(mId as string));
  }
  const results = await Promise.all(promises)
  return results.filter(e => e) as TUser[];
}

export default function MembersField() {

  const [isHover, setIsHover] = useState(false);
  const { project, checkIsEdit } = useContext(ProjectContext);
  const [members, setMembers] = useState<TUser[]>([]);
  const [userToDelete, setUserToDelete] = useState<TUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const auth = useAuth();
  const theme = useTheme();

  // Fetch users everytime project state changes
  useEffect(() => {
    if (project.members) {
      fetchUsers(project.members).then((users) => setMembers(users));
    }
  }, [project])

  const handleDelete = (user: TUser) => {
    setUserToDelete(user);
  }

  const handleOpenDialog = () => {
    setIsEditDialogOpen(true);
  }

  const handleMouseIn = () => {
    setIsHover(true);
  }

  const handleMouseOut = () => {
    setIsHover(false);
  }

  return (
    <Box
      width={'100%'} mt={1}
      onMouseEnter={handleMouseIn}
      onMouseLeave={handleMouseOut}
    >
      <TeamMembersDialog
        isDialogOpen={isEditDialogOpen}
        setIsDialogOpen={setIsEditDialogOpen}
        initialMembers={members}
        setMembers={setMembers}
      />

      <RemoveUserConfirmDialog
        isDialogOpen={!!userToDelete}
        setUserToDelete={setUserToDelete}
        user={userToDelete}
        setMembers={setMembers}
      />

      <Typography
        fontWeight={400}
        width={'100%'}
        flexWrap={'wrap'}
        variant="body1"
        mb={2}
      >
        Members ({members.length}):
      </Typography>

      <Box pl={1}>
        {members.map((m, i) => (
          <TeamMember
            key={i}
            name={m.name}
            avatar={m.profilePicture}
            userId={m._id}
            isDeletable={checkIsEdit() && project.members.length > 1}
            onDelete={() => handleDelete(m)}
          />
        ))}
        {checkIsEdit() &&
          <Button
            color='editBtnGrey'
            onClick={handleOpenDialog}
            fullWidth
            sx={{
              visibility: isHover ? 'visible' : 'hidden',
              ':hover': {
                backgroundColor: theme.customColors.DividerGrey
              }
            }}
          >
            <AddIcon />
          </Button>
        }
      </Box>



    </Box >
  )
}
