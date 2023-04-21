import React, { useState, FC, useRef } from 'react'
import { Box, Stack, Typography, useTheme, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { TMockProject } from '../../model/MockProject'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TProject } from '../../model/TProject';


export interface ContentBlockProps {
  type: TProject['content'][0]['tabContent'][0]['type']
  subHeading?: TProject['content'][0]['tabContent'][0]['subHeading']
  value: TProject['content'][0]['tabContent'][0]['value']
}


export default function ContentBlock({ type, value, subHeading }: ContentBlockProps) {
  
  const theme = useTheme();
  // const [isHovering, setIsHovering] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);
  const deleteBtnRef = useRef<HTMLButtonElement>(null);
  // const [btnStyle, setBtnStyle] = useState({height: '100%', visibility: 'visible', flex: '1'});

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // console.log('hovering')
    // setIsHovering(true)
    if (editBtnRef.current) {
      editBtnRef.current.style.visibility = 'visible'
    }
    if (deleteBtnRef.current) {
      deleteBtnRef.current.style.visibility = 'visible'
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (editBtnRef.current) {
      editBtnRef.current.style.visibility = 'hidden'
    }
    if (deleteBtnRef.current) {
      deleteBtnRef.current.style.visibility = 'hidden'
    }
  }

  const ContentStack = styled(Stack)({
    backgroundColor: 'white',
    border: theme.contentBlock?.border,
    // border: `3px solid ${theme.customColors.DividerGrey}`,
    borderRadius: theme.contentBlock?.borderRadius,
    padding: '40px 0 40px 40px',
    // paddingBottom: '40px',
    // paddingLeft: '40px',
    "&:hover": {
      border: `3px solid ${theme.customColors.DividerGrey}`
    },
    width: '100%'
  })

  const EditButton = styled(Button)({
    height: "100%",
    visibility: 'hidden',
    flex: '1',
    ':hover': {
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

            {/* <div style={{flex: 1, width: '40px'}}> */}
            <EditButton ref={editBtnRef} color='editBtnGrey'>
              <EditIcon />
            </EditButton>
            {/* </div> */}

            <EditButton ref={deleteBtnRef} color='editBtnGrey'>
              <DeleteIcon />
            </EditButton>
          </Stack>

        </Stack>
      </ContentStack>
    </>

  )
}
