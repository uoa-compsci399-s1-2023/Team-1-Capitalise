
import * as React from 'react';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import { SearchFilterProps } from './DesktopSearchFilters';
import { TAvailParameters } from './AvailableParams'


const CustomButton = styled(Button)({
  textTransform: 'none',
  whiteSpace: 'nowrap',
  borderRadius: '20px'
})


export type FilterChipProps = { 
  // value: string, 
  label: string, 
  name: string, 
  options: TAvailParameters[keyof TAvailParameters], // Accepts any value of TAvailParameters
  filtersState: SearchFilterProps }


export default function FilterButton({name, label, options, filtersState}: FilterChipProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const {currFilters, setFilters} = filtersState;

  const open = Boolean(anchorEl);
  
  const handleClickButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    // event: React.MouseEvent<HTMLElement>,
    index: number,
    selectedOption: TAvailParameters[keyof TAvailParameters][0]
    ) => {
    console.log(currFilters.sortBy)
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
        onClick={handleClickButton}
        size="small"
      >
        {`${label}: ${options[selectedIndex]['value']}`}
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
        {options.map((param, index) => (
          <MenuItem
            key={param._id}
            selected={index === selectedIndex}
            onClick={() => handleMenuItemClick(index, param)}
          >
            {param.value}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}