import React, { useContext } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import { ProjectContext } from '../../routes/ProjectPage';
import { useAuth } from '../../customHooks/useAuth';
import { styled } from '@mui/material/styles'
import pluralize from 'pluralize';

import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { API_URL } from "../../api/config";


export default function AdminDeleteButton() {

    const auth = useAuth();
    const { project, setProject } = useContext(ProjectContext);
    const theme = useTheme();
    const navigate = useNavigate();
  
    const InfoBox = styled(Typography)({
      padding: '5px 10px',
      border: `1px solid ${theme.palette.neutral.main}`,
      borderRadius: '10px',
      whiteSpace: 'nowrap'
    })
    
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
      auth.isAllowed(["admin"]) && auth.user ?
        <Button
        variant="outlined"
        startIcon={<DeleteOutlineIcon />}
        onClick={() => adminDeleteProject()}
        size="small"
        color="error"
        >
          Delete project
       </Button>
       :
      null
    )
  }
  