import { CircularProgress, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import React from 'react'

interface LoadingDialogProps {
  isOpen: boolean
}

export default function LoadingDialog({ isOpen }: LoadingDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <Typography variant="body1">Hang tight, this takes a few seconds...</Typography>
        <Stack
          alignItems={'center'}
          width={'100%'}
          py={4}
        >
          <CircularProgress color='primary' />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
