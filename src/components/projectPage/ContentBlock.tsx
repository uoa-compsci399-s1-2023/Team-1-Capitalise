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
import { MemoizedImageCarousel, Image } from './ImageCarousel';
import AddIcon from '@mui/icons-material/Add';
import AddBlockDialog from './dialogs/AddBlockDialog';
import VideoBlockDialog from './dialogs/VideoBlockDialog';
import fitvids from 'fitvids'
import VideoPlayer from './VideoPlayer';


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

  const isSmall = theme.breakpoints.down("md");

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (auth.isAllowed(['admin'], project.members)) {
      setIsHovering(true);
      // Change border to grey
      if (!isSmall && contentStackRef.current) {
        contentStackRef.current.style.border = `3px solid ${theme.customColors.DividerGrey}`
      }
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsHovering(false);
    // Reset border
    if (!isSmall && contentStackRef.current) {
      contentStackRef.current.style.border = theme.contentBlock!.border!
    }
  }

  const handleAddContentBlock = () => {
    setIsAddDialogOpen(true);
    setIsHovering(false);
  }

  const handleDeleteContentBlock = () => {
    const content: TProject['content'] = JSON.parse(JSON.stringify(project.content))
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

  // Switch block depending on content type
  switch (type) {
    case 'text':
      Content = () => (value.length > 0 ?
        <Typography 
          variant='body1'
        >
          {value[0]}
        </Typography>
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
      Content = () => (value.length > 0 ?
        <Typography
          component='p'
          fontSize={20}
          fontWeight={600}
          textAlign={'center'}
        >
          {value[0]}
        </Typography>
        :
        <Typography textAlign={'center'} color={theme.palette.neutral.main} variant='body1'>&lt;Empty quote block&gt;</Typography>
      )
      break;
    case 'gallery':
      // Only render gallery if more than one image.
      if (value.length === 0) {
        Content = () => (
          <Typography textAlign={'center'} color={theme.palette.neutral.main} variant='body1'>&lt;Empty gallery block&gt;</Typography>
        )
      } else if (value.length === 1) {
        Content = () => (<Image url={value[0]} />)
      } else {
        Content = () => (<MemoizedImageCarousel urls={value} />);
      }
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
    case 'video':
      Content = () => (value.length > 0 ?
        <VideoPlayer url={value[0]} />
        :
        <Typography textAlign={'center'} color={theme.palette.neutral.main} variant='body1'>&lt;Empty video block&gt;</Typography>
      )
      Dialog = () => (
        <VideoBlockDialog
          setIsDialogOpen={setIsDialogOpen}
          isDialogOpen={isDialogOpen}
          tabIndex={tabIndex}
          blockIndex={blockIndex}
          initialValue={value[0]}
        />
      )
      break;
  }

  return (
    <>
      {/* Dialog for editing content */}
      <Dialog />

      {/* Dialog for adding new content */}
      {isAddDialogOpen &&
        <AddBlockDialog
          {...{ isAddDialogOpen, setIsAddDialogOpen, tabIndex, blockIndex }}
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
        {/* Column stack */}
        <Stack>
          {/* Row stack */}
          <Stack flexDirection={'row'}
            sx={{padding: {
              xs: '20px',
              md: '40px 0 40px 40px'
            }}}
          >
            {/* Content and heading */}
            <Stack width={'100%'}>
              {Heading({})}
              {Content({})}
            </Stack>

            {/* Edit and delete buttons */}
            {/* negative margin counters parent padding */}
            {!isSmall &&
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
            }
          </Stack>

          {/* Add button (only shows if there are less than 5 blocks in tab) */}
          {!isSmall && project.content[tabIndex].tabContent.length < 5 &&
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
