import {
  Alert,
  Box,
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../customHooks/useAuth";
import { TAbout } from "../model/TAbout";
import { addAbout, deleteAbout, editAbout, getAbout } from "../api/aboutAPIs";

const About = ({}) => {
  const [aboutData, setAboutData] = useState<TAbout[]>([]);
  const [open, setOpen] = useState(false);

  const fetchAbout = async () => {
    const respData = await getAbout();
    if (respData) {
      setAboutData(respData);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const [editChecked, setEditChecked] = useState(false);
  let isAdmin = false;
  let token = "";
  let key = Date.now().toString();
  const auth = useAuth();

  if (auth.user) {
    if (auth.user.userType === "admin") {
      isAdmin = true;
      token = auth.getToken() as string;
    } else {
      isAdmin = false;
    }
  } else {
    isAdmin = false;
  }

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditChecked(event.target.checked);
  };

  const handleEditSection = async (id: string, title: string, body: string) => {
    await editAbout(id, title, body, token).then(() => fetchAbout());
    setOpen(true);
    setTimeout(() => setOpen(false), 1500);
  };

  const handleAddSection = async () => {
    await addAbout("title", "body", token);
    fetchAbout();
  };

  const handleDeleteSection = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      await deleteAbout(id, token);
    }
    fetchAbout();
  };

  return (
    <Stack
      position="relative"
      padding="50px 0px"
      gap="80px"
      width={{ xs: "80%", md: "65%", xl: "50%" }}
      margin="auto"
      minHeight="92vh"
    >
      {isAdmin && (
        <Box position="absolute" top="15px" right="0px">
          <FormControlLabel
            control={
              <Switch
                checked={editChecked}
                onChange={handleEditChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Edit"
          />
        </Box>
      )}

      {!editChecked &&
        aboutData.map((section) => (
          <Stack gap="10px" key={section._id + key}>
            <Typography variant="h1" fontSize={{ xs: "24pt", lg: "28pt" }}>
              {section.title}
            </Typography>
            <Typography variant="body1" fontSize="14pt">
              {section.body}
            </Typography>
          </Stack>
        ))}

      {editChecked && (
        <Box>
          <Collapse in={open}>
            <Alert sx={{ mb: 2 }}>{"Success"}</Alert>
          </Collapse>

          <Stack gap="50px">
            <Typography>
              {
                "Pressing Submit, Delete or Add section refreshes the data back to its original. Only edit and submit one section at a time or you will lose data"
              }
            </Typography>
            {aboutData.map((section, i) => {
              let title = section.title;
              let body = section.body;
              return (
                <Stack
                  direction="row"
                  key={section._id + key}
                  gap="10px"
                  alignItems="center"
                >
                  <Stack gap="10px" width="100%">
                    <FormControl>
                      <TextField
                        id={"admin-title" + (section._id + key)}
                        margin="dense"
                        label="Title"
                        multiline
                        fullWidth
                        variant="outlined"
                        defaultValue={section.title}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          title = event.target.value;
                        }}
                      />
                      <TextField
                        id={"admin-body" + (section._id + key)}
                        margin="dense"
                        label="Body"
                        multiline
                        fullWidth
                        variant="outlined"
                        defaultValue={section.body}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          body = event.target.value;
                        }}
                      />
                      <Box display="flex" justifySelf="start" gap="20px">
                        <Button
                          variant="contained"
                          onClick={() =>
                            handleEditSection(section._id, title, body)
                          }
                        >
                          {"Submit"}
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteSection(section._id)}
                        >
                          {"Delete"}
                        </Button>
                      </Box>
                    </FormControl>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      )}
      {editChecked && (
        <Box justifySelf="start">
          <Button
            variant="contained"
            onClick={() => handleAddSection()}
            sx={{ position: "left" }}
          >
            {"+ Add section"}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

export default About;
