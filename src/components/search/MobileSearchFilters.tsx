import React, { useEffect, useState, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { Box, Container } from '../../mui'
import FilterButton from './FilterButton'
import { SearchFilterProps, getDefaultParams } from './DesktopSearchFilters'
import getSearchParams, { TAvailParameters } from '../../api/getSearchParameters'
import SearchBar from '../SearchBar'
import { Stack } from '@mui/system'


export default function MobileSearchFilters({ currFilters, setFilters }: SearchFilterProps) {
  
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

  return (
    <Stack
      // bgcolor="white"
      padding="20px 20px"
      justifyContent="center"
      alignItems="center"
      flexDirection={"column"}
      gap={2}
      sx={{
        mt: 1,
        display: { xs: "flex", md: "none" },
      }}
    >
      <SearchBar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          flexWrap: "wrap",
          margin: 0,
          overflow: "auto",
        }}

      >
        <FilterButton value={currFilters.category} label='Category' name='category' options={params.category} filtersState={{ currFilters, setFilters }} />
        <FilterButton value={currFilters.semester} label='Semester' name='semester' options={params.semester} filtersState={{ currFilters, setFilters }} />
        <FilterButton value={currFilters.award} label='Award' name='award' options={params.award} filtersState={{ currFilters, setFilters }} />
        <FilterButton value={currFilters.sortby} label='Sort by' name='sortby' options={params.sortBy} filtersState={{ currFilters, setFilters }} />
      </Box>
    </Stack>


  )
}
