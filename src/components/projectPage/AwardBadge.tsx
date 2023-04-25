import React from 'react'
import { Typography, Stack, useTheme } from '@mui/material'
import topExcellence from '../../assets/topExcellence.svg'
import peoplesChoice from '../..assets/peoplesChoice.svg'
import communityImpact from '../..assets/communityImpact.svg'

type TBadge = {
  value: string,
  image?: string
}


export default function AwardBadge({ value, image }: TBadge) {

  const theme = useTheme();
  let color;

  

  switch (value) {
    case 'Top Excellence':
      color = theme.customColors.excellenceAward
      break;

    case 'Community Impact':
      color = theme.customColors.communityImpact
      break;
    case 'Peoples Choice':
      color = theme.customColors.peoplesChoice
  }

  return (
    <Stack width={'100%'} >
      <img
        src={image}
        width={100}
        style={{ margin: '0 auto' }}
      />
      <Typography
        mt={2}
        textAlign={'center'}
        color={color}
      >
        {value}
      </Typography>
      <Typography
        textAlign={'center'}
        color={color}
      >
        Award
      </Typography>
    </Stack>
  )
}
