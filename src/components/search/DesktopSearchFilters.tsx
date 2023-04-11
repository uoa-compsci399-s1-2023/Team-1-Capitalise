import React, { useEffect, useState, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { Box, TextField, SelectChangeEvent, Typography } from '../../mui'
import getSearchParams, { TAvailParameters } from "../../api/getSearchParameters";
import FilterDropdown from './FilterDropdown'

// Represents curr state filters
export type TSearchFilterProps = {
  keywords: string,
  category: string,
  semester: string,
  award: string,
  sortby: string,
}

// represents props taken by DesktopSearchFilters and MobileSearchFilters
export interface SearchFilterProps {
  currFilters: TSearchFilterProps,
  setFilters: Dispatch<SetStateAction<TSearchFilterProps>>
}

// Returns new object literal of default params each time.
export const getDefaultParams = (): TAvailParameters => {
  return {
    category: [{ _id: '0', value: "All (Default)", parameterType: "category" }],
    semester: [{ _id: '0', value: "All (Default)", parameterType: "semester" }],
    award: [{ _id: '0', value: "All (Default)", parameterType: "award" }],
    sortBy: [
      {_id:'0', qParam: "name", value: "Name (Default)", parameterType: "sortBy"},
      {_id:'1', qParam: "semester", value: "Semester", parameterType: "sortBy"},
      {_id:'2', qParam: "category", value: "Category", parameterType: "sortBy"},
      {_id:'3', qParam: "likes", value: "Likes", parameterType: "sortBy"},
      {_id:'4', qParam: "badges", value: "Awards", parameterType: "sortBy"}
    ]
  }
}

export default function DesktopSearchFilters({ currFilters, setFilters }: SearchFilterProps) {

  const size = 'small';
  const variant = 'outlined';

  const [params, setParams] = useState<TAvailParameters>(getDefaultParams())

  // Fetch available search parameters on initial render
  useEffect(() => {
    async function getParams() {
      const [cats, sems, awards, sorts] = await getSearchParams();
      setParams({
        category: [...(getDefaultParams().category), ...cats],
        semester: [...(getDefaultParams().semester), ...sems],
        award: [...(getDefaultParams().award), ...awards],
        // sortBy: [...(getDefaultParams().sortBy), ...sorts],
        sortBy: [...(getDefaultParams().sortBy)], // Is there a default sort by???
      })
    }
    getParams();
  }, [])

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

        <FilterDropdown value={currFilters.category} name='category' label='Category' options={params.category} handleChange={handleChange} />
        <FilterDropdown value={currFilters.semester} name='semester' label='Semester' options={params.semester} handleChange={handleChange} />
        <FilterDropdown value={currFilters.award} name='award' label='Award' options={params.award} handleChange={handleChange} />
        <FilterDropdown value={currFilters.sortby} name='sortby' label='Sort by' options={params.sortBy} handleChange={handleChange} />
      </Box>
    </Box>
  )
}

