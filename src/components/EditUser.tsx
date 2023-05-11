import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { patchUser } from "../api/patchUser";
import { TUser } from "../model/TUser";
import { Box, DialogContentText } from "@mui/material";
import { deleteUser } from "../api/deleteUser";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  handleClose: () => void;
  user: TUser;
  token: string;
}

const EditUser = ({ open, handleClose, user, token }: Props) => {
  const getLink = (linkType: string) => {
    for (let link of user.links) {
      if (linkType === link.type) {
        return link.value;
      }
    }
    return "";
  };
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [github, setGithub] = useState(getLink("github"));
  const [linkedin, setLinkedin] = useState(getLink("linkedin"));
  const [deployedSite, setDeployedSite] = useState(getLink("deployedSite"));
  const [openDelete, setOpenDelete] = useState(false);
  const navigate = useNavigate();
  let links: any[] = [];

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleDelete = () => {
    deleteUser(user._id, token).then(() => navigate("../"));
  };

  const handleSubmit = () => {
    generateLink();
    const body = {
      name: name,
      email: user.email,
      bio: bio,
      links: links,
    };
    patchUser(user._id, body, token).then(() => window.location.reload());
    handleClose();
  };

  const isUrlValid = (url: string, urlWebsite: string) => {
    return (
      url.startsWith("https://" + urlWebsite) ||
      url.startsWith("http://" + urlWebsite) ||
      !url
    );
  };

  const generateLink = () => {
    if (github && isUrlValid(github, "github.com")) {
      links.push({ value: github, type: "github" });
    }
    if (linkedin && isUrlValid(linkedin, "linkedin.com")) {
      links.push({ value: linkedin, type: "linkedin" });
    }
    if (deployedSite && isUrlValid(deployedSite, "")) {
      links.push({ value: deployedSite, type: "deployedSite" });
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            variant="standard"
            defaultValue={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
          />
          <TextField
            multiline
            margin="dense"
            label="Bio"
            fullWidth
            variant="standard"
            defaultValue={bio}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setBio(event.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="github"
            label="GitHub link"
            fullWidth
            variant="standard"
            defaultValue={github}
            error={!isUrlValid(github, "github.com")}
            helperText={
              !isUrlValid(github, "github.com")
                ? "URL is not correct, include https://github.com"
                : ""
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setGithub(event.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="linkedin"
            label="LinkedIn link"
            fullWidth
            variant="standard"
            defaultValue={linkedin}
            error={!isUrlValid(linkedin, "linkedin.com")}
            helperText={
              !isUrlValid(linkedin, "linkedin.com")
                ? "URL is not correct, include https://linkedin.com"
                : ""
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLinkedin(event.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="deployedSite"
            label="Website link"
            fullWidth
            variant="standard"
            defaultValue={deployedSite}
            error={!isUrlValid(deployedSite, "")}
            helperText={
              !isUrlValid(deployedSite, "") ? "URL is not correct" : ""
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDeployedSite(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "space-between", paddingBottom: "16px" }}
        >
          <Box paddingLeft="16px">
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteOpen}
            >
              Delete
            </Button>
          </Box>
          <Box paddingRight="16px">
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog open={openDelete} onClose={handleDeleteClose}>
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting your profile is irreversible and all your data will be
            lost, are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "space-between", padding: "24px" }}
        >
          <Button variant="outlined" onClick={handleDeleteClose}>
            No
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditUser;
