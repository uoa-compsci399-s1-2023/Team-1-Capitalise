import React from 'react'
import { Chip } from '@mui/material'


export default function TagChip({ label }: { label: string }) {
  return (
    // Needs to redirect to search page onclick with keyword set to tag value
    <Chip size='small' label='#' />
  )
}
