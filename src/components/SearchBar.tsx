import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";

const SearchBar = () => {
  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
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
