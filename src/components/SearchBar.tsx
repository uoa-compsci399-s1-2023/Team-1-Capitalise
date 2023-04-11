import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { Grow, InputAdornment } from "@mui/material";

const SearchBar = ({ isFullWidth }: {isFullWidth?: boolean} ) => {

  const fullWidth: string = isFullWidth ? 'fullWidth' : ''

  return (
    // <Box component="form" noValidate autoComplete="off">
    <Box width='80%'> 
      <TextField
        fullWidth
        id="outlined-basic"
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
