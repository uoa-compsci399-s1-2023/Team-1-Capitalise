import { Stack, Chip, useTheme, useMediaQuery } from '@mui/material'
import React, { useContext, useState } from 'react'
import theme from '../../../themes/custom1'
import { ProjectContext } from '../../../routes/ProjectPage'
import EditTagsDialog from '../dialogs/EditTagsDialog'
import { SearchContext } from '../../../app'
import { TTag } from '../../../model/TTag'
import { useNavigate } from 'react-router-dom'

export default function TagsField() {

	const { setFilters, getDefaultFilters } = useContext(SearchContext)
	const { project, checkIsEdit } = useContext(ProjectContext);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const nav = useNavigate()
	const theme = useTheme();

	const handleTagClick = (tag: TTag) => {
		setFilters({
			...getDefaultFilters(),
			keywords: tag.name
		})
		nav('/projects');
	}

	return (
		<Stack
			my={2}
			flexDirection={'row'}
			gap={1}
			flexWrap={'wrap'}
			sx={{
				[theme.breakpoints.down('md')]: {
					width: '100%',
					flexWrap: 'nowrap',
					overflowX: 'auto',
					my: 0
				}
			}}
		>

			<EditTagsDialog {...{ isDialogOpen, setIsDialogOpen }} />

			{project.tags.map((tag) => (
				<Chip
					key={tag._id}
					size='medium'
					label={tag.name}
					clickable
					onClick={() => handleTagClick(tag)}
				/>
			))}

			{checkIsEdit() &&
				<Chip
					variant='outlined'
					size='medium'
					label="Add more"
					clickable
					// sx={{ color: theme.palette.neutral.main }}
					onClick={() => setIsDialogOpen(true)}
				/>
			}

		</Stack>

	)
}
