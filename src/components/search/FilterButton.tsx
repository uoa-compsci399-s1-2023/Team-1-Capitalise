
import * as React from 'react';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import { SearchFilterProps } from './DesktopSearchFilters';

const CustomButton = styled(Button)({
  textTransform: 'none',
  // fontSize: 16,
  whiteSpace: 'nowrap',
  borderRadius: '20px'
})


export type FilterChipProps = { value: string, label: string, name: string, options: string[], filtersState: SearchFilterProps }
export default function FilterButton({value, name, label, options, filtersState}: FilterChipProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  
  const {currFilters, setFilters} = filtersState;

  const open = Boolean(anchorEl);
  
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    selectedOption: string
  ) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    setFilters({
      ...currFilters,
      [name]: selectedOption
    })
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <CustomButton
        color='info'
        variant='outlined'
        id={`${name}-button`}
        aria-haspopup="listbox"
        aria-controls="lock-menu"
        aria-label={`${name} search filter`}
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClickListItem}
        size="small"
      >
        {`${label}: ${options[selectedIndex]}`}
      </CustomButton>


      <Menu
        id={`${name}-button`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `${name}-button`,
          role: 'listbox',
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index, option)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}