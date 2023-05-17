import React, { useEffect, useState } from 'react'
import { Typography, Stack, useTheme } from '@mui/material'
import topExcellence from '../../assets/topExcellence.svg'
import peoplesChoice from '../..assets/peoplesChoice.svg'
import communityImpact from '../..assets/communityImpact.svg'
import { TParameter } from '../../model/TParameter'
import { getBadges } from '../../api/getBadges'



interface AwardBadgeProps {
  badgeId: string
}


export default function AwardBadge({ badgeId }: AwardBadgeProps) {

  const [badge, setBadge] = useState<TParameter | null>(null);
  const theme = useTheme();
  let color;

  useEffect(() => {
    getBadges().then(resp => {
      if (resp.ok) {
        resp.json().then(data => setBadge(data));
      } else {
        resp.json().then(err => console.log(err));
      }
    })
  }, [badgeId])


  return (
    badge ?
      <Stack width={'100%'} >
        <img
          src={badge.image}
          width={100}
          style={{ margin: '0 auto' }}
        />
        <Typography
          mt={2}
          textAlign={'center'}
          color={color}
        >
          {badge.value}
        </Typography>
        <span
          style={{
            textAlign: 'center',
            color: badge.gradient ? badge.gradient[0] : 'black',
            width: '100%'
          }}
        >
          {badge.value}
        </span>
      </Stack>
      :
      null
  )
}
