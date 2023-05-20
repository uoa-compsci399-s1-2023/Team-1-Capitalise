import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { Typography, Stack, useTheme, Box, Button, Tooltip } from '@mui/material'
import { TParameter } from '../../model/TParameter'
import { getBadgeById } from '../../api/getBadges'
import EditButton from './EditButton'
import EditIcon from '@mui/icons-material/Edit'
import EditAwardDialog from './dialogs/EditAwardDialog'
import { useAuth } from '../../customHooks/useAuth'
import { ProjectContext } from '../../routes/ProjectPage'


interface AwardBadgeProps {
  badgeId: string
}


export default function AwardBadge({ badgeId }: AwardBadgeProps) {

  const [badge, setBadge] = useState<TParameter | null>(null);
  const [isHover, setIsHover] = useState(false);
  const { checkIsAdminEdit } = useContext(ProjectContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const auth = useAuth();
  const theme = useTheme();

  useEffect(() => {
    getBadgeById(badgeId)
      .then(badge => {
        if (badge) {
          setBadge(badge);
        }
      })
  }, [badgeId])

  let badgeContent: ReactNode = null

  if (badge) {
    badgeContent =
      <Stack
        flexDirection={'row'}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        width={'100%'}
        justifyContent={'center'}
        position={'relative'}
      >
        <EditAwardDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
        />
        <Stack my={2} flex={1}>
          <img
            src={badge.image}
            width={'80'}
            style={{ margin: '0 auto' }}
          />
          <Typography
            mt={2}
            textAlign={'center'}
            sx={{
              color: badge.gradient ? badge.gradient[0] : 'black'
            }}
          >
            {badge.value}
          </Typography>

        {checkIsAdminEdit() &&
            // <Tooltip title="Edit Award">
            <Button
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                justifyContent: 'end',
                // pr: 2,
              }}
              color='neutral'
              onClick={() => setIsDialogOpen(true)}
            >
              {/* <EditIcon
                fontSize='small'
                sx={{
                  color: theme.palette.editBtnGrey.main,
                }}
              /> */}
            </Button>
            // /* </Tooltip> *//
          }
        </Stack>
      </Stack>
      
  } else if (checkIsAdminEdit()) {
    badgeContent =
      <Button>
        Add Award
      </Button>
  }


  return badgeContent
}
