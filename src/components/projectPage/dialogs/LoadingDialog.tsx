import { CircularProgress, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import React from 'react'

interface LoadingDialogProps {
  isOpen: boolean
}

export default function LoadingDialog({ isOpen }: LoadingDialogProps) {
  return (
    <Dialog open={isOpen}>
      {/* <DialogTitle>{title}</DialogTitle> */}
      <DialogContent>
        <Typography variant="body1">Hang tight, this takes a few seconds...</Typography>
        <CircularProgress color='primary' />
      </DialogContent>
    </Dialog>
  )
}
