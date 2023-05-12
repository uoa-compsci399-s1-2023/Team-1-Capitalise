import React, { useContext } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import { styled, Button, useTheme } from '@mui/material';
import { ProjectContext } from '../../routes/ProjectPage';
import { patchProject } from '../../api/patchProject';
import { useAuth } from '../../customHooks/useAuth';
import { getProject } from '../../api/getProject';

interface EditButtonProps {
  clickHandler: () => void
  isShow: boolean
  fontSize: "small" | "inherit" | "large" | "medium"
}

export default function EditButton({ clickHandler, isShow, fontSize }: EditButtonProps) {

  const theme = useTheme();
  const { project, setProject } = useContext(ProjectContext);
  const auth = useAuth();

  const EditButton = styled(Button)({
    height: "100%",
    paddingLeft: '0',
    paddingRight: '0',
    minWidth: '64px',
    marginLeft: '5px',
    ':hover': {
      backgroundColor: theme.customColors.DividerGrey
    }
  });

  // Fetch latest project. 
  // If isBeingEdit set to true then user can't edit.
  // Else set isBeingEdited to true.
  const handleClick = () => {
    clickHandler();
    // getProject(project._id)
    //   .then((proj) => {
    //     if (proj) {
    //       // setProject(proj)
    //       if (proj.isBeingEdited) {
    //         console.log('Project is already being edited!')
    //       } else {
    //         patchProject(
    //           project._id,
    //           { isBeingEdited: true },
    //           auth.getToken() as string
    //         )
    //           .then(resp => {
    //             if (!resp.ok) {
    //               resp.text().then(err => console.log(err))
    //             } else {
    //               clickHandler()
    //             }
    //           })
    //       }
    //     }
    //   })
  }

  return (
    <>
      <EditButton
        sx={{ visibility: isShow ? 'visible' : 'hidden' }}
        onClick={handleClick}
        color='editBtnGrey'
      >
        <EditIcon fontSize={fontSize} />
      </EditButton>
    </>
  )
}
