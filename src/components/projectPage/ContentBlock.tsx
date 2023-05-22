import React, { useState, FC, useContext, useRef, ReactNode, useEffect } from 'react'
import { useMediaQuery, Box, Stack, Typography, useTheme, Button, Link } from '@mui/material'
import { styled } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TProject } from '../../model/TProject';
import { ProjectContext } from '../../routes/ProjectPage';
import TextBlockDialog from './dialogs/TextBlockDialog';
import GalleryBlockDialog from './dialogs/GalleryBlockDialog';
import { MemoizedImageCarousel, Image } from './ImageCarousel';
import AddIcon from '@mui/icons-material/Add';
import AddBlockDialog from './dialogs/AddBlockDialog';
import VideoBlockDialog from './dialogs/VideoBlockDialog';
import VideoPlayer from './VideoPlayer';
import { removeGalleryImg } from '../../api/galleryApis';
import EditPosterDialog from './dialogs/EditPosterDialog';
import LinkIcon from '@mui/icons-material/Link';


export interface ContentBlockProps {
  tabIndex: number
  blockIndex: number
  type: TProject['content'][0]['tabContent'][0]['type']
  subHeading?: TProject['content'][0]['tabContent'][0]['subHeading']
  value: TProject['content'][0]['tabContent'][0]['value']
}

const EditButton = styled(Button)({
  height: "100%",
  visibility: 'hidden',
  flex: '1',
})

const AddButton = styled(Button)({
  width: "100%",
  visibility: 'hidden',
  flex: '1',
})

export default function ContentBlock({ type, value, subHeading, tabIndex, blockIndex }: ContentBlockProps) {

  const theme = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const { project, setProjectChanges, setSelectedTab, checkIsEdit } = useContext(ProjectContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const contentStackRef = useRef<HTMLDivElement>(null);
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (checkIsEdit()) {
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
    // setIsHovering(false);
  }

  const handleDeleteContentBlock = () => {

    const tabContent = project.content[tabIndex].tabContent
    if (tabContent.length > 1) {
      project.content[tabIndex].tabContent.splice(blockIndex, 1);
    } else {
      project.content.splice(tabIndex, 1); // Remove tab if this is the only block in it
      setSelectedTab(project.content.length - 1)
    }
    setProjectChanges({
      ['content']: project.content
    })
  }

  let Content: ReactNode = <></>;
  let Heading: ReactNode = <></>;
  let Dialog: ReactNode = <></>;


  if (subHeading) {
    Heading =
      <Typography
        component='p'
        fontSize={20}
        fontWeight={600}
        mb={3}
      >
        {subHeading}
      </Typography>

  }

  // Switch block depending on content type
  switch (type) {
    case 'text':
      Content = (value.length > 0 ?
        <Typography
          variant='body1'
          sx={{
            whiteSpace: 'pre-wrap'
          }}
        >
          {value[0]}
        </Typography>
        :
        <Typography textAlign={'center'} color={theme.palette.neutral.main} variant='body1'>&lt;Empty text block&gt;</Typography>
      )
      Dialog =
        <TextBlockDialog
          setIsDialogOpen={setIsDialogOpen}
          isDialogOpen={isDialogOpen}
          tabIndex={tabIndex}
          blockIndex={blockIndex}
          initialValue={value[0]}
        />

      break;
    case 'quote':
      Content = value.length > 0 ?
        <Typography
          component='p'
          fontSize={20}
          fontWeight={600}
          textAlign={'center'}
        >
          {value[0]}
        </Typography>
        :
        <Typography textAlign={'center'} color={'text.secondary'} variant='body1'>&lt;Empty quote block&gt;</Typography>
      break;
    case 'gallery':
      // Only render gallery if more than one image.
      if (value.length === 0) {
        Content =
          <Typography textAlign={'center'} color={'text.secondary'} variant='body1'>&lt;Empty gallery block&gt;</Typography>

      } else if (value.length === 1) {
        Content = <Image url={value[0]} />
      } else {
        Content = <MemoizedImageCarousel urls={value} />
      }
      Dialog =
        <GalleryBlockDialog
          setIsDialogOpen={setIsDialogOpen}
          isDialogOpen={isDialogOpen}
          tabIndex={tabIndex}
          blockIndex={blockIndex}
          initialUrls={value}
        />

      break;
    case 'video':
      Content = value.length > 0 ?
        <VideoPlayer url={value[0]} />
        :
        <Typography textAlign={'center'} color={'text.secondary'} variant='body1'>&lt;Empty video block&gt;</Typography>

      Dialog =
        <VideoBlockDialog
          setIsDialogOpen={setIsDialogOpen}
          isDialogOpen={isDialogOpen}
          tabIndex={tabIndex}
          blockIndex={blockIndex}
          initialValue={value[0]}
        />
      break;
    case 'poster':
      Content = value.length > 0 ?
        <Box>
          <Button
            href={value[0]}
            target={'_blank'}
            color='neutral'
            startIcon={value[0] && <LinkIcon fontSize='small' />}
            sx={{
              '&:hover': {
                backgroundColor: theme.customColors.DividerGrey
              }
            }}
          >
            {value[0] ? value[1] : "no file uploaded"}
          </Button>
        </Box>
        :
        <Typography textAlign={'center'} color={'text.secondary'} variant='body1'>&lt;Empty PDF block&gt;</Typography>

      Dialog =
        <EditPosterDialog
          {...{ tabIndex, blockIndex, isDialogOpen, setIsDialogOpen }}
        />
  }

  return (
    <>
      {/* Dialog for editing content */}
      {Dialog}

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
            sx={{
              padding: {
                xs: '40px 20px',
                md: '40px 0 40px 40px'
              }
            }}
          >
            {/* Content and heading */}
            <Stack width={'100%'}>
              {Heading}
              {Content}
            </Stack>

            {/* Edit and delete buttons */}
            {/* negative margin counters parent padding */}
            {!isSmall &&
              <Stack my={'-40px'}>
                <EditButton
                  sx={{
                    visibility: isHovering ? 'visible' : 'hidden',
                    '&:hover': {
                      backgroundColor: theme.customColors.DividerGrey
                    }
                  }}
                  color='editBtnGrey'
                  onClick={() => setIsDialogOpen(true)}
                >
                  <EditIcon />
                </EditButton>

                <EditButton
                  sx={{
                    display: tabIndex === 0 ? 'none' : 'block',
                    visibility: isHovering ? 'visible' : 'hidden',
                    '&:hover': {
                      backgroundColor: theme.customColors.DividerGrey
                    }
                  }}
                  color='editBtnGrey'
                  onClick={handleDeleteContentBlock}
                >
                  <DeleteIcon />
                </EditButton>
              </Stack>
            }
          </Stack>

          {/* Add button (only shows if there are less than 5 blocks in tab) */}
          {checkIsEdit() && project.content[tabIndex].tabContent.length < 5 && tabIndex !== 0 &&
            <AddButton
              sx={{
                visibility: isHovering ? 'visible' : 'hidden',
                width: '100%',
                '&:hover': {
                  backgroundColor: theme.customColors.DividerGrey
                }
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
