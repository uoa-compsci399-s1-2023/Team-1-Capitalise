import {
  Box,
  Button,
  Divider,
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

interface Props {
  heroBanners: string[];
  mobileHeroBanners: string[];
}

const DashboardHeroBanners = ({ heroBanners }: Props) => {
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
                  <TableCell style={{ width: "50%" }}>
                    Hero Categories
                  </TableCell>
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
                          <Button variant="contained" color="error">
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
          sx={{ width: 600 }}
          component={"form"}
          display={"flex"}
          alignItems={"center"}
          gap={2}
        >
          <TextField
            label="New category"
            //value={newCategory}
            //onChange={handleNewCategory}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            //onClick={handleAddCategory}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

export default DashboardHeroBanners;
