import React, { ChangeEvent, Dispatch, SetStateAction, useContext, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { uploadBanner } from '../../../api/projectBannerApi';
import { ProjectContext } from '../../../routes/ProjectPage';
import LoadingDialog from './LoadingDialog';
import { getProject } from '../../../api/getProject';


interface EditBannerDialogProps {
  isDialogOpen: boolean
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>
}

export default function EditBannerDialog({ isDialogOpen, setIsDialogOpen }: EditBannerDialogProps) {

  const [value, setValue] = useState<File | null>(null);
  const { project, setProject } = useContext(ProjectContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsDialogOpen(false);
  }

  const handleFileUploaded = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      setValue(file);
    }
  }

  const handleSave = () => {
    if (value) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('banner', value);
      uploadBanner(project._id, formData)
        .then((resp) => {
          const data = resp.json()
          if (resp.ok) {
            data.then((proj) => setProject(proj));
          } else {
            data.then(err => console.log(err.msg));
          }
        })
        .finally(() => {
          setIsLoading(false);
          setIsDialogOpen(false);
        })
    }
  }

  return (
    <>
      <LoadingDialog isOpen={isLoading} />

      <Dialog
        open={isDialogOpen && !isLoading}
        onClose={handleClose}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Upload Banner</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <OutlinedInput
              fullWidth
              type='file'
              inputProps={{ accept: "image/*" }}
              onChange={(e) => handleFileUploaded(e as ChangeEvent<HTMLInputElement>)}
              sx={{ maxWidth: '300px' }}
            />
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog >
    </>

  )
}
