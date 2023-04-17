import React, { ChangeEvent, FormEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Box, TextField, InputAdornment } from "@mui/material";
import { SearchProps } from "./MyPagination";

// Yathi - Added event handler for search bar to make searches.
// Changed wrapper element to div instead of form so the searchbar can take up more space.

const SearchBar = ({ currFilters, setFilters }: SearchProps) => {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      setFilters({
        ...currFilters,
        keywords: (e.target as HTMLTextAreaElement).value
      })
    }
  }


  return (
    // <Box component="form" noValidate autoComplete="off">
    <Box width='80%'>
      <TextField
        onKeyDown={handleKeyDown}
        fullWidth
        id="outlined-basic" // is this unique if the component is reused??
        label=""
        variant="outlined"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      ></TextField>
    </Box>
  );
};

export default SearchBar;
