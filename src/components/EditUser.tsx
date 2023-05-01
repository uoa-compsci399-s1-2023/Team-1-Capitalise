import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { patchUser } from "../api/patchUser";
import { TUser } from "../model/TUser";

interface Props {
  open: boolean;
  handleClose: () => void;
  user: TUser;
  token: string;
}

const EditUser = ({ open, handleClose, user, token }: Props) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const handleSubmit = () => {
    const body = {
      name: name,
      email: user.email,
      bio: bio,
    };
    const resp = patchUser(user._id, body, token).then(() =>
      window.location.reload()
    );
    console.log(resp);
    handleClose();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
          />
          <TextField
            multiline
            autoFocus
            margin="dense"
            id="bio"
            label="Bio"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={bio}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setBio(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditUser;
