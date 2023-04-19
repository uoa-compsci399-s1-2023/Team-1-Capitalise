import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TMockProject } from '../../model/MockProject';

interface EditTextDialogProps {
  fieldName: string
  label: string
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  project: TMockProject
  setProject: React.Dispatch<React.SetStateAction<TMockProject>>
}


export default function EditTextDialog({ value, setValue, isOpen, setIsOpen, fieldName, label, project, setProject }: EditTextDialogProps) {

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Edit {fieldName}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id={`${fieldName}-edit-field`}
          label={label}
          type="text"
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Save</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}