import React, { useContext, useEffect, useState } from 'react'
import { ProjectContext } from '../../routes/ProjectPage'
import { Box, Button, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear'
import EditBannerDialog from './dialogs/EditBannerDialog';
import { getDefaultBanners, removeBanner } from '../../api/projectBannerApi';
import LoadingDialog from './dialogs/LoadingDialog';

export default function ProjectBanner() {

  const { project, setProject, checkIsEdit } = useContext(ProjectContext);
  const [isHover, setIsHover] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultBanners, setDefaultBanners] = useState<string[]>([])

  useEffect(() => {
    getDefaultBanners()
      .then(resp => {
        if (resp.ok) {
          resp.json().then(data => setDefaultBanners(data))
        } else {
          resp.text().then(err => console.log(err));
        }
      })
  }, [])

  const handleRemoveBanner = () => {
    setIsHover(false);
    const isConfirm = window.confirm("Are you sure you want to remove the project banner?");
    if (isConfirm) {
      setIsLoading(true);
      removeBanner(project._id)
        .then(resp => resp.json())
        .then(data => {
          if (data.msg) {
            console.log(data.msg);
          } else {
            setProject(data);
          }
        }).finally(() => {
          setIsLoading(false)
        })
    }
  }

  const checkIsDefaultBanner = () => {
    return defaultBanners.includes(project.banner)
  }

  return (
    <Box
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      position={'relative'}
      height={150}
      width={'100%'}
    >
      <LoadingDialog isOpen={isLoading} />

      <EditBannerDialog {...{ isDialogOpen, setIsDialogOpen }} />
      <img
        src={project.banner}
        alt='Project cover photo'
        width={'100%'}
        height={'100%'}
        style={{
          objectFit: 'cover'
        }}
      />
      {isHover && checkIsEdit() &&
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          }}
        >
          <Stack flexDirection={'row'} gap={2}>
            {!checkIsDefaultBanner() &&
              <Button
                startIcon={<ClearIcon />}
                color='black'
                variant='outlined'
                onClick={() => handleRemoveBanner()}
              >
                Remove
              </Button>}
            <Button
              startIcon={<EditIcon />}
              color='black'
              variant='outlined'
              onClick={() => setIsDialogOpen(true)}
            >
              Edit
            </Button>

          </Stack>

        </Stack>
      }
    </Box>
  )
}
