import { Select, FormControl, InputLabel, MenuItem } from '../../mui'
import { TAvailParameters } from './AvailableParams'

export type FilterDpdownProps = { 
  value: string, 
  name: string, 
  label: string, 
  options: TAvailParameters[keyof TAvailParameters], // Accepts any value of TAvailParameters
  handleChange: (e: any) => void 
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
        {options.map((o) => <MenuItem key={o._id} value={o.value}>{o.value}</MenuItem>)}
      </Select>
    </FormControl>
  )
}