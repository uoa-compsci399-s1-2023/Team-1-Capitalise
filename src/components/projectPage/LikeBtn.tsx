import React, { useContext } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import { likeProject } from '../../api/likeProject';
import { ProjectContext } from './ProjectPage';
import { useAuth } from '../../customHooks/useAuth';
import { styled } from '@mui/material/styles'
import pluralize from 'pluralize';





export default function LikeBtn() {

  const auth = useAuth();
  const { project, setProject } = useContext(ProjectContext);
  const theme = useTheme();

  const InfoBox = styled(Typography)({
    padding: '5px 10px',
    border: `1px solid ${theme.palette.neutral.main}`,
    borderRadius: '10px',
    whiteSpace: 'nowrap'
  })

  const handleLike = () => {
    auth.onlyAuthenticated();
    likeProject(project._id, auth.getToken() as string)
      .then(resp => {
        if (resp.ok) {
          resp.json().then(proj => {
            auth.getLatestUser();
            setProject(proj);
          });
        } else {
          resp.text().then(err => console.log(err))
        }
      })
  }

  return (

    auth.user && (
      auth.isAllowed(undefined, project.members)
      || auth.isAllowed(['admin'])
    ) ?

      // If member or admin, show likes, views, and comments info

      <Stack flexDirection={'row'} gap={2} flexWrap={'wrap'}>
        <InfoBox>
          {pluralize('likes', project.likes, true)}
        </InfoBox>
        <InfoBox>
          {pluralize('views', project.views, true)}
        </InfoBox>
        <InfoBox>
          {pluralize('comments', project.comments.length, true)}
        </InfoBox>
      </Stack>

      :

      // else switch between like and unlike button
      (auth.user && auth.user.likedProjects.includes(project._id) ?
        <Button
          variant='outlined'
          color='neutral'
          startIcon={<FavoriteIcon color='error' />}
          onClick={handleLike}
        >
          {`Liked! (${project.likes})`}
        </Button>
        :
        <Button
          variant='contained'
          color='error'
          startIcon={<FavoriteIcon />}
          onClick={handleLike}
        >
          {`Like (${project.likes})`}
        </Button>)
  )
}
