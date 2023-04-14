import React from 'react'
import { TProject } from '../../api/getProjects'
import ProjectDetails from './ProjectDetails';
import ContentBlock from './ContentBlock';

import { Stack, Box, useTheme, Container, Typography } from '@mui/material';




type TabContent = {
  type: "gallery" | "poster" | "text" | "sectionHeading" | "video" | "codeBlock" | "quote"
  value: string
}


type TestProject = {
  _id: string;
  name: string;
  semester: {
    value: string;
  };
  category: {
    value: string;
  };
  repoLink?: string;
  teamname: string;
  likes: number;
  banner: string; // Only one banner per project
  content: [ // Array of tabs
    {
      tabName: string // Added field
      tabContent: { // Changed from "tab"
        type: "gallery" | "poster" | "text" | "video" | "codeBlock" | "quote"
        subHeading?: string
        value: string[]
      }[]
    },
  ];
  badges: {
    value: "Community Impact" | "Top Excellence" | "People's Choice"; // Runner Ups?
  };
};


const testProject: TestProject = {
  _id: "0",
  name: "InceptionNet",
  semester: { value: "S1 2023" },
  category: { value: "Web Development" },
  repoLink: "https://github.com/uoa-compsci399-s1-2023/project-team-1",
  teamname: "Zuckerberg Enterprises",
  likes: 17,
  banner: "src/components/projectPage/galleryImgs/Neural_Networks.png",
  content: [
    {
      tabName: "Overview",
      tabContent: [
        {
          type: "quote",
          value: ["We built a neural network from scratch.",]
        },
        // {
        //   type: "gallery",
        //   value: [
        //     `src/components/projectPage/galleryImgs/img1.png`,
        //     `src/components/projectPage/galleryImgs/img2.png`,
        //     `src/components/projectPage/galleryImgs/img3.png`,
        //     `src/components/projectPage/galleryImgs/img4.png`
        //   ]
        // },
        {
          type: "text",
          subHeading: "Description",
          value: [`Deep Learning has become a popular topic in recent times. It involves emulating the neural structure of the human brain through a network of nodes called a Neural Network. While our brain's neurons have physical components like nucleus, dendrites, and synapses, Neural Network neurons are interconnected and have weights and biases assigned to them. A neural network typically consists of an input layer, an output layer, and one or more hidden layers. In conventional neural networks, all nodes in these layers are interconnected to form a dense network. However, there are cases where certain nodes in the network are not connected to others, which are referred to as Sparse Neural Networks. InceptionNet models for image classification use Sparse Neural Networks. The following figure illustrates the structure of a neural network.`,]
        },
      ],
    },
  ],
  badges: { value: "People's Choice" }
}


export default function ProjectPage() {
  const theme = useTheme()

  let imgs: string[] = [];
  if (testProject.content.length > 0) {
    imgs = testProject.content[0].tabContent[1].value
  }

  return (
    <>
      <img
        src={testProject.banner}
        alt='Project cover photo'
        width={'100%'}
        height={150}
        style={{
          objectFit: 'cover'
        }}
      />

      <Stack
        bgcolor={theme.customColors.bgGrey}
        minHeight={'92vh'}
        px={6}
        maxWidth={'1600px'}
        mx={'auto'}
      >

        <Stack
          bgcolor={'white'}
          style={theme.contentBlock}
          padding={'40px'}
          width={'100%'}
          mt={4}
        >
          <Typography variant="h1" color="initial">{testProject.name}</Typography>
          <Typography
            component='p'
            variant='body2'
            fontSize={16}
            mt={1}
          >
            Building a neural network from scratch.
            
          </Typography>
        </Stack>

        <Stack flexDirection={'row'} mt={2}>
          <Stack flex={1} alignItems={'center'} mr={4} gap={2} >
            {/* Content goes here */}

            {testProject.content[0].tabContent.map((cb, index) => (
              <ContentBlock {...cb} />
            ))}

          </Stack>
          <ProjectDetails />
        </Stack>
      </Stack>
    </>
  )
}