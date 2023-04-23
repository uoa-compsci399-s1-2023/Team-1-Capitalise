import React, { useContext } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button } from '@mui/material';
import { likeProject } from '../../api/likeProject';
import { ProjectContext } from './ProjectPage';
import { useAuth } from '../../customHooks/useAuth';

export default function LikeBtn() {

  const auth = useAuth();
  const { project, setProject } = useContext(ProjectContext);

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
    auth.user &&
    // Switches between like and unlike button
      auth.user.likedProjects.includes(project._id) ?
      <Button
        variant='outlined'
        color='neutral'
        startIcon={<FavoriteIcon color='error'/>}
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
      </Button>

  )
}
