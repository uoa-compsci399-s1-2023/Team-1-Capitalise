import React, { FC, useState, useRef } from 'react'

import { styled, TextField, Container, Typography, useTheme, Input, Box, Button } from '@mui/material'
import ContentBlock from './ContentBlock'
import EditIcon from '@mui/icons-material/Edit';
import useComponentVisible from '../../customHooks/useComponentVisible';
import FilterDropdown, { FilterDpdownProps } from '../search/FilterDropdown';
import EditTextDialog from './EditTextDialog'



interface FieldProps {
  label: string
  text: string
  type: 'text' | 'dropdown'
  name: string
  params?: FilterDpdownProps['options']
}

export default function EditableTextField({ label, text, name, type, params }: FieldProps) {

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const [isOpen, setIsOpen] = React.useState(false);


  // const [isInput, setIsInput] = useState(false);
  const [value, setValue] = useState(text);
  const [savedText, setSavedText] = useState(text);
  const btnRef = useRef<HTMLButtonElement>(null);
  const theme = useTheme();

  const EditButton = styled(Button)({
    height: "100%",
    visibility: 'hidden',
    flex: '1',
    ':hover': {
      backgroundColor: theme.customColors.DividerGrey
    }
  });

  const handleMouseIn = () => {
    btnRef.current && (btnRef.current.style.visibility = 'visible');
  }

  const handleMouseOut = () => {
    btnRef.current && (btnRef.current.style.visibility = 'hidden');
  }

  const handleKeyDown = (e: any) => {
    if (e.key == 'Enter') {
      setSavedText(e.target.value)
      setIsComponentVisible(false)
    }
  }

  const TextInput = () => (
    <TextField
      size='small'
      sx={{ width: '140px' }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  )
  const DropDownInput = () => (
    <FilterDropdown value={text} name={name} label={label} options={params!} handleChange={(e) => console.log(e.target.value)} />
  )

  return (
    <>
    <EditTextDialog value={value} setValue={setValue} isOpen={isOpen} setIsOpen={setIsOpen} fieldName={name} />
      <Box
        width='100%'
        display='flex'
        flexDirection={'row'}
        alignItems={'center'}
        onMouseEnter={handleMouseIn}
        onMouseLeave={handleMouseOut}
      >
        <Typography fontWeight={400} width={'100px'} variant="body1">{label}</Typography>
        {/* <div ref={ref} style={{ width: '140px' }} >
          {isComponentVisible ?
            (type == 'text' ? <TextInput/> : <DropDownInput/>)
            :
            <Typography fontWeight={300} variant="body1">{savedText}</Typography>
          }
        </div> */}

        <Typography width={140} fontWeight={300} variant="body1">{savedText}</Typography>

        <EditButton
          ref={btnRef}
          // onClick={() => setIsComponentVisible(true)}
          onClick={() => setIsOpen(true)}
          color='editBtnGrey'
        ><EditIcon fontSize='small' /></EditButton>
      </Box>
    </>
  )
}
