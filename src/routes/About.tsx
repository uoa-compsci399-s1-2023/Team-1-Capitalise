import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../customHooks/useAuth";

const About = ({}) => {
  const [mockAboutData, setMockAboutData] = useState([
    { title: "What is Capitalise?", body: "this is the body" },
    { title: "So, what is Capstone?", body: "this is the body" },
  ]);

  const [editChecked, setEditChecked] = useState(false);
  let isAdmin = false;
  let key = Date.now();
  const auth = useAuth();

  if (auth.user) {
    if (auth.user.userType === "admin") {
      isAdmin = true;
    } else {
      isAdmin = false;
    }
  } else {
    isAdmin = false;
  }

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditChecked(event.target.checked);
  };

  const handleEditSection = (title: string, body: string, index: number) => {
    let newData = mockAboutData.slice();
    newData[index] = { title: title, body: body };
    setMockAboutData(newData);
  };

  const handleAddSection = () => {
    let newData = mockAboutData.slice();
    newData.push({ title: "title", body: "body" });
    setMockAboutData(newData);
  };

  const handleDeleteSection = (index: number) => {
    const removeData = mockAboutData[index];
    setMockAboutData((current) =>
      current.filter((data) => data !== removeData)
    );
  };

  return (
    <Stack
      position="relative"
      padding="50px 0px"
      gap="100px"
      width="65%"
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
        mockAboutData.map((section, i) => (
          <Stack gap="10px" key={i + key}>
            <Typography variant="h1">{section.title}</Typography>
            <Typography variant="body1">{section.body}</Typography>
          </Stack>
        ))}

      {editChecked && (
        <Stack gap="50px">
          <Typography>
            {
              "Pressing Submit, Delete or Add section refreshes the data back to its original. Only edit and submit one section at a time or you will lose data"
            }
          </Typography>
          {mockAboutData.map((section, i) => {
            let title = section.title;
            let body = section.body;
            return (
              <Stack
                direction="row"
                key={i + key}
                gap="10px"
                alignItems="center"
              >
                <Stack gap="10px" width="100%">
                  <FormControl>
                    <TextField
                      id={"admin-title" + (i + key).toString()}
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
                      id={"admin-body" + (i + key).toString()}
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
                        onClick={() => handleEditSection(title, body, i)}
                      >
                        {"Submit"}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteSection(i)}
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
