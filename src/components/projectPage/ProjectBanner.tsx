import React, { useContext, useEffect, useState } from 'react'
import { ProjectContext } from '../../routes/ProjectPage'
import { Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import EditBannerDialog from './dialogs/EditBannerDialog';

export default function ProjectBanner() {

  const { project } = useContext(ProjectContext);
  const [isHover, setIsHover] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // useEffect(() => {

  // })

  return (
    <Box
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      position={'relative'}
      height={150}
      width={'100%'}
    >
      <EditBannerDialog {...{isDialogOpen, setIsDialogOpen}}/>
      <img
        src={project.banner}
        alt='Project cover photo'
        width={'100%'}
        height={'100%'}
        style={{
          objectFit: 'cover'
        }}
      />
      <Button
        variant="text"
        color="black"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        onClick={() => setIsDialogOpen(true)}
      >
        {isHover &&
          <Button
            startIcon={<EditIcon />}
            color='black'
            variant='outlined'
            disableRipple
          >
            Edit
          </Button>
        }
      </Button>
    </Box>
  )
}
