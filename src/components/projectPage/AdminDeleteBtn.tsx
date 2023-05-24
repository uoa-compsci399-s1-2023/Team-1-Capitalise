import React, { useContext } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ProjectContext } from '../../routes/ProjectPage';
import { useAuth } from '../../customHooks/useAuth';
import { styled } from '@mui/material/styles'
import pluralize from 'pluralize';

import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { API_URL } from "../../api/config";


export default function AdminDeleteButton() {

  const auth = useAuth();
  const { project, setProject, checkIsEdit } = useContext(ProjectContext);
  const theme = useTheme();
  const navigate = useNavigate();
  // const isScreenSmall = useMediaQuery(theme.breakpoints.down('md'));

  const adminDeleteProject = async () => {
    const token = auth.getToken();
    if (token) {
      if (window.confirm("Are you sure you want to remove this project?")) {
        fetch(`${API_URL}/api/projects/${project._id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            projectId: project._id,
          }),
        }).then(() => {
          // we need to redirect admin back to projects page upon project delete.
          navigate("/projects");
        });
      }
    }
  };

  return (
    checkIsEdit() ?
      <Button
        sx={{maxWidth: "180px"}}
        variant="outlined"
        startIcon={<DeleteOutlineIcon />}
        onClick={() => adminDeleteProject()}
        size="medium"
        color="error"
      >
        Delete Project
      </Button>
      :
      null
  )
}
