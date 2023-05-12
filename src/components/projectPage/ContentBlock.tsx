import React, { useState, FC, useContext } from 'react'
import { Box, Stack, Typography, useTheme, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TProject } from '../../model/TProject';
import { useAuth } from '../../customHooks/useAuth';
import { ProjectContext } from '../../routes/ProjectPage';

export interface ContentBlockProps {
  type: TProject['content'][0]['tabContent'][0]['type']
  subHeading?: TProject['content'][0]['tabContent'][0]['subHeading']
  value: TProject['content'][0]['tabContent'][0]['value']
}


export default function ContentBlock({ type, value, subHeading }: ContentBlockProps) {

  const theme = useTheme();
  const [isHovering, setIsHovering] = useState(false);
  const auth = useAuth();
  const { project, setProjectChanges } = useContext(ProjectContext);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (auth.isAllowed(['admin'], project.members)) {
      setIsHovering(true);
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsHovering(false);
  }

  const ContentStack = styled(Stack)({
    backgroundColor: 'white',
    border: theme.contentBlock?.border,
    borderRadius: theme.contentBlock?.borderRadius,
    padding: '40px 0 40px 40px',
    width: '100%',
    "&:hover": auth.isAllowed(['admin'], project.members) && {
      border: `3px solid ${theme.customColors.DividerGrey}`
    },
  })

  const EditButton = styled(Button)({
    height: "100%",
    visibility: 'hidden',
    flex: '1',
    '&:hover': {
      backgroundColor: theme.customColors.DividerGrey
    }
  })


  let Content: FC = () => <></>;
  let Heading: FC = () => <></>;

  if (subHeading) {
    Heading = () => (
      <Typography
        component='p'
        fontSize={20}
        fontWeight={600}
      >
        {subHeading}
      </Typography>
    )
  }


  switch (type) {
    case 'text':
      Content = () => (
        <Typography variant='body1'>{value[0]}</Typography>
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
      Content = () => (
        <img src={value[0]}
          width={'70%'}
          style={{ margin: '0 auto' }}
          alt="image" />
      )
  }

  return (
    <>
      <ContentStack
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Stack flexDirection={'row'}>

          <Stack width={'100%'}>
            <Heading />
            <Content />
          </Stack>

          {/* negative margin counters parent padding */}
          <Stack my={'-40px'}>

            <EditButton
              sx={{ visibility: isHovering ? 'visible' : 'hidden' }}
              color='editBtnGrey'
            >
              <EditIcon />
            </EditButton>

            <EditButton
              sx={{ visibility: isHovering ? 'visible' : 'hidden' }}
              color='editBtnGrey'
            >
              <DeleteIcon />
            </EditButton>
          </Stack>

        </Stack>
      </ContentStack>
    </>

  )
}
