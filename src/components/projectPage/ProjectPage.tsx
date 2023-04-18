import ProjectDetails from "./ProjectDetails";
import ContentBlock from "./ContentBlock";
import ProjectHeader from "./ProjectHeader";
import TabButton from "./TabButton";

// import the mock project.
import { mockProject } from "../../model/MockProject";

import Comment from "../MyComment";
import Comments from "../../components/Comments";

import { TUser } from "../../api/getUserbyId";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/getCurrentUser";
import { useAuth } from "../../customHooks/useAuth";

import {
  Stack,
  Box,
  useTheme,
  Container,
  Typography,
  Button,
  Divider,
} from "@mui/material";

type TabContent = {
  type:
    | "gallery"
    | "poster"
    | "text"
    | "sectionHeading"
    | "video"
    | "codeBlock"
    | "quote";
  value: string;
};

export default function ProjectPage() {
  const auth = useAuth();

  const theme = useTheme();

  const [selectedTab, setSelectedTab] = useState(0);

  let imgs: string[] = [];
  if (mockProject.content.length > 0) {
    imgs = mockProject.content[0].tabContent[1].value;
  }

  // we want a way to pass the comments to the Comments component
  // console.log(mockProject.comments);

  const handleSignin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uname = e.target.username.value;
    const password = e.target.password.value;
    auth.signin(uname, password);
  };

  let currentId = "";
  const handleComment = () => {
    auth.onlyAuthenticated(); // Redirects the use to the signin page if not signed in (currently just redirects to projects page)
    if (auth.user) {
      currentId = auth.user._id;
      console.log("User id of the current user:", currentId);
    }
  };

  return (
    <>
      <img
        src={mockProject.banner}
        alt="Project cover photo"
        width={"100%"}
        height={150}
        style={{
          objectFit: "cover",
        }}
      />
      <h1>About {auth.user?.name} </h1>
      {auth.error && <h3>{auth.error}</h3>}
      <Box mb={6}>
        <form onSubmit={handleSignin}>
          username: <input type="text" name="username" id="username" />
          password: <input type="text" name="password" />
          <input type="submit" value={"signin"} />
          <input type="button" onClick={auth.signout} value={"signout"} />
        </form>
      </Box>

      <input type="button" onClick={handleComment} value={"CAN COMMENT?"} />

      <Stack
        // bgcolor={theme.customColors.bgGrey}
        bgcolor={"white"}
        minHeight={"92vh"}
        px={6}
        maxWidth={"1600px"}
        mx={"auto"}
      >
        <ProjectHeader
          name={mockProject.name}
          blurb={mockProject.blurb}
          likes={mockProject.likes}
        />

        <Stack flexDirection={"row"} mt={2}>
          <Stack flex={1} alignItems={"center"} mr={4} gap={2} mb={10}>
            {/* Content goes here */}

            <Stack
              flexDirection={"row"}
              justifyContent={"center"}
              mb={6}
              pb={3}
              borderBottom={`2px solid ${theme.customColors.DividerGrey}`}
              width={"90%"}
            >
              {mockProject.content.map((tab, index) => (
                <TabButton
                  key={index}
                  isSelected={selectedTab === index}
                  value={tab.tabName}
                  setSelected={setSelectedTab}
                  index={index}
                />
              ))}
              {/* <Divider variant='middle' /> */}
            </Stack>

            {mockProject.content[selectedTab].tabContent.map((cb, index) => (
              <ContentBlock key={index} {...cb} />
            ))}
          </Stack>
          <ProjectDetails />
        </Stack>
        <Stack mt={2} paddingLeft={4} spacing={1}>
          <Typography variant="h1" color="initial" fontWeight={600}>
            Comments
          </Typography>
          {/* Pass currentUserId since user needs to be logged in to leave a comment /> */}
          <Comments
            comments={mockProject.comments}
            projectId={mockProject._id}
          />
        </Stack>
      </Stack>
    </>
  );
}
