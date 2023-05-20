import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Box, TextField, InputAdornment } from "@mui/material";
import { SearchContext } from "../../app";

const MobileSearchBar = () => {
  const { currFilters, setFilters } = useContext(SearchContext);
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(currFilters.keywords)
  }, [currFilters])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilters({
      ...currFilters,
      keywords: e.target.value,
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleChange
    }
  }

  return (
    <Box width='80%'>
      <TextField
        placeholder="Search projects..."
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={value}
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
