import React, { FC, useState } from 'react'

import { styled, TextField, Container, Typography, useTheme, Input, Box, Button } from '@mui/material'
import ContentBlock from './ContentBlock'
import EditIcon from '@mui/icons-material/Edit';


interface FieldProps {
  label: string
  text: string
}

export default function EditableTextField({ label, text }: FieldProps) {


  const [fieldState, setFieldState] = useState('')
  const theme = useTheme()

  const EditButton = styled(Button)({
    height: "100%",
    // visibility: 'hidden',
    flex: '1',
    ':hover': {
      backgroundColor: theme.customColors.DividerGrey
    }
  })


  return (
    <Box width='100%' display='flex' flexDirection={'row'} alignItems={'center'} >
      <Typography fontWeight={400} width={'100px'} variant="body1">{label}</Typography>
      <Typography fontWeight={300} width={'140px'} variant="body1">{text}</Typography>
      <EditButton color='editBtnGrey'><EditIcon/></EditButton>
    </Box>
  )
}
