import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import { Button, Box, useTheme, Stack } from '@mui/material'
import EditButton from './EditButton'
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useAuth } from '../../customHooks/useAuth';
import { ProjectContext } from '../../routes/ProjectPage';
import EditTabNameDialog from './dialogs/EditTabNameDialog';



interface TabButtonProps {
  value: string
  index: number
  isSelected: boolean
  setSelected: Dispatch<SetStateAction<number>>
}


export default function TabButton({ index, isSelected, value, setSelected }: TabButtonProps) {

  const [isHover, setIsHover] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { project } = useContext(ProjectContext);
  const auth = useAuth();
  const theme = useTheme();

  const handleEditClick = () => {
    setIsDialogOpen(true);
  }

  return (
    <>
      <EditTabNameDialog
        tabIndex={index}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />
      <Stack
        flexDirection={'row'}
        gap={0}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >

        <Button
          variant='text'
          color='black'
          onClick={() => setSelected(index)}>
          <Box
            borderBottom={isSelected ? `3px solid ${theme.palette.neutral.main}` : `3px solid transparent`}
            p={0.5}
            fontSize={16}
          >
            {value}
          </Box>
        </Button>

        <Button
          sx={{
            display: auth.isAllowed(['admin'], project.members) ? 'block' : 'none',
            visibility: isHover ? 'visible' : 'hidden',
            height: "100%",
            minWidth: '0',
            mr: 3,
            ':hover': {
              backgroundColor: theme.customColors.DividerGrey
            }
          }}
          onClick={handleEditClick}
          color='editBtnGrey'
        >
          <EditIcon fontSize={'small'} />
        </Button>
      </Stack>
    </>
  )
}
