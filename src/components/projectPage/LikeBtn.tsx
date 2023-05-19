import React, { useContext } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import { likeProject } from '../../api/likeProject';
import { ProjectContext } from '../../routes/ProjectPage';
import { useAuth } from '../../customHooks/useAuth';
import { styled } from '@mui/material/styles'
import pluralize from 'pluralize';

function InfoField({label, value}: {label:string, value:number}) {

}

export default function LikeBtn() {

  const auth = useAuth();
  const { project, setProject, checkIsEdit } = useContext(ProjectContext);
  const theme = useTheme();

  // const InfoBoxStyle = {
  //   padding: '5px 10px',
  //   border: `1px solid ${theme.palette.neutral.main}`,
  //   borderRadius: '10px',
  //   whiteSpace: 'nowrap'
  // }

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

  checkIsEdit() ?

      // If member or admin, show likes, views, and comments info

      <Stack
        flexDirection={'column'}
        gap={0.5}
        flexWrap={'wrap'}
        sx={{
          pl: {md: 0, xs: 1}
        }}
        alignItems={'start'}
      >
        <Typography variant='body2' color={'text.secondary'}>
          Likes: {project.likes}
        </Typography>
        <Typography variant='body2' color={'text.secondary'}>
          Views: {project.views}
        </Typography>
        <Typography variant='body2' color={'text.secondary'}>
          Comments: {project.comments.length}
        </Typography>
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
          onClick={handleLike}
        >
          {`Like (${project.likes})`}
        </Button>)
  )
}
