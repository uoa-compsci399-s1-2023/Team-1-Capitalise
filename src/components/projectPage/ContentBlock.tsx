import React, { useState, FC, useContext, useRef, ReactNode, useEffect, ForwardedRef, useCallback } from 'react'
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
import { deleteGallery, removeGalleryImg } from '../../api/galleryApis';
import EditPosterDialog from './dialogs/EditPosterDialog';
import LinkIcon from '@mui/icons-material/Link';
import LoadingDialog from './dialogs/LoadingDialog';

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

function ContentBlock({ type, value, subHeading, tabIndex, blockIndex }: ContentBlockProps, ref: ForwardedRef<HTMLDivElement>) {

  const theme = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const { project, setProjectChanges, setSelectedTab, checkIsEdit, setProject } = useContext(ProjectContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const contentStackRef = useRef<HTMLDivElement>(null);
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  // This is for responsive resizing of galleries
  const [blockWidth, setBlockWidth] = useState(800);


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

    // If block is gallery, call s3 endpoint to delete galleries
    if (type === 'gallery') {
      const tab = project.content[tabIndex]
      const gallery = tab.tabContent[blockIndex]
      setIsLoading(true)
      deleteGallery(project._id, tab.tabName, gallery._id)
        .then(resp => {
          if (resp.ok) {
            return resp.json()
          } else {
            resp.text().then(err => console.log(err)); // log error and return undefined
          }
        }).then(data => data && setProject(data)) // Only set data if resp is 200
        .finally(() => setIsLoading(false))
    }
    // else patch project directly
    else {
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

  }

  // Limits deleting first block in project.
  const canDeleteBlock = () => {
    if (tabIndex === 0 && blockIndex === 0) {
      return false
    }
    return true
  }

  // Tracks content block width
  const resizeObserver = new ResizeObserver((event) => {
    const width = event[0].contentBoxSize[0].inlineSize;
    setBlockWidth(width);
  });

  const blockRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      resizeObserver.observe(node);
    }
  }, [])

  useEffect(() => {
    // Stop tracking width on unmount
    return () => resizeObserver.disconnect();
  }, [])

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
        Content = <Image 
        parentWidth={blockWidth} 
        url={value[0]} />
      } else {
        Content = <MemoizedImageCarousel 
        parentWidth={blockWidth} urls={value} 
        />
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
        <VideoPlayer url={value[0]} parentWidth={blockWidth} />
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
      <LoadingDialog isOpen={isLoading} />

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
            // width={'100%'}
            sx={{
              padding: {
                xs: '20px 20px',
                md: '40px 0 40px 40px'
              }
            }}
          >
            {/* Content and heading */}
            <Stack 
              ref={blockRef} 
              width={'100%'}
            >
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
                    display: canDeleteBlock() ? 'block' : 'none',
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
          {checkIsEdit() && project.content[tabIndex].tabContent.length < 5 &&
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

export default ContentBlock;
