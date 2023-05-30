import { useContext } from 'react'
import { Box, Stack } from '@mui/material'
import FilterButton from './FilterButton'
import { SearchContext } from '../../app'
// import SearchBar from '../SearchBar'
import MobileSearchBar from './MobileSearchBar'
import { searchFilterParams } from './AvailableParams'



export default function MobileSearchFilters() {

  const { currFilters, setFilters } = useContext(SearchContext);

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
      <MobileSearchBar />
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
        <FilterButton label='Category' name='category' options={searchFilterParams.category} />
        <FilterButton label='Semester' name='semester' options={searchFilterParams.semester} />
        <FilterButton label='Award' name='award' options={searchFilterParams.award} />
        <FilterButton label='Sort by' name='sortBy' options={searchFilterParams.sortBy} />
      </Box>
    </Stack>


  )
}
