import React, { useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Box, TextField, InputAdornment } from "@mui/material";
import { SearchContext } from "../../app";

const MobileSearchBar = () => {
  const { currFilters, setFilters } = useContext(SearchContext);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      setFilters({
          ...currFilters,
        keywords: (e.target as HTMLTextAreaElement).value,
      });
    }
  }


  return (
    <Box width='80%'>
      <TextField
        onKeyDown={handleKeyDown}
        fullWidth
        id="mobile-search-bar"
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

export default MobileSearchBar;
