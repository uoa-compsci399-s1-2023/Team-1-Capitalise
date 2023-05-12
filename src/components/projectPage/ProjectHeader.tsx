import { Box, Stack, Typography, useTheme, Button, Chip } from '@mui/material'

import { likeProject } from '../../api/likeProject';
import { ProjectContext } from '../../routes/ProjectPage';
import { useContext } from 'react';
import { useAuth } from '../../customHooks/useAuth';
import LikeBtn from './LikeBtn';
import AdminDeleteBtn from './AdminDeleteBtn';

interface ProjectHeaderProps {
  name: string
  blurb?: string
  likes: number
}

export default function ProjectHeader({ name, blurb, likes }: ProjectHeaderProps) {

  const theme = useTheme();
  const { project, setProject } = useContext(ProjectContext);
  const auth = useAuth();

  const isSmall = theme.breakpoints.down("md");


  const headerStyle = {
    padding: '0 20px',
    width: '100%',
    mt: 4,

    // Only apply in desktop mode
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 0,

    // Only apply in phone mode
    [isSmall]: {
      flexDirection: 'column',
      justifyContent: 'normal',
      alignItems: 'start',
      gap: 3,
      mb: 2
    }

  }

  return (
    <>
      <Stack

        sx={headerStyle}
      >
        <Box>
          <Typography
            variant="h1"
            color="initial"
            mt={1}
            fontWeight={600}
            alignSelf={'center'}
          >
            {name}
          </Typography>
          <Typography
            component='p'
            variant='body2'
            fontSize={16}
            mt={1}
          >
            {blurb}
          </Typography>
        </Box>

        <Box paddingRight={50}>
        { <LikeBtn /> }
        </Box>

        <Box paddingRight={12}>
        { <AdminDeleteBtn /> }
        </Box>

          {/* Design change, no more comment button */}
          {/* <Button
            variant='outlined'
            color='neutral'
            startIcon={<ChatOutlinedIcon />}
          >
            Comment
          </Button> */}

      </Stack>

    </>
  )
}
