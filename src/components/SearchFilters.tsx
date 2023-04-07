import React, {useState} from 'react'

import { Select, FormControl, InputLabel, MenuItem, Box} from '../mui'
import TextField from '@mui/material/TextField'


export default function SearchFilters() {
  
  const [keywords, setKeywords] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedAward, setSelectedAward] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Need to replace these with api calls
  const categories: string[] =  ['All (Default)', 'Web Development' , 'Data Science',  'Computer Vision', 'Mobile App']
  const semesters: string[] =  ['All (Default)', '2022 Sem 1' , '2022 Sem 2', '2023 Sem 1']
  const awards: string[] = ['All (Default)', 'Excellence', 'Community Impact', 'People\'s choice']
  const sortbys: string[] = ['Time (newest first)', 'Time (oldest first)', 'Most liked', 'Name']

  const size = 'small';
  const variant = 'outlined';

  return (
    <Box
      component="form"
      sx={{
        mt: 1,
      }}
      noValidate
      autoComplete="off"
    >
      <h2>Refine search</h2>

      <TextField sx={{ mt: 2, mb: 4 }}
        size = {size}
        id="keywords-textfield"
        label="Keywords"
        value={keywords}
        onChange={e => setKeywords(e.target.value)}
        fullWidth
        variant={variant}
      />

      <FormControl sx={{ mb: 4 }} fullWidth size={size} variant={variant}>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={selectedCategory}
          label="Category"
          onChange={e => setSelectedCategory(e.target.value)}
        >
          {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl sx={{ mb: 4 }} size={size} variant={variant} fullWidth>
        <InputLabel id="semester-select-label">Semester</InputLabel>
        <Select
          labelId="semester-select-label"
          id="semester-select"
          value={selectedSemester}
          label="Semester"
          onChange={e => setSelectedSemester(e.target.value)}
        >
          {semesters.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl sx={{ mb: 4 }} size={size} variant={variant} fullWidth>
        <InputLabel id="award-select-label">Award</InputLabel>
        <Select
          labelId="award-select-label"
          id="award-select"
          value={selectedAward}
          label="Award"
          onChange={e => setSelectedAward(e.target.value)}
        >
          {awards.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl sx={{ mb: 4 }} size={size} variant={variant} fullWidth>
        <InputLabel id="sortby-select-label">Sort by</InputLabel>
        <Select
          labelId="sortby-select-label"
          id="sortby-select"
          value={sortBy}
          label="Sort by"
          onChange={e => setSortBy(e.target.value)}
        >
          {sortbys.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
    
  )
}



