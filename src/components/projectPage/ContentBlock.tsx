import React, { useState, FC, useContext, useRef, ReactNode } from 'react'
import { Box, Stack, Typography, useTheme, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TProject } from '../../model/TProject';
import { useAuth } from '../../customHooks/useAuth';
import { ProjectContext } from '../../routes/ProjectPage';
import TextBlockDialog from './dialogs/TextBlockDialog';
import GalleryBlockDialog from './dialogs/GalleryBlockDialog';
import { MemoizedImageCarousel } from './ImageCarousel';
import AddIcon from '@mui/icons-material/Add';
import AddBlockDialog from './dialogs/AddBlockDialog';


export interface ContentBlockProps {
  tabIndex: number
  blockIndex: number
  type: TProject['content'][0]['tabContent'][0]['type']
  subHeading?: TProject['content'][0]['tabContent'][0]['subHeading']
  value: TProject['content'][0]['tabContent'][0]['value']
}

export default function ContentBlock({ type, value, subHeading, tabIndex, blockIndex }: ContentBlockProps) {

  const theme = useTheme();
  const auth = useAuth();
  const [isHovering, setIsHovering] = useState(false);
  const { project, setProjectChanges } = useContext(ProjectContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const contentStackRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (auth.isAllowed(['admin'], project.members)) {
      setIsHovering(true);
      // Change border to grey
      if (contentStackRef.current) {
        contentStackRef.current.style.border = `3px solid ${theme.customColors.DividerGrey}`
      }
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsHovering(false);
    // Reset border
    if (contentStackRef.current) {
      contentStackRef.current.style.border = theme.contentBlock!.border!
    }
  }

  const handleAddContentBlock = () => {
    setIsAddDialogOpen(true);
    setIsHovering(false);
  }

  const handleDeleteContentBlock = () => {
    const content: TProject['content']  = JSON.parse(JSON.stringify(project.content))
    content[tabIndex].tabContent.splice(blockIndex, 1);
    setProjectChanges({
      ['content']: content
    })
  }

  const EditButton = styled(Button)({
    height: "100%",
    visibility: 'hidden',
    flex: '1',
    '&:hover': {
      backgroundColor: theme.customColors.DividerGrey
    }
  })

  const AddButton = styled(Button)({
    width: "100%",
    visibility: 'hidden',
    flex: '1',
    '&:hover': {
      backgroundColor: theme.customColors.DividerGrey
    }
  })

  let Content: FC = () => <></>;
  let Heading: FC = () => <></>;
  let Dialog: FC = () => <></>;

  if (subHeading) {
    Heading = () => (
      <Typography
        component='p'
        fontSize={20}
        fontWeight={600}
        mb={3}
      >
        {subHeading}
      </Typography>
    )
  }

  switch (type) {
    case 'text':
      Content = () => ( value.length > 0 ? 
        <Typography variant='body1'>{value[0]}</Typography>
        :
        <Typography textAlign={'center'} color={theme.palette.neutral.main} variant='body1'>&lt;Empty text block&gt;</Typography>
      )
      Dialog = () => (
        <TextBlockDialog
          setIsDialogOpen={setIsDialogOpen}
          isDialogOpen={isDialogOpen}
          tabIndex={tabIndex}
          blockIndex={blockIndex}
          initialValue={value[0]}
        />
      )
      break;
    case 'quote':
      Content = () => (
        <Typography
          component='p'
          fontSize={20}
          fontWeight={600}
          textAlign={'center'}
        >
          {value[0]}
        </Typography>
      )
      break;
    case 'gallery':
      Content = () => (<MemoizedImageCarousel urls={value} />);
      Dialog = () => (
        <GalleryBlockDialog
          setIsDialogOpen={setIsDialogOpen}
          isDialogOpen={isDialogOpen}
          tabIndex={tabIndex}
          blockIndex={blockIndex}
          initialUrls={value}
        />
      )
      break;
  }

  return (
    <>

      <Dialog />

      {isAddDialogOpen && 
        <AddBlockDialog 
          {...{isAddDialogOpen, setIsAddDialogOpen, tabIndex, blockIndex}} 
        />
      }

      <div
        ref={contentStackRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundColor: 'white',
          border: theme.contentBlock?.border,
          borderRadius: theme.contentBlock?.borderRadius,
          width: '100%',
        }}
      >
        <Stack>
          <Stack flexDirection={'row'}
            padding='40px 0 40px 40px'
          >

            <Stack width={'100%'}>
              {Heading({})}
              {Content({})}

            </Stack>

            {/* negative margin counters parent padding */}
            <Stack my={'-40px'}>

              <EditButton
                sx={{ visibility: isHovering ? 'visible' : 'hidden' }}
                color='editBtnGrey'
                onClick={() => setIsDialogOpen(true)}
              >
                <EditIcon />
              </EditButton>

              <EditButton
                sx={{ visibility: isHovering ? 'visible' : 'hidden' }}
                color='editBtnGrey'
                onClick={handleDeleteContentBlock}
              >
                <DeleteIcon />
              </EditButton>
            </Stack>

          </Stack>

          {project.content[tabIndex].tabContent.length < 5 &&
            <AddButton
              sx={{
                visibility: isHovering ? 'visible' : 'hidden',
                width: '100%'
              }}
              color='editBtnGrey'
              onClick={handleAddContentBlock}
            >
              <AddIcon fontSize='large' />
            </AddButton>
          }

        </Stack>
      </div >
    </>
  )
}
