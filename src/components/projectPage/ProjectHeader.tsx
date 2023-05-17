import { useContext, useState } from 'react';
import { Box, Stack, Typography, useTheme, Button, Chip, useMediaQuery } from '@mui/material'
import { ProjectContext } from '../../routes/ProjectPage';
import { useAuth } from '../../customHooks/useAuth';
import LikeBtn from './LikeBtn';
import EditButton from './EditButton';
import EditNameDialog from './dialogs/EditNameDialog';

interface ProjectHeaderProps {
  name: string
  blurb?: string
}

export default function ProjectHeader({ name, blurb }: ProjectHeaderProps) {

  const theme = useTheme();
  const auth = useAuth();
  const { project, setProject } = useContext(ProjectContext);
  const isScreenSmall = useMediaQuery(theme.breakpoints.down("md"));

  // Name states
  const [isHoverName, setIsHoverName] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);

  // Blurb states
  const [isHoverBlurb, setIsHoverBlurb] = useState(false);
  const [isBlurbDialogOpen, setIsBlurbDialogOpen] = useState(false);


  const handleNameEdit = () => {
    setIsNameDialogOpen(true);
    setIsHoverName(false);
  }

  const handleBlurbEdit = () => {

  }

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
    [theme.breakpoints.down("md")]: {
      flexDirection: 'column',
      justifyContent: 'normal',
      alignItems: 'start',
      gap: 3,
      mb: 2
    }
  }

  return (
    <>
      <EditNameDialog
        isOpen={isNameDialogOpen}
        setIsOpen={setIsNameDialogOpen}
        initialValue={name}
      />
      <Stack
        sx={headerStyle}
      >
        <Box>
          <Stack
            id="project-name-field"
            flexDirection={'row'}
            alignItems={'center'}
            onMouseEnter={() => setIsHoverName(true)}
            onMouseLeave={() => setIsHoverName(false)}
            mt={1}
          >
            <Typography
              variant="h1"
              color="black"
              fontWeight={600}
              alignSelf={'center'}
            >
              {name}
            </Typography>
            {!isScreenSmall &&
              auth.isAllowed(['admin'], project.members) &&
              <EditButton
                clickHandler={handleNameEdit}
                isShow={isHoverName}
                fontSize='medium'
              />
            }
          </Stack>

          <Typography
            component='p'
            variant='body2'
            fontSize={16}
            mt={1}
          >
            {blurb}
          </Typography>
        </Box>

        {<LikeBtn />}

      </Stack>

    </>
  )
}
