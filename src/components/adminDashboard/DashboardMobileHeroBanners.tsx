import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  deleteMobileHeroBanner,
  uploadMobileHeroBanner,
} from "../../api/adminHeroBanner";

interface Props {
  mobileHeroBanners: string[];
  refreshBanners: () => void;
}

const DashboardMobileHeroBanners = ({
  mobileHeroBanners,
  refreshBanners,
}: Props) => {
  const [validImage, setValidImage] = useState(true);
  const [heroBanner, setHeroBanner] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);

  const constHandleImage = async (file: File) => {
    if (!file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
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
      uploadMobileHeroBanner(formData).then(() => {
        refreshBanners();
        setLoading(false);
      });
    }
  };

  const handleDeleteHeroBanner = async (url: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setLoading(true);
      deleteMobileHeroBanner(url.substring(url.lastIndexOf("/") + 1)).then(
        () => {
          refreshBanners();
          setLoading(false);
        }
      );
    }
  };

  return (
    <Stack height="100%">
      <Box height="100%" padding="0px 24px 10px 24px">
        <Typography paddingTop={3} variant="h6">
          Manage landing page mobile hero banners
        </Typography>
        <Box paddingTop={3} sx={{ overflow: "auto" }}>
          <TableContainer style={{ maxHeight: 400, maxWidth: 800 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "50%" }}>
                    {"Mobile Hero Banners"}
                  </TableCell>
                  <TableCell style={{ width: "50%" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mobileHeroBanners.map((url, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Box
                        display="flex"
                        width="450"
                        height="200px"
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
                            onClick={() => handleDeleteHeroBanner(url)}
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
        </Box>
        <Typography paddingTop={5} variant="h6">
          Add category
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
            //value={newCategory}
            //onChange={handleNewCategory}
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
      <Dialog open={loading}>
        <DialogTitle>Hang tight, this takes a few seconds...</DialogTitle>
      </Dialog>
    </Stack>
  );
};

export default DashboardMobileHeroBanners;
