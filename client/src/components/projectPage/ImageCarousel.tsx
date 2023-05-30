import React, { useEffect, memo, useState, useRef } from 'react'
import Carousel from 'react-material-ui-carousel'
import { Stack, useMediaQuery } from '@mui/material'

export function Image({ url, parentWidth }: { url: string, parentWidth: number }) {

  // 16:9 ratio
  const height = parentWidth * 0.5625;

  return (
    <Stack
      width='100%'
      height={height}
    >
      <a
        href={url}
        target='_blank'
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <img
          src={url}
          width={'100%'}
          height={'100%'}
          style={{
            objectFit: 'contain',
          }}
          alt="Gallery Image"
        />

      </a>
    </Stack>
  )
}

export function ImageCarousel({ urls, parentWidth }: { urls: string[], parentWidth: number }) {
  const height = parentWidth * 0.5625;

  return (
      <Carousel
        height={height}
        animation='slide'
        duration={600}
        // sx={{ mt: 1 }}
        autoPlay={false}
        cycleNavigation={false}
      // navButtonsAlwaysVisible
      >
        {urls.map((imgUrl, index) => (
          <Image parentWidth={parentWidth} url={imgUrl} key={index} />
        ))}
      </Carousel>
      )
}

      export const MemoizedImageCarousel = memo(ImageCarousel)
