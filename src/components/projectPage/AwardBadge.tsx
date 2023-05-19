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
  badgeId: string | null
}


export default function AwardBadge({ badgeId }: AwardBadgeProps) {

  const [badge, setBadge] = useState<TParameter | null>(null);
  const [isHover, setIsHover] = useState(false);
  const { checkIsAdminEdit } = useContext(ProjectContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const auth = useAuth();
  const theme = useTheme();

  useEffect(() => {
    if (badgeId) {
      getBadgeById(badgeId)
        .then(badge => {
          if (badge) {
            setBadge(badge);
          }
        })
    } else {
      setBadge(null);
    }
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
        <Stack my={2}>
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
                // position: 'absolute',
                // top: 0,
                // left: 0,
                // width: '100%',
                // height: '100%',
                // justifyContent: 'end',
                mx: 2,
                mt: 2
              }}
              variant='outlined'
              color='black'
              onClick={() => setIsDialogOpen(true)}
            >
              Change Award
            </Button>
            // /* </Tooltip> *//
          }
        </Stack>

      </Stack>
  } else if (checkIsAdminEdit()) {
    badgeContent =
      <Button
        variant='outlined'
        onClick={() => setIsDialogOpen(true)}
        sx={{
          mx: 2
        }}
      >
        Add Award
      </Button>
  }


  return (
    <>
      <EditAwardDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />
      {badgeContent}
    </>
  )
}
