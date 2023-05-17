import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const About = () => {
  const [mockAboutData, setMockAboutData] = useState([
    { title: "What is Capitalise?", body: "this is the body" },
    { title: "So, what is Capstone?", body: "this is the body" },
  ]);

  const [editChecked, setEditChecked] = useState(false);

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditChecked(event.target.checked);
  };

  const handleEditSubmit = (title: string, body: string, index: number) => {
    let newData = mockAboutData;
    newData[index] = { title: title, body: body };
    setMockAboutData(newData);
    console.log("set");
    console.log(mockAboutData);
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

      {!editChecked &&
        mockAboutData.map((section, i) => (
          <Stack gap="10px" key={i}>
            <Typography variant="h1">{section.title}</Typography>
            <Typography variant="body1">{section.body}</Typography>
          </Stack>
        ))}

      {editChecked &&
        mockAboutData.map((section, i) => {
          let title = section.title;
          let body = section.body;
          return (
            <Stack direction="row" key={i} gap="10px" alignItems="center">
              <Stack gap="10px" width="100%">
                <TextField
                  margin="dense"
                  label="Title"
                  multiline
                  fullWidth
                  variant="outlined"
                  defaultValue={section.title}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    title = event.target.value;
                  }}
                />
                <TextField
                  margin="dense"
                  label="Body"
                  multiline
                  fullWidth
                  variant="outlined"
                  defaultValue={section.body}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    body = event.target.value;
                  }}
                />
              </Stack>
              <Button
                variant="contained"
                onClick={() => handleEditSubmit(title, body, i)}
              >
                {"submit"}
              </Button>
            </Stack>
          );
        })}
    </Stack>
  );
};

export default About;
