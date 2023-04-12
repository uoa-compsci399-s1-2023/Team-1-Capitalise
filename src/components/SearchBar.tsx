
import React, { ChangeEvent, FormEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { SearchFilterProps } from "./search/DesktopSearchFilters";
import { useNavigate } from "react-router-dom";//12/04/2023 - 11pm Daniel - Added navigate to /projects when searching from any other page.

// Yathi - Added event handler for search bar to make searches.
// Changed wrapper element to div instead of form so the searchbar can take up more space.

const SearchBar = ({ currFilters, setFilters }: SearchFilterProps) => {
  const navigate = useNavigate();
  const handleKeyDown = (e: any) => {
    // Check if enter key is pressed
    if (e.keyCode === 13) {
      setFilters({
        ...currFilters,
        keywords: (e.target as HTMLTextAreaElement).value
      });
      navigate("/projects");//12/04/2023 - 11pm Daniel - Added navigate to /projects when searching from any other page.
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
