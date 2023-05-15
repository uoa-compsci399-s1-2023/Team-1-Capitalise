import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { patchUser } from "../api/patchUser";
import { TUser } from "../model/TUser";
import { Box, DialogContentText, Stack } from "@mui/material";
import { deleteUser } from "../api/deleteUser";
import { useNavigate } from "react-router-dom";
import { uploadProfilePicture } from "../api/uploadProfilePicture";
import { deleteProfilePicture } from "../api/deleteProfilePicture";
import { useAuth } from "../customHooks/useAuth";

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
  const defaultURL =
    "https://capitalise-projects30934-staging.s3.ap-southeast-2.amazonaws.com/capitaliseAssets/default_pfp.svg";
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [profilePictureFile, setProfilePictureFile] = useState<
    File | undefined
  >();
  const [deleteProfile, setDeleteProfile] = useState(false);
  const [github, setGithub] = useState(getLink("github"));
  const [linkedin, setLinkedin] = useState(getLink("linkedin"));
  const [deployedSite, setDeployedSite] = useState(getLink("deployedSite"));
  const [openDelete, setOpenDelete] = useState(false);
  const [validImage, setValidImage] = useState(true);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  let links: any[] = [];

  const formHandleClose = async () => {
    function timeout(delay: number) {
      return new Promise((res) => setTimeout(res, delay));
    }
    handleClose();
    await timeout(150);
    setDeleteProfile(false);
    setProfilePicture(user.profilePicture);
  };

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const handleDelete = () => {
    if (auth.user) {
      if (auth.user.userType !== "admin") {
        auth.signout();
      }
    }
    deleteUser(user._id, token).then(() => navigate("../"));
  };

  const handleDeleteProfilePicture = () => {
    setDeleteProfile(true);
    setProfilePicture(defaultURL);
  };

  const constHandleImage = async (file: File) => {
    if (!file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
      setProfilePicture(user.profilePicture);
      setValidImage(false);
    } else {
      setProfilePicture(URL.createObjectURL(file));
      setValidImage(true);
      setProfilePictureFile(file);
    }
  };

  const handleSubmit = () => {
    generateLink();
    const body = {
      name: name,
      email: user.email,
      bio: bio,
      links: links,
    };

    patchUser(user._id, body, token).then(() => {
      if (typeof profilePictureFile !== "undefined") {
        let formData = new FormData();
        formData.append("profilePicture", profilePictureFile);
        uploadProfilePicture(user._id, formData).then(
          () => (window.location.href = window.location.href)
        );
      } else if (deleteProfile) {
        deleteProfilePicture(user._id).then(
          () => (window.location.href = window.location.href)
        );
      } else {
        window.location.href = window.location.href;
      }
    });
    handleClose();
    setLoading(true);
  };

  const isUrlValid = (url: string, urlWebsite: string) => {
    return (
      url.startsWith("https://www." + urlWebsite) ||
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
          <Box display="flex" alignItems="center" justifyContent="center">
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems="center"
              gap={{ xs: "10px", md: "30px" }}
            >
              <Stack
                direction="column"
                width={{ xs: "100%", md: "80%" }}
                gap="10px"
              >
                <Box
                  width={{ xs: "50%", md: "90%" }}
                  component="img"
                  src={profilePicture}
                  alt="user profile"
                  referrerPolicy="no-referrer"
                  borderRadius="50%"
                  alignSelf="center"
                  sx={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                ></Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDeleteProfilePicture}
                >
                  Delete Profile Picuture
                </Button>
              </Stack>
              <TextField
                label="Change profile picture"
                type="file"
                fullWidth
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                error={!validImage}
                helperText={!validImage ? "Select a valid image type" : ""}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.files) {
                    constHandleImage(event.target.files[0]);
                  }
                }}
              />
            </Stack>
          </Box>
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
            helperText="Press enter for new line"
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
            <Button onClick={formHandleClose}>Cancel</Button>
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
      <Dialog open={loading}>
        <DialogTitle>Hang tight, this takes a few seconds...</DialogTitle>
      </Dialog>
    </div>
  );
};

export default EditUser;
