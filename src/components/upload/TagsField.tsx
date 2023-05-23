import { CircularProgress, Autocomplete, TextField, Stack, Chip } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { searchTags } from '../../api/tagAPIs';
import { TTag } from '../../model/TTag';
import { TProjectInfo } from '../../routes/Upload';
import { AutocompleteOption } from '../projectPage/dialogs/EditTagsDialog';

interface TagsFieldProps {
	selectedTags: string[]
	setSelectedTags: Dispatch<SetStateAction<string[]>>
	projectInformation: TProjectInfo
	tagErrorText: string
}

// This is a copy paste from EditTagsDialog. It's a shitty way of doing things I know. 
// We have to refactor this later so that both components use the same Autocomplete box. 

export default function TagsField({ selectedTags, setSelectedTags, projectInformation, tagErrorText }: TagsFieldProps) {

	const [inputValue, setInputValue] = useState('');
	const [isResultsLoading, setIsResultsLoading] = useState(false);
	const [options, setOptions] = useState<AutocompleteOption[]>([]);
	const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null);

	// Fetches tags based on keyword
	// ...doesn't do search if keyword is empty string
	useEffect(() => {
		if (inputValue !== '') {
			setIsResultsLoading(true)
			searchTags(inputValue, 0)
				.then((resp) => {
					if (resp.ok) {
						resp.json().then((results: TTag[]) => {
							results.splice(5) // Only care about 5 results
							setOptions(results.map((result: TTag) => (
								{ label: result.name, tag: result }) // Create select option for each tag
							))
						})
					}
				}).finally(() => {
					setIsResultsLoading(false);
					if (!inputValue) {
						setOptions([]);
					}
				})
		} else {
			setOptions([]);
		}
	}, [inputValue])

	function handleTagRemove(tagName: string): void {
		const index = selectedTags.indexOf(tagName);
		selectedTags.splice(index, 1);
		setSelectedTags(selectedTags.map(s => s));
	}

  const handleTagSelected = (selectedOption: AutocompleteOption | null) => {
    if (selectedOption && !selectedTags.includes(selectedOption.tag.name)) {
      selectedTags.push(selectedOption.tag.name)
      setSelectedTags(selectedTags);
      setInputValue('')
    }
  }

	return (
		<>
			<Stack 
				flexDirection={'row'} 
				flexWrap={'wrap'}
				sx={{
					display: selectedTags.length > 0 ? 'flex' : 'none',
					mb: 1
				}}
			>
				{selectedTags.map(tagName => {
					return <Chip
						key={tagName}
						size='medium'
						label={tagName}
						onDelete={() => handleTagRemove(tagName)}
						sx={{
							m: 0.5
						}}
					/>
				})}
			</Stack>

			<Autocomplete
				popupIcon={null}
				disablePortal
				blurOnSelect
				autoComplete
				noOptionsText={'No results'}
				// Don't show results already added
				filterOptions={(x, params) => {
					const { inputValue } = params;
					// Suggest the creation of a new value
					const isExisting = options.some((option) => inputValue.trim().toLowerCase() === option.tag.name.toLowerCase());
					if (inputValue !== '' && !isExisting) {
						x.push({
							label: `Add new tag "${inputValue.trim()}"`,
							tag: { _id: inputValue.trim(), name: inputValue.trim() },
							isNew: true
						});
					}
					const filtered: AutocompleteOption[] = x.filter(o => !selectedTags.some(st => st.toLowerCase() === o.tag.name.toLowerCase()));
					return filtered;
				}}
				loading={isResultsLoading}
				// For controlled component
				inputValue={inputValue}
				onInputChange={(evt, value) => setInputValue(value)}
				value={selectedOption}
				onChange={(evt, option) => handleTagSelected(option)}
				// No dropdown if theres no value entered.
				componentsProps={{
					paper: {
						sx: {
							display: inputValue === '' ? 'none' : 'block'
						}
					}
				}}
				isOptionEqualToValue={(option, value) => option.tag._id === value.tag._id}
				options={options}
				sx={{ width: '100%' }}
				renderOption={(props, option) => {
					return (
						<li
							{...props}
							key={option.tag._id}
							// Display add option in different colour
							style={{
								fontWeight: option.tag._id === option.tag.name ? 450 : 400
							}}
						>
							{option.label}
						</li>
					);
				}}
				renderInput={(params) => (
					<TextField {...params}
						error={!!tagErrorText}
						helperText={tagErrorText}
						fullWidth
						hiddenLabel
						placeholder='Add tags...'
						size='small'
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<React.Fragment>
									{isResultsLoading ? <CircularProgress color="primary" size={20} /> : null}
									{params.InputProps.endAdornment}
								</React.Fragment>
							),
						}}
					/>
				)}
			/>
		</>
	)
}
