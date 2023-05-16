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
import { deleteHeroBanner, uploadHeroBanner } from "../../api/adminHeroBanner";

interface Props {
  heroBanners: string[];
}

const DashboardHeroBanners = ({ heroBanners }: Props) => {
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
      uploadHeroBanner(formData).then(() => window.location.reload());
    }
  };

  const handleDeleteHeroBanner = async (url: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteHeroBanner(url.substring(url.lastIndexOf("/") + 1)).then(() =>
        window.location.reload()
      );
    }
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
      </Box>
      <Dialog open={loading}>
        <DialogTitle>Hang tight, this takes a few seconds...</DialogTitle>
      </Dialog>
    </Stack>
  );
};

export default DashboardHeroBanners;
