import { Select, FormControl, InputLabel, MenuItem } from '../../mui'

export type FilterDpdownProps = { value: string, name: string, label: string, options: string[], handleChange?: (e: any) => void }
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
        {options.map((c, i) => <MenuItem key={i} value={c}>{c}</MenuItem>)}
      </Select>
    </FormControl>
  )
}