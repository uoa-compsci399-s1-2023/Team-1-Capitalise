import { Box, Container } from '../../mui'
import FilterButton from './FilterButton'
import { SearchFilterProps, availFilters } from './DesktopSearchFilters'
import SearchBar from '../SearchBar'
import { Stack } from '@mui/system'


export default function MobileSearchFilters({ currFilters, setFilters }: SearchFilterProps) {

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
        <FilterButton value={currFilters.category} label='Category' name='category' options={availFilters.category} filtersState={{ currFilters, setFilters }} />
        <FilterButton value={currFilters.semester} label='Semester' name='semester' options={availFilters.semester} filtersState={{ currFilters, setFilters }} />
        <FilterButton value={currFilters.award} label='Award' name='award' options={availFilters.award} filtersState={{ currFilters, setFilters }} />
        <FilterButton value={currFilters.sortby} label='Sort by' name='sortby' options={availFilters.sortBy} filtersState={{ currFilters, setFilters }} />
      </Box>
    </Stack>


  )
}
