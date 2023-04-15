import React, { Dispatch, SetStateAction } from 'react'
import { Button, Box, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'


interface TabButtonProps {
  value: string
  index: number
  isSelected: boolean
  setSelected: Dispatch<SetStateAction<number>>
}

export default function TabButton({ index, isSelected, value, setSelected }: TabButtonProps) {

  const theme = useTheme();

  // const NormalButton = styled(Button)({
  //   // borderRadius: '0',
  //   // borderBottom: `3px solid ${theme.customColors.bgGrey}`
  // })

  // const ActiveButton = styled(NormalButton)({
  //   // borderBottom: `3px solid ${theme.customColors.DividerGrey}`
  // })

  const NormalButton = () => (
    <Button 
      variant='text' 
      color='black' 
      onClick={() => setSelected(index)}>
      <Box
        borderBottom={`3px solid transparent`}
        p={0.5}

      >
        {value}
      </Box>
    </Button>
  )

  const SelectedButton = () => (
    <Button variant='text' color='black'>
      <Box
        borderBottom={`3px solid ${theme.palette.neutral.main}`}
        p={0.5}
      >
        {value}
      </Box >
    </Button >
  )


  return (
    isSelected ? <SelectedButton/> : <NormalButton /> 

  )
}
