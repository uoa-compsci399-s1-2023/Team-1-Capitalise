import React, { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { Box, TextField, SelectChangeEvent, Typography } from '../../mui'

import FilterDropdown from './FilterDropdown'

export const availFilters = {
  category: ['All (Default)', 'Web Development', 'Data Science', 'Computer Vision', 'Mobile Development'],
  semester: ['All (Default)', 'S1 2022', 'S2 2022', 'S1 2021', 'S2 2021'],
  award: ['All (Default)', 'Excellence', 'Community Impact', 'People\'s choice'],
  sortBy: ['Time (newest first)', 'Time (oldest first)', 'Most liked', 'Name'],
}


export type TSearchFilterProps = {
  keywords: string,
  category: string,
  semester: string,
  award: string,
  sortby: string,
}

export interface SearchFilterProps {
  currFilters: TSearchFilterProps,
  setFilters: Dispatch<SetStateAction<TSearchFilterProps>>
}


export default function DesktopSearchFilters({ currFilters, setFilters }: SearchFilterProps) {

  const size = 'small';
  const variant = 'outlined';

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setFilters({
      ...currFilters,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Box
      top="8vh"
      position="fixed"
      bgcolor="white"
      width="340px"
      height="92vh"
      padding="30px 40px"
      sx={{
        display: { xs: "none", md: "block" }
      }}
    >
      <Box mt={3}>
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
      </Box>
    </Box>
  )
}

