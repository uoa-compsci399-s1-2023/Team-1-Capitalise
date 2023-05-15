import React, { useEffect, memo } from 'react'
import Carousel from 'react-material-ui-carousel'
import { Stack } from '@mui/material'

export function ImageCarousel({ urls }: { urls: string[] }) {

  return (
    <Carousel
      animation='slide'
      duration={600}
      sx={{mt: 1}}
    >
      {urls.map((imgUrl, index) => (
        <Stack
          width='100%'
          key={index}
        >
          <a 
            href={imgUrl} 
            target='_blank'
            style={{
              margin: '0 auto'
            }}
          >
            <img
              src={imgUrl}
              width={'100%'}
              height={'400px'}
              style={{
                objectFit: 'scale-down',
              }}
              alt="image"
            />
          </a>
        </Stack>

      ))}
    </Carousel>

  )
}

export const MemoizedImageCarousel = memo(ImageCarousel, (prev, next) => {
  console.log(prev.urls);
  console.log(next.urls);
  if (prev === next) 
    return true;
  return false;
})
