import { Autocomplete, TextField } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { searchTags } from '../../api/tagAPIs';
import { TTag } from '../../model/TTag';
import { TProjectInfo } from '../../routes/Upload';

interface AutocompleteOption {
  displayName: string;
  tagName: string;
  isSuggestion: boolean
  // isSelected: boolean
}

interface TagsFieldProps {
	selectedTags: string[]
	setSelectedTags: Dispatch<SetStateAction<string[]>>
	projectInformation: TProjectInfo
	tagErrorText: string
}

export default function TagsField({selectedTags, setSelectedTags, projectInformation, tagErrorText}: TagsFieldProps) {

	const [tagsInputValue, setTagsInputValue] = useState('');
  const [isResultsLoading, setIsResultsLoading] = useState(false);
  const [tagOptions, setTagOptions] = useState<AutocompleteOption[]>([])
  const [selectedOptions, setSelectedOptions] = useState<AutocompleteOption[]>([])
  
	// useEffect(() => {
	// 	// Set options to currently selected tags
	// 	setTagOptions(selectedTags.map(st => (
	// 		{
	// 			displayName: st,
	// 			tagName: st,
	// 			isSuggestion: false,
	// 			// isSelected: true
	// 		}
	// 	)))
	// 	// setTagOptions([])

  //   if (tagsInputValue !== '') {
  //     setIsResultsLoading(true)
  //     searchTags(tagsInputValue.trim(), 0)
  //       .then((resp) => {
  //         if (resp.ok) {
  //           resp.json().then((results: TTag[]) => {
  //             const filteredResults = results.filter(result => {
  //               return !selectedTags.includes(result.name);
  //             }) // Only care about 5 results
  //             filteredResults.splice(5)
  //             // Create select option for each tag
	// 						const searchOptions = filteredResults.map(result => (
  //               {
  //                 displayName: result.name,
  //                 tagName: result.name,
  //                 isSuggestion: false,
  //                 // isSelected: false
  //               }
  //             ))

	// 						// concat search options and selected options
  //             setTagOptions(tagOptions.concat(searchOptions));
  //           })
  //         }
  //       }).finally(() => {
  //         setIsResultsLoading(false);
  //         if (!tagsInputValue) {
  //           setTagOptions([]);
  //         }
  //       })
  //   } else {
  //     setTagOptions([]);
  //   }
  // }, [tagsInputValue])
	
	return (
		// <Autocomplete
		// 	multiple
		// 	id="tags-filled"
		// 	popupIcon={null}
		// 	disablePortal
		// 	autoComplete
		// 	noOptionsText={'No results'}
		// 	loading={isResultsLoading}
		// 	// defaultValue={projectInformation.tags}
		// 	options={tagOptions}
		// 	// value={selectedOptions}
		// 	getOptionLabel={(option) => option.tagName}
		// 	isOptionEqualToValue={(option, value) => {
		// 		const output = option.tagName === value.tagName
		// 		// console.log(output)
		// 		return true
		// 	}}
		// 	// Don't show suggestions if nothing is entered
		// 	componentsProps={{
		// 		paper: {
		// 			sx: {
		// 				display: tagsInputValue === '' ? 'none' : 'block'
		// 			}
		// 		}
		// 	}}
		// 	onInputChange={(e, v) => setTagsInputValue(v)}
		// 	onChange={(event, value) => {
		// 		console.log(value)
		// 		// setSelectedTags(selectedOptions.map(o => o.tagName));
		// 		tagOptions.push(value)
		// 		setSelectedOptions(value)
		// 	}}
		// 	filterOptions={(options, params) => {
		// 		// Remove tags already selected from options
		// 		const filtered = options.filter(o => !selectedTags.includes(o.tagName));
		// 		// const filtered = options
		// 		const { inputValue } = params;
		// 		// Suggest the creation of a new value if its not in the results
		// 		const isExisting = options.some((option) => inputValue.toLowerCase().trim() === option.tagName.toLowerCase());
		// 		if (inputValue !== '' && !isExisting) {
		// 			filtered.splice(0, 0, {
		// 				displayName: `Add new tag "${inputValue.trim()}"`,
		// 				tagName: inputValue.trim(),
		// 				isSuggestion: true
		// 			});
		// 		}
		// 		return filtered;
		// 	}}

		// 	// freeSolo
		// 	// renderTags={(selectedOptions, getTagProps) =>
		// 	//   selectedOptions.map((option, index) => (
		// 	//     <Chip
		// 	//       variant="outlined"
		// 	//       label={option}
		// 	//       {...getTagProps({ index })}
		// 	//     />
		// 	//   ))
		// 	// }
		// 	renderInput={(params) => (
		// 		<TextField
		// 			{...params}
		// 			variant="outlined"
		// 			label="Project Tags"
		// 			error={!!tagErrorText}
		// 			helperText={tagErrorText ? tagErrorText : ''}
		// 		/>
		// 	)}
		// 	renderOption={(props, option) => {
		// 		return (
		// 			<li
		// 				{...props}
		// 				key={option.tagName}
		// 				// Display add option in different colour
		// 				style={{
		// 					fontWeight: option.isSuggestion ? 450 : 400
		// 				}}
		// 			>
		// 				{option.displayName}
		// 			</li>
		// 		);
		// 	}}

		// />
		null
	)
}
