import React, { SetStateAction, useContext, useState, useEffect, ChangeEvent } from 'react'
import { TProject } from '../../../model/TProject'
import { Dialog, DialogContent, DialogTitle, FormControl, OutlinedInput, DialogActions, Button, FormHelperText, InputLabel, TextField } from '@mui/material'
import { ProjectContext } from '../../../routes/ProjectPage'
import { BallotSharp } from '@mui/icons-material'
import { patchProject } from '../../../api/patchProject'
import { useAuth } from '../../../customHooks/useAuth'
import { uploadPdf } from '../../../api/posterApis'
import LoadingDialog from './LoadingDialog'


interface EditPosterDialogProps {
	tabIndex: number
	blockIndex: number
	isDialogOpen: boolean
	setIsDialogOpen: React.Dispatch<SetStateAction<boolean>>
}

export default function EditPosterDialog({ tabIndex, blockIndex, isDialogOpen, setIsDialogOpen }: EditPosterDialogProps) {

	const { project, setProject } = useContext(ProjectContext);
	const [linkText, setLinkText] = useState('');
	const [subHeading, setSubHeading] = useState(project.content[tabIndex].tabContent[blockIndex].subHeading ?? '') // if undefined set to empty string
	const [linkTextError, setLinkTextError] = useState('');
	const [headingError, setErrorHeading] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [fileError, setFileError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const auth = useAuth();

	// Make sure value is current each time dialog is opened.
	useEffect(() => {
		const linkText = project.content[tabIndex].tabContent[blockIndex].value[1] || '';
		const subHeading = project.content[tabIndex].tabContent[blockIndex].subHeading || '';
		setLinkText(linkText);
		setSubHeading(subHeading);
		setLinkTextError('');
		setErrorHeading('');
	}, [isDialogOpen])

	const handleClose = () => {
		setIsDialogOpen(false);
	};

	const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		const value = e.target.value;
		if (value.length > 50) {
			setLinkTextError('Please keep link text under 50 characters')
		} else if (value.length < 0) {
			setLinkTextError('Please give a display name for the PDF link')
		} else {
			setLinkTextError('')
		}
		setLinkText(e.target.value);
	}

	const handleSubHeadingChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		const heading = e.target.value;
		if (heading.length > 100) {
			setErrorHeading('Please keep heading under 100 characters')
		} else {
			setErrorHeading('')
		}
		setSubHeading(e.target.value);
	}

	const handleFileUploaded = (e: ChangeEvent<HTMLInputElement>) => {
		const existingFile = project.content[tabIndex].tabContent[blockIndex].value[0]
		if (e.target.files) {
			setFile(e.target.files[0]);
			setFileError('')
		} else if (!existingFile) {
			setFileError('Please upload a PDF file.')
		} else {
			setFileError('')
		}
	}

	const handleSave = () => {
		if (!linkTextError && !headingError) {

			(async () => {
				setIsLoading(true);
				let latestProject = project

				const tab = project.content[tabIndex]
				const block = tab.tabContent[blockIndex]
				let posterUrl = '';

				// Upload file and url
				if (file) {
					const formData = new FormData()
					formData.append('poster', file);

					let resp = await uploadPdf(
						project._id,
						project.content[tabIndex].tabName,
						block._id,
						formData
					)
					if (resp.ok) {
						posterUrl = await resp.text()
					} else {
						console.log(await resp.text())
					}
				}

				// const content: TProject['content'] = JSON.parse(JSON.stringify(project.content))
				// content[tabIndex].tabContent[blockIndex].value[1] = linkText
				// Patch PDF URL, subHeading, and link text
				block.value = [posterUrl, linkText]

				if (subHeading !== '') {
					block.subHeading = subHeading
				} else {
					block.subHeading = undefined
				}

				const resp = await patchProject(
					project._id, {content: project.content}, auth.getToken() as string
				)
				if (resp.ok) {
					setProject(await resp.json())
				} else {
					console.log(await resp.text())
				}

				setIsDialogOpen(false);
				setIsLoading(false);
			})()
		}
	};



	return (
		<Dialog
			open={isDialogOpen}
			onClose={handleClose}
			fullWidth
			maxWidth='md'
			PaperProps={{ sx: { p: 2 } }}
		>

			<DialogTitle>Edit Sub-heading</DialogTitle>
			<DialogContent
			>
				<TextField
					hiddenLabel
					placeholder='Enter sub-heading...'
					variant='outlined'
					error={!!headingError}
					helperText={headingError || ' '}
					value={subHeading}
					onChange={handleSubHeadingChange}
					onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} // Save if enter pressed
					fullWidth
				// sx={{ mt: 1}}
				/>
			</DialogContent>

			<DialogTitle>Edit Link Text</DialogTitle>
			<DialogContent>
				<TextField
					hiddenLabel
					placeholder='Enter a display name for pdf...'
					variant='outlined'
					error={!!linkTextError}
					helperText={linkTextError || ' '}
					value={linkText}
					onChange={handleValueChange}
					onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
					fullWidth
				// sx={{ mt: 1, mb: 1 }}
				/>
			</DialogContent>

			<DialogTitle>Upload PDF</DialogTitle>
			<DialogContent>
				{/* File input */}
				<TextField
					variant='outlined'
					type='file'
					error={!!fileError}
					helperText={fileError || ' '}
					onChange={(e) => handleFileUploaded(e as ChangeEvent<HTMLInputElement>)}
					fullWidth
					inputProps={{
						accept: ".pdf",
					}}
				/>
			</DialogContent>


			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleSave}>Save</Button>
			</DialogActions>
		</Dialog >

	)
}