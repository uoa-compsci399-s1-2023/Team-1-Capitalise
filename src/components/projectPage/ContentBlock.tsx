import { Box, Stack, Typography, useTheme } from '@mui/material'
import React from 'react'

interface ContentBlockProps {
  type: "gallery" | "poster" | "text" | "video" | "codeBlock" | "quote"
  subHeading?: string
  value: string | string[]
}

export default function ContentBlock({ type, value }: ContentBlockProps) {

  const theme = useTheme();

  let content = [];

  // console.log(type, value)

  switch (type) {
    case 'text':
      content.push(<Typography variant='body1'>{value[0]}</Typography>)
      break;
    case 'quote':
      content.push(
        <Typography
          component='p'
          fontSize={20}
          fontWeight={600}
        >
          {value[0]}
        </Typography>
      )
      break;
    case 'gallery':
      content.push(
        <img src={value[0]} alt='project image' style={{ padding: '20px 160px' }} />
      )

  }

  return (
    <Stack
      bgcolor={'white'}
      style={theme.contentBlock}
      padding={'40px'}
      width={'100%'}
    >
      {...content}
    </Stack>
  )
}
