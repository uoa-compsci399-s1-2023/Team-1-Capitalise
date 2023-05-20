import { Stack, Chip } from '@mui/material'
import React, { useContext, useState } from 'react'
import theme from '../../../themes/custom1'
import { ProjectContext } from '../../../routes/ProjectPage'
import EditTagsDialog from '../dialogs/EditTagsDialog'

export default function TagsField() {

	const { project, checkIsEdit } = useContext(ProjectContext);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	return (
		<Stack my={2} flexDirection={'row'} gap={1} flexWrap={'wrap'}>

			<EditTagsDialog {...{ isDialogOpen, setIsDialogOpen }} />

			{project.tags.map((tag) => (
				<Chip key={tag._id} size='medium' label={tag.name} />
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
