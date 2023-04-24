import React, { useState } from 'react'

import { Chip, Typography, useTheme, Box } from '@mui/material'

interface FieldProps {
  label: string
  status: string
}

export default function StatusChip({ label, status }: FieldProps) {

  const [fieldState, setFieldState] = useState('')
  const theme = useTheme()

  return (
    <Box width='100%' display='flex' flexDirection={'row'} alignItems={'center'} >
      <Typography fontWeight={400} width={'100px'} variant="body1">{label}</Typography>
      <Chip label={`${status}`} color='warning' ></Chip>
    </Box>
  )
}
 