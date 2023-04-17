import React, { useState } from "react";
import ProjectDetails from "./ProjectDetails";
import ContentBlock from "./ContentBlock";
import ProjectHeader from "./ProjectHeader";
import TabButton from "./TabButton";

// import the mock project.
import { mockProject } from "../../model/MockProject";

import Comment from "../MyComment";
import Comments from "../../components/Comments";

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
  const theme = useTheme();

  const [selectedTab, setSelectedTab] = useState(0);

  let imgs: string[] = [];
  if (mockProject.content.length > 0) {
    imgs = mockProject.content[0].tabContent[1].value;
  }

  // we want a way to pass the comments to the Comments component
  // console.log(mockProject.comments);

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
          <Comments currentUserId="1" comments={mockProject.comments} />
        </Stack>
      </Stack>
    </>
  );
}
