import React from 'react'
import { TProject } from '../../api/getProjects'
import ProjectDetails from './ProjectDetails';

import { Stack, useTheme, Container } from '@mui/material';




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
  content?: [ // Array of tabs
    { 
      tabName: string // Added field
      tabContent: { // Changed from "tab"
        type: string // "gallery" | "poster" | "text" | "sectionHeading" | "video" | "codeBlock" | "quote"
        value: string[]
      }[]  
    },
  ];
  badges: {
    value: "Community Impact" | "Top Excellence" | "People's Choice";
  };
};


const testProject: TestProject = {
  _id: "0",
  name: "InceptionNet",
  semester: {value: "S1 2023"},
  category: {value: "Web Development"},
  repoLink: "https://github.com/uoa-compsci399-s1-2023/project-team-1",
  teamname: "Zuckerberg Enterprises",
  likes: 17,
  banner: "./Neural_Networks.png",
  content: [
    {
      tabName: "Overview",
      tabContent: [
        {
          type: "quote",
          value: ["We built a neural network from scratch.",]
        },
        {
          type: "gallery",
          value: ["",]
        },
        {
          type: "sectionHeading",
          value: ["Description",]
        },
        {
          type: "text",
          value: [`Deep Learning has become a popular topic in recent times. It involves emulating the neural structure of the human brain through a network of nodes called a Neural Network. While our brain's neurons have physical components like nucleus, dendrites, and synapses, Neural Network neurons are interconnected and have weights and biases assigned to them. A neural network typically consists of an input layer, an output layer, and one or more hidden layers. In conventional neural networks, all nodes in these layers are interconnected to form a dense network. However, there are cases where certain nodes in the network are not connected to others, which are referred to as Sparse Neural Networks. InceptionNet models for image classification use Sparse Neural Networks. The following figure illustrates the structure of a neural network.`,]
        },
      ],
    },
],
  badges: {value: "People's Choice"}
}


export default function ProjectPage() {
  const theme = useTheme()

  return (
    <Stack bgcolor={theme.customColors.bgGrey} minHeight={'92vh'} flexDirection={'row'}>
      <Stack flex={1}>
        
      </Stack>
      <ProjectDetails />
    </Stack>
  )
}

