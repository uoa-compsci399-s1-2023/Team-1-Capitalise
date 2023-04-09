import React, { ChangeEvent, Dispatch, SetStateAction, ReactNode, FC } from 'react'
import { Select, FormControl, InputLabel, MenuItem, Box, TextField, SelectChangeEvent, Typography } from '../mui'

import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';


export type TSearchFilterProps = {
  keywords: string,
  category: string,
  semester: string,
  award: string,
  sortby: string,
}

type TAvailableFilter = {
  name: string,
  options: string[]
}

interface SearchFilterProps {
  currFilters: TSearchFilterProps,
  setFilters: Dispatch<SetStateAction<TSearchFilterProps>>
}


export default function SearchFilters({ currFilters, setFilters }: SearchFilterProps) {
  return (
    <>
      <Box
        bgcolor="white"
        width="340px"
        height="100%"
        padding="30px 40px"
        sx={{
          mt: 1,
          display: { xs: "none", md: "block" }
        }}
      >
        <DesktopSearchFilters currFilters={currFilters} setFilters={setFilters} />
      </Box>

      <Box
        bgcolor="white"
        padding="30px 40px"
        sx={{
          mt: 1,
          display: { xs: "block", md: "none" }
        }}
      >
        <MobileSearchFilters currFilters={currFilters} setFilters={setFilters} />
      </Box>
    </>

  )
}

type FilterDpdownProps = {value: string, name: string, label: string, options: string[], handleChange: (e: any) => void }
function FilterDropdown({value, name, label, options, handleChange}: FilterDpdownProps) {
  return (
    <FormControl sx={{ mb: 4 }} size='small' variant='outlined' fullWidth>
      <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-select-label`}
        id={`${name}-select`}
        name={name}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {options.map((c, i) => <MenuItem key={i} value={c}>{c}</MenuItem>)}
      </Select>
    </FormControl>
  )
}

function DesktopSearchFilters({currFilters, setFilters}: SearchFilterProps) {

  const availFilters = {
    category: ['All (Default)', 'Web Development', 'Data Science', 'Computer Vision', 'Mobile Development'],
    semester: ['All (Default)', 'S1 2022', 'S2 2022', 'S1 2021', 'S2 2021'],
    award: ['All (Default)', 'Excellence', 'Community Impact', 'People\'s choice'],
    sortBy: ['Time (newest first)', 'Time (oldest first)', 'Most liked', 'Name'],
  }

  const size = 'small';
  const variant = 'outlined';

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    console.log(e.target)
    setFilters({
      ...currFilters,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Typography variant='h5' mb={2} >Refine search</Typography>
      <TextField sx={{ mb: 4 }}
        size={size}
        id="keywords-textfield"
        label="Keywords"
        name='keywords'
        value={currFilters.keywords}
        onChange={handleChange}
        fullWidth
        variant={variant}
      />

      <FilterDropdown value={currFilters.category} name='category' label='Category' options={availFilters.category} handleChange={handleChange} />
      <FilterDropdown value={currFilters.semester} name='semester' label='Semester' options={availFilters.semester} handleChange={handleChange} />
      <FilterDropdown value={currFilters.award} name='award' label='Award' options={availFilters.award} handleChange={handleChange} />
      <FilterDropdown value={currFilters.sortby} name='sortby' label='Sort by' options={availFilters.sortBy} handleChange={handleChange} />
    </>
  )
}


interface ChipData {
  key: number;
  label: string;
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

function MobileSearchFilters({ currFilters, setFilters }: SearchFilterProps) {

  const chipData: ChipData[] = [
    { key: 0, label: 'Angular' },
    { key: 1, label: 'jQuery' },
    { key: 2, label: 'Polymer' },
    { key: 3, label: 'React' },
    { key: 4, label: 'Vue.js' },
  ]


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'left',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {chipData.map((data) => {
        return (
          <ListItem key={data.key}>
            <Chip
              label={data.label}
            />
          </ListItem>
        );
      })}
    </Box>
  );
}

