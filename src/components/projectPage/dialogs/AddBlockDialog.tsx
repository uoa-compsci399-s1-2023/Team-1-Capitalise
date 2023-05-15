import React, { SetStateAction, ReactNode, useContext } from 'react'
import { Dialog, DialogContent, DialogTitle, Grid, DialogActions, useTheme, Button, TextField, Box, Stack, OutlinedInput, Typography } from '@mui/material'
import TextFormatIcon from '@mui/icons-material/TextFormat';
import CollectionsIcon from '@mui/icons-material/Collections';
import { ProjectContext } from '../../../routes/ProjectPage';
import { TProject } from '../../../model/TProject';

interface AddBlockDialogProps {
  isAddDialogOpen: boolean
  setIsAddDialogOpen: React.Dispatch<SetStateAction<boolean>>
  tabIndex: number
  blockIndex: number
}

function ContentButton({ children, handleClick }: { children: ReactNode, handleClick: () => void }) {

  const theme = useTheme();

  return (
    <Grid 
      item 
      xs={3}
    >
      <Button
        color='editBtnGrey'
        onClick={handleClick}
        sx={{
          height: '250px',
          width: '200px',
          '&:hover': { backgroundColor: theme.customColors.DividerGrey }
        }}
      >
        <Stack
          p={2}
        >
          {children}

        </Stack>
      </Button>
    </Grid>
  )

}


export default function AddBlockDialog({ isAddDialogOpen, setIsAddDialogOpen, tabIndex, blockIndex }: AddBlockDialogProps) {

  const theme = useTheme();
  const {project, setProjectChanges} = useContext(ProjectContext);

  const handleClose = () => {
    setIsAddDialogOpen(false);
  }

  const handleBtnClick = (type: string) => {
    
    switch(type) {
      case 'text':
        const newContent: TProject['content'] = JSON.parse(JSON.stringify(project.content));
        newContent[tabIndex].tabContent.splice(blockIndex+1, 0, {
          type: "text",
          value: []
        })
        setProjectChanges({
          ['content']: newContent
        })
    }

    setIsAddDialogOpen(false);
  }



  return (
    <Dialog
      open={isAddDialogOpen}
      onClose={handleClose}
      fullWidth
      maxWidth='md'
      PaperProps={{ sx: { p: 2 } }}
    >
      <DialogTitle>Add content</DialogTitle>
      <DialogContent>
        <Grid 
          container 
          spacing={4}
          p={2}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >

          <ContentButton handleClick={() => handleBtnClick('text')}>
            <TextFormatIcon
              sx={{ 
                fontSize: '150px',
                height: '150px'
              }}
            />
            <Typography color={'black'}>Text</Typography>
          </ContentButton>

          <ContentButton handleClick={() => handleBtnClick('gallery')}>
            <CollectionsIcon
              sx={{ 
                fontSize: '125px', 
                height: '150px'
              }}
            />
            <Typography color={'black'}>Gallery</Typography>
          </ContentButton>

        </Grid>

      </DialogContent>
    </Dialog >
  )
}
