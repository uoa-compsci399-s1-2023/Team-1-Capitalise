
import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Box, TextField, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SearchContext, getDefaultFilters } from "../app";
import { searchFilterParams } from "./search/AvailableParams";

// Yathi - Added event handler for search bar to make searches.
// Changed wrapper element to div instead of form so the searchbar can take up more space.

const SearchBar = () => {
  const navigate = useNavigate();
  const { currFilters, setFilters } = useContext(SearchContext);
  const [value, setValue] = useState<string>('');

  // Clear keyword on mount
  useEffect(() => {
    setValue('')
  }, [])


  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      // reset all filters except keyword
      setFilters({
        ...getDefaultFilters(),
        keywords: (e.target as HTMLTextAreaElement).value,
      });
      navigate("/projects");//12/04/2023 - 11pm Daniel - Added navigate to /projects when searching from any other page.
    }
  }


  return (
    // <Box component="form" noValidate autoComplete="off">
    <Box width='80%'>
      <TextField
        onKeyDown={handleKeyDown}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        id="global-searchbar"
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
