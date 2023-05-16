import React, { useEffect, memo } from 'react'
import Carousel from 'react-material-ui-carousel'
import { Stack } from '@mui/material'

export function Image({ url }: { url: string }) {
  return (
    <Stack
      width='100%'
    >
      <a
        href={url}
        target='_blank'
        style={{
          margin: '0 auto'
        }}
      >
        <img
          src={url}
          width={'100%'}
          height={'400px'}
          style={{
            objectFit: 'scale-down',
          }}
          alt="image"
        />
      </a>
    </Stack>
  )
}

export function ImageCarousel({ urls }: { urls: string[] }) {

  return (
    <Carousel
      animation='slide'
      duration={600}
      sx={{ mt: 1 }}
      autoPlay={false}
    >
      {urls.map((imgUrl, index) => (
        <Image url={imgUrl} key={index} />
      ))}
    </Carousel>
  )
}

export const MemoizedImageCarousel = memo(ImageCarousel)
