import React, { SetStateAction, useContext, useState, ChangeEvent } from 'react'
import { TProject } from '../../../model/TProject'
import { Dialog, DialogContent, DialogTitle, Grid, DialogActions, useTheme, Button, TextField, Box, Stack, OutlinedInput, Typography } from '@mui/material'
import { ProjectContext } from '../../../routes/ProjectPage'
import ImgThumbnail from '../ImgThumbnail'
import DeleteIcon from '@mui/icons-material/Delete';
import { addGalleryImgs } from '../../../api/addGalleryImg'
import { deleteGalleryImgs } from '../../../api/deleteGalleryImgs'
import CircularProgress from '@mui/material/CircularProgress';


interface GalleryBlockDialogProps {
  tabIndex: number
  blockIndex: number
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<SetStateAction<boolean>>
  initialUrls: string[]
}



export default function GalleryBlockDialog({ tabIndex, blockIndex, isDialogOpen, setIsDialogOpen, initialUrls }: GalleryBlockDialogProps) {

  const { project, setProject, setProjectChanges } = useContext(ProjectContext);
  const [imgUrls, setImgUrls] = useState(initialUrls);
  const [imgsToDelete, setImgsToDelete] = useState<string[]>([])
  const [newImgFiles, setNewImgFiles] = useState<(File | '')[]>([])
  const [subHeading, setSubHeading] = useState(project.content[tabIndex].tabContent[blockIndex].subHeading ?? '') // if undefined set to empty string
  const [valueError, setValueError] = useState('');
  const [headingError, setErrorHeading] = useState('');
  const theme = useTheme();

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleFileAdded = () => {
    const newFiles = [...newImgFiles]
    newFiles.push('')
    setNewImgFiles(newFiles);
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = [...newImgFiles];
    newFiles.splice(index, 1);
    setNewImgFiles(newFiles);
  }

  const handleFileUploaded = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files) {
      const file = e.target.files[0]
      newImgFiles[index] = file
    }
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

  const handleSave = () => {
    if (!valueError && !headingError) {

      // Get current content, and change the required block value.
      const content: TProject['content'] = JSON.parse(JSON.stringify(project.content))
      // content[tabIndex].tabContent[blockIndex].value = [value,]
      if (subHeading.length > 0) {
        content[tabIndex].tabContent[blockIndex].subHeading = subHeading
      } else {
        content[tabIndex].tabContent[blockIndex].subHeading = undefined
      }

      setProjectChanges({
        ['content']: content
      })

      const tab = project.content[tabIndex]
      const gallery = tab.tabContent[blockIndex]

      // Delete images
      deleteGalleryImgs(project._id, tab.tabName, gallery._id!, imgsToDelete)
        .then(proj => {
          if (proj) {
            setProject(proj);
          }
        });

      if (newImgFiles.length > 0) {
        const formData = new FormData()
        newImgFiles.forEach(file => formData.append('gallery', file))
        // Send files to backend
        addGalleryImgs(project._id, tab.tabName, gallery._id!, formData)
          .then(resp => {
            if (!resp.ok) {
              resp.text().then(err => console.log(err))
            } else {
              resp.json().then(projJson => setProject(projJson))
            }
          })
      }
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      fullWidth
      maxWidth='lg'
      PaperProps={{ sx: { p: 2 } }}
    >
      <DialogTitle>Edit Sub-heading</DialogTitle>
      <DialogContent>
        <TextField
          id='block-heading-edit'
          hiddenLabel
          placeholder='Enter sub-heading...'
          variant='outlined'
          error={!!headingError}
          helperText={headingError}
          value={subHeading}
          onChange={handleSubHeadingChange}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} // Save if enter pressed
          fullWidth
          sx={{ mt: 1, mb: 1 }}
        />
      </DialogContent>

      <DialogTitle>Current Images</DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={1}
          justifyContent={'center'}
          alignItems={'center'}
        >
          {imgUrls.map((url, index) => (
            <ImgThumbnail
              key={index}
              url={url}
              {...{ blockIndex, tabIndex, imgUrls, setImgUrls, imgsToDelete }}
              imgIndex={index}
            />
          ))}
        </Grid>
      </DialogContent>

      <DialogTitle>Upload images</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          {
            newImgFiles.map((file, index) => (
              <Box key={index}>
                {/* File input */}
                <OutlinedInput
                  type='file'
                  inputProps={{ accept: "image/*" }}
                  onChange={(e) => handleFileUploaded(e as ChangeEvent<HTMLInputElement>, index)}
                  sx={{ maxWidth: '300px' }}
                />
                {/* Delete file input */}
                <Button
                  color='neutral'
                  sx={{
                    ml: 2,
                    height: '100%'
                  }}
                  onClick={() => handleRemoveFile(index)}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            ))
          }
        </Stack>

        {/* Max 5 images */}
        {newImgFiles.length + imgUrls.length < 5 ?
          <Button
            variant='outlined'
            onClick={handleFileAdded}
            sx={{ mt: 2 }}
            color='neutral'
          >
            Add file
          </Button>
          :
          <Typography variant='subtitle1' color={theme.palette.neutral.main} mt={2}>Note: The maximum number of images is 5.</Typography>
        }
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>

    </Dialog>
  )
}
