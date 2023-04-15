import { Box, Stack, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import Slider from 'react-slick'
import { TMockProject } from '../../model/MockProject'


interface ContentBlockProps {
  type: TMockProject['content'][0]['tabContent'][0]['type']
  subHeading?: TMockProject['content'][0]['tabContent'][0]['subHeading']
  value: TMockProject['content'][0]['tabContent'][0]['value']
}

export default function ContentBlock({ type, value, subHeading }: ContentBlockProps) {

  const theme = useTheme();

  // const NoStylesSlider = styled(Slider)({
  //   ":root": {}
  // })

  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   centerMode: true,
  //   variableWidth: true,
  //   swipeToSlide: true,
  //   edgeFriction: 0.15,
  // };


  let content = [];

  switch (type) {
    case 'text':
      content.push(
        <Typography
          component='p'
          fontSize={20}
          fontWeight={600}
        >
          {subHeading}
        </Typography>
      )
      content.push(
        <Typography variant='body1'>{value[0]}</Typography>
      )
      break;
    case 'quote':
      content.push(
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
      content.push(
        // <img src={value[0]} alt='project image' width={'70%'} style={{margin: '0 auto'}} />
        <div>
          {/* <NoStylesSlider {...settings} >
            {(value as string[]).map((image, i) => (
              <img key={i}
                id={image}
                src={image}
                width={'100%'}
                alt="image" />
            ))}
          </NoStylesSlider> */}
          <img src={value[0]}
            width={'100%'}
            alt="image" />
        </div>

      )
  }

  return (
    <Stack
      bgcolor={'white'}
      // bgcolor={theme.customColors.bgGrey}

      style={theme.contentBlock}
      padding={'10px 40px'}
      width={'100%'}
    >
      {...content}
    </Stack>
  )
}
