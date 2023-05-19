import React, { useContext, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import ExternalLinkBtn from '../ExternalLinkBtn'
import { ProjectContext } from '../../../routes/ProjectPage'
import { useAuth } from '../../../customHooks/useAuth';
import EditButton from '../EditButton';
import LinksDialog from '../dialogs/LinksDialog';

export default function LinksField() {

  const { project, checkIsEdit } = useContext(ProjectContext);
  const auth = useAuth();
  const [isHovering, setIsHovering] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  }

  const mouseIn = () => {
    setIsHovering(true);
  }

  const mouseOut = () => {
    setIsHovering(false);
  }

  return (
    <Box
      mt={1}
      gap={2}
      onMouseEnter={mouseIn}
      onMouseLeave={mouseOut}
    >
      <LinksDialog
        {...{ isDialogOpen, setIsDialogOpen }}
      />

      <Stack flexDirection={'row'} alignItems={'center'} mb={2}>
        <Typography fontWeight={400} width={'50px'} flex={1} variant="body1" >Links:</Typography>
        {checkIsEdit() &&
          <EditButton clickHandler={handleDialogOpen} isShow={isHovering} fontSize='small' />
        }
      </Stack>
      <Stack
        gap={2}
        alignItems={'center'}
      >
        {project.links.map((link, i) => (
          <ExternalLinkBtn {...link} key={i} />
        ))}
      </Stack>
    </Box>
  )
}
