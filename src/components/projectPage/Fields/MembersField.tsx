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


export default function MembersField() {

  const [isHover, setIsHover] = useState(false);
  const { project, setProject } = useContext(ProjectContext);
  const [members, setMembers] = useState<TUser[]>([]);
  const [userToDelete, setUserToDelete] = useState<TUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const auth = useAuth();
  const theme = useTheme();

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
      />

      <RemoveUserConfirmDialog
        isDialogOpen={!!userToDelete}
        setUserToDelete={setUserToDelete}
        user={userToDelete}
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

      {auth.isAllowed(['admin'], project.members) &&
        < Button
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

    </Box >
  )
}
