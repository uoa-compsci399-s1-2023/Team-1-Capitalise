import React from 'react'
import ReactPlayer from 'react-player'
import { Stack, Box } from '@mui/material'
import fitvids from 'fitvids'

export default React.memo(function VideoPlayer({ url }: { url: string }) {
  fitvids('.video-wrapper'); // Makes embeded player responsive
  return (
    <Stack
      alignItems={'center'}
      px={'20px'}
      overflow={'hidden'}
      className='video-wrapper'
      width={'100%'}
      height={'400px'}
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
