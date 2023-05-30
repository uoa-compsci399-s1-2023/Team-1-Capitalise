import React from 'react'
import ReactPlayer from 'react-player'
import { Stack, Box } from '@mui/material'
import fitvids from 'fitvids'

export default React.memo(function VideoPlayer({ url, parentWidth }: { url: string, parentWidth: number }) {
  // fitvids('.video-wrapper'); // Makes embeded player responsive

  const height = parentWidth * 0.5625;


  return (
    <Stack
      alignItems={'center'}
      // px={'20px'}
      overflow={'hidden'}
      className='video-wrapper'
      margin={'0 auto'}
      width={'100%'}
      height={height}
      sx={{
        // Stop video from becoming too big
        width: {lg: '70%', xs: '100%'}
      }}
      >
      <ReactPlayer
        width='100%'
        height='100%'
        url={url}
        controls
        config={{
          youtube: {
            playerVars: {
              'autoplay': false,
              'modestBranding': true
            },
          }
        }}
      />
    </Stack>
  )
})
