import { useState } from "react";
import * as React from "react";

import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { deleteHeroBanner, uploadHeroBanner } from "../../api/adminHeroBanner";
import LoadingDialog from "../projectPage/dialogs/LoadingDialog";

interface Props {
  heroBanners: string[];
  refreshBanners: () => void;
}

const DashboardHeroBanners = ({ heroBanners, refreshBanners }: Props) => {
  // for the dialog pop-up
  const [open, setOpen] = React.useState(false);
  const [heroBannerToDelete, setHeroBannerToDelete] = useState("");

  const [validImage, setValidImage] = useState(true);
  const [heroBanner, setHeroBanner] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);

  const setDeleteHeroBanner = (url: string) => {
    setHeroBannerToDelete(url);
    setOpen(true);
  };

  const cancelDelete = () => {
    setOpen(false);
  };

  const constHandleImage = async (file: File) => {
    if (!file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg)$/)) {
      setValidImage(false);
    } else {
      setValidImage(true);
      setHeroBanner(file);
    }
  };

  const handleAddHeroBanner = async () => {
    if (typeof heroBanner !== "undefined") {
      let formData = new FormData();
      formData.append("heroBanner", heroBanner);
      setLoading(true);
      uploadHeroBanner(formData).then(() => {
        refreshBanners();
        setLoading(false);
      });
    }
  };

  const handleDeleteHeroBanner = async (url: string) => {
    setLoading(true);
    deleteHeroBanner(url.substring(url.lastIndexOf("/") + 1)).then(() => {
      refreshBanners();
      setLoading(false);

      // close the dialog
      setOpen(false);
    });
  };

  return (
    <Stack height="100%">
      <Box height="100%" padding="0px 24px 10px 24px">
        <Typography paddingTop={3} variant="h6">
          Manage landing page hero banners
        </Typography>
        <Box paddingTop={3} sx={{ overflow: "auto" }}>
          <TableContainer style={{ maxHeight: 400, maxWidth: 800 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "50%" }}>Hero Banners</TableCell>
                  <TableCell style={{ width: "50%" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {heroBanners.map((url, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Box
                        display="flex"
                        width="540px"
                        height="267px"
                        component="img"
                        src={url}
                        alt="hero"
                        alignSelf="center"
                        sx={{
                          objectFit: "cover",
                          objectPosition: "bottom right",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" justifyContent="center">
                        <Typography>
                          {url.substring(url.lastIndexOf("/") + 1)}
                        </Typography>
                        <Box display="flex">
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => setDeleteHeroBanner(url)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* delete confirmation dialog */}
          <Dialog
            open={open}
            onClose={cancelDelete}
            aria-labelledby="heroBanner-alert-title"
            aria-describedby="heroBanner-alert-description"
          >
            <DialogTitle
              id="heroBanner-alert-title"
              sx={{
                paddingLeft: 5,
                paddingRight: 5,
                paddingTop: 5,
              }}
            >
              {"Are you sure you want to delete this heroBanner?"}
            </DialogTitle>
            <DialogContent sx={{ paddingLeft: 5, paddingRight: 5 }}>
              <DialogContentText id="heroBanner-alert-description">
                If you proceed, this action will permanently delete this
                herobanner.
              </DialogContentText>
            </DialogContent>
            <DialogActions
              sx={{
                paddingLeft: 5,
                paddingRight: 5,
                paddingBottom: 5,
              }}
            >
              <Button onClick={cancelDelete}>Cancel</Button>
              <Button
                color="error"
                onClick={(event) => {
                  handleDeleteHeroBanner(heroBannerToDelete);
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <Typography paddingTop={5} variant="h6">
          Add new banner
        </Typography>
        <Box
          width={{ xs: "300px", sm: "600px" }}
          component={"form"}
          display={"flex"}
          alignItems={"center"}
          gap={2}
        >
          <TextField
            label="New hero banner"
            variant="outlined"
            fullWidth
            margin="normal"
            type="file"
            InputLabelProps={{
              shrink: true,
            }}
            error={!validImage}
            helperText={
              !validImage
                ? "Select a valid image type"
                : "The order is sorted by fileaname e.g Alpha.jpg then Bravo.jpg"
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.files) {
                constHandleImage(event.target.files[0]);
              }
            }}
          />
          <Box alignSelf="flex-start" paddingTop="25px">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddHeroBanner}
            >
              Submit
            </Button>
          </Box>
        </Box>
        <Typography variant="subtitle2" color="grey">
          {"Note: if the change doesn't work try again for submit and delete"}
        </Typography>
      </Box>
      <LoadingDialog isOpen={loading} />
    </Stack>
  );
};

export default DashboardHeroBanners;
