import { Button, SvgIcon, Box } from '@mui/material'

import React from 'react'


export default function CodeSandboxBtn() {
  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Button
        color='black' // Ignore type error
        startIcon={<SquareOutlinedIcon/>}
        endIcon={<LaunchOutlinedIcon />}
        variant='contained'
        style={{
          fontWeight: 400,
        }}
        sx={{
          px: 3,
          width: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textTransform: 'capitalize',
          mb: 2,
          color: 'white' // Text color
        }}
      >
        Sandbox
      </Button>

    </Box>

  )
}
