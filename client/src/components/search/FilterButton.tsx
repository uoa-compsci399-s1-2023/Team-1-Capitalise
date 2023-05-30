
import React, { useEffect } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
// import { SearchProps } from '../projects/MyPagination';
import { SearchContext, TFiltersState } from '../../app';
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
}


export default function FilterButton({ name, label, options }: FilterChipProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { currFilters, setFilters } = React.useContext(SearchContext);

  const open = Boolean(anchorEl);

  useEffect(() => {
    let selectedOption = ''
    
    switch(name) {
      case 'category':
        selectedOption = currFilters.category.value
        break;
      case 'award':
        selectedOption = currFilters.award.value
        break;
      case 'sortBy':
        selectedOption = currFilters.sortBy.value
        break;
      case 'semester':
        selectedOption = currFilters.semester.value
    }

    if (selectedOption) {
      const index = options.findIndex(o => o.value === selectedOption)
      setSelectedIndex(index);
    }
  }, [currFilters])

  const handleClickButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    // event: React.MouseEvent<HTMLElement>,
    index: number,
    selectedOption: TAvailParameters[keyof TAvailParameters][0]
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