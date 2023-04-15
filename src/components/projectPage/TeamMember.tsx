import React, { useState } from 'react'

import { Button, Chip, Avatar, useTheme, Box, Icon } from '@mui/material'
import { styled } from '@mui/material/styles'


interface FieldProps {
  name: string
  avatar: string
  role?: string
}

export default function TeamMember({ name, avatar, role }: FieldProps) {

  const [fieldState, setFieldState] = useState('')
  const theme = useTheme()

  const Member = styled(Button)({
    borderRadius: '5px',
    textTransform: 'capitalize',
    fontWeight: 300,
    display: "flex", 
    justifyContent: "flex-start", 
    paddingLeft: "40px",
    color: 'black'
  })

  return (
    <Box width='100%' display='flex' flexDirection={'row'} >
      
      <Member
        startIcon={<Avatar sizes='small' alt={name} src={avatar} sx={{ width: 30, height: 30 }} />}
        variant='text'
        color='neutral' // Ignore type error.
        size='large'
        fullWidth
        style={{}}
      >
          {name}
      </Member>

    </Box>
  ) 
}
