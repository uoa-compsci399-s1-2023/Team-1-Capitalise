import React, {ChangeEvent, Dispatch, SetStateAction} from 'react'

import { Select, FormControl, InputLabel, MenuItem, Box, TextField, SelectChangeEvent, Typography} from '../mui'

export type TSearchFilterProps = {
  keywords: string,
  category: string,
  semester: string,
  award: string,
  sortby: string,
}

interface props {
  currFilters: TSearchFilterProps,
  setFilters: Dispatch<SetStateAction<TSearchFilterProps>>
}

export default function SearchFilters({currFilters, setFilters}: props ) {
  
  // Need to replace these with api calls
  const categories: string[] =  ['All (Default)', 'Web Development' , 'Data Science',  'Computer Vision', 'Mobile Development']
  const semesters: string[] =  ['All (Default)', 'S1 2022' , 'S2 2022', 'S1 2021', 'S2 2021']
  const awards: string[] = ['All (Default)', 'Excellence', 'Community Impact', 'People\'s choice']
  const sortbys: string[] = ['Time (newest first)', 'Time (oldest first)', 'Most liked', 'Name']

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
      bgcolor="white" 
      width="340px"
      height="100%"
      padding="30px 40px"
      component="div"
      sx={{
        mt: 1,
      }}
    >
      <Typography variant='h5' mb={2} >Refine search</Typography>

      <TextField sx={{ mb: 4 }}
        size = {size}
        id="keywords-textfield"
        label="Keywords"
        name='keywords'
        value={currFilters.keywords}
        onChange={handleChange}
        fullWidth
        variant={variant}
      />

      <FormControl sx={{ mb: 4 }} fullWidth size={size} variant={variant}>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          name="category"
          value={currFilters.category}
          label="Category"
          onChange={handleChange}
        >
          {categories.map((c, i) => <MenuItem key={i} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl sx={{ mb: 4 }} size={size} variant={variant} fullWidth>
        <InputLabel id="semester-select-label">Semester</InputLabel>
        <Select
          labelId="semester-select-label"
          id="semester-select"
          name="semester"
          value={currFilters.semester}
          label="Semester"
          onChange={handleChange}
        >
          {semesters.map((c, i) => <MenuItem key={i} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl sx={{ mb: 4 }} size={size} variant={variant} fullWidth>
        <InputLabel id="award-select-label">Award</InputLabel>
        <Select
          labelId="award-select-label"
          id="award-select"
          name="award"
          value={currFilters.award}
          label="Award"
          onChange={handleChange}
        >
          {awards.map((c, i) => <MenuItem key={i} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl sx={{ mb: 4 }} size={size} variant={variant} fullWidth>
        <InputLabel id="sortby-select-label">Sort by</InputLabel>
        <Select
          labelId="sortby-select-label"
          id="sortby-select"
          name="sortby"
          value={currFilters.sortby}
          label="Sort by"
          onChange={handleChange}
        >
          {sortbys.map((c, i) => <MenuItem key={i} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
    
  )
}



