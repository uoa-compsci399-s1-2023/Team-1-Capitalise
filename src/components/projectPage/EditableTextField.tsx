import React, { useState } from 'react'

import { TextField, Container, Typography, useTheme, Input, Box } from '@mui/material'

interface FieldProps {
  label: string
  text: string
}

export default function EditableTextField({ label, text }: FieldProps) {

  const [fieldState, setFieldState] = useState('')
  const theme = useTheme()

  return (
    <Box width='100%' display='flex' flexDirection={'row'} alignItems={'start'} >
      <Typography fontWeight={400} width={'100px'} variant="body1">{label}</Typography>
      <Typography fontWeight={300} width={'140px'} variant="body1">{text}</Typography>
    </Box>
  )
}
