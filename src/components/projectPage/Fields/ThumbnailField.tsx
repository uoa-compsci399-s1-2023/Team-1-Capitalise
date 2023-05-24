import { Stack, Typography, Button, useTheme } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { ProjectContext } from '../../../routes/ProjectPage'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import { getDefaultThumbnails, removeThumbnail } from '../../../api/projectThumbnailApi'
import EditThumbnailDialog from '../dialogs/EditThumbnailDialog'

export default function ThumbnailField() {

	const { project, setProject, checkIsEdit } = useContext(ProjectContext);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [defaultThumbnails, setDefaultThumbnails] = useState<string[]>([]);
	const theme = useTheme();

	useEffect(() => {
		getDefaultThumbnails()
			.then(resp => {
				if (resp.ok) {
					resp.json().then(data => setDefaultThumbnails(data))
				} else {
					resp.text().then(err => console.log(err));
				}
			})
	}, [])

	const handleRemoveThumbnail = () => {
		const isConfirm = window.confirm("Are you sure you want to remove the project thumbnail?");
		if (isConfirm) {
			setIsLoading(true);
			removeThumbnail(project._id)
				.then(resp => resp.json())
				.then(data => {
					if (data.msg) {
						console.log(data.msg);
					} else {
						setProject(data);
					}
				}).finally(() => {
					setIsLoading(false)
				})
		}
	}

	return (
		checkIsEdit() ?
			<Stack
				my={4}
				flexDirection={'row'}
				alignItems={'center'}
			>
				<EditThumbnailDialog
					{...{ isLoading, setIsLoading, isDialogOpen, setIsDialogOpen }}
				/>

				<img
					height={'100px'}
					width={'250px'}
					src={project.thumbnail}
					style={{
						borderRadius: '10px',
						objectFit: 'cover'
					}}
				/>
				<Stack
					ml={3}
					gap={2}
				>
					<Typography variant="h6">Project Thumbnail</Typography>

					<Stack flexDirection={'row'} gap={1}>
						{!defaultThumbnails.includes(project.thumbnail) &&
							<Button
								startIcon={<ClearIcon />}
								color='black'
								variant='outlined'
								size='small'
								// disableRipple
								onClick={() => handleRemoveThumbnail()}
							>
								Remove
							</Button>
						}

						<Button
							startIcon={<EditIcon />}
							color='black'
							variant='outlined'
							size='small'
							// disableRipple
							onClick={() => setIsDialogOpen(true)}
						>
							Edit
						</Button>

					</Stack>

				</Stack>
			</Stack>
			:
			null
	)
}
