import { Box, Stack, Typography } from "@mui/material";

const About = () => {
  const mockAboutData = [
    { title: "What is Capitalise?", body: "this is the body" },
    { title: "So, what is Capstone?", body: "this is the body" },
  ];

  mockAboutData.map((block) => {
    console.log(block.title);
    console.log(block.body);
  });

  return (
    <Stack
      padding="50px 0px"
      gap="100px"
      width="1000px"
      margin="auto"
      minHeight="92vh"
    >
      {mockAboutData.map((section) => (
        <Stack gap="10px">
          <Typography variant="h1">{section.title}</Typography>
          <Typography variant="body1">{section.body}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default About;
