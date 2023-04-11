import { Select, FormControl, InputLabel, MenuItem } from '../../mui'
import { TAvailParameters } from '../../api/getSearchParameters'

export type FilterDpdownProps = { 
  value: string, 
  name: string, 
  label: string, 
  options: TAvailParameters[keyof TAvailParameters], // Accepts any value of TAvailParameters
  handleChange?: (e: any) => void 
}

export default function FilterDropdown({ value, name, label, options, handleChange }: FilterDpdownProps) {
  return (
    <FormControl sx={{ mb: 4 }} size='small' variant='outlined' fullWidth>
      <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-select-label`}
        id={`${name}-select`}
        name={name}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {options.map(({_id, value}) => <MenuItem key={_id} value={value}>{value}</MenuItem>)}
      </Select>
    </FormControl>
  )
}