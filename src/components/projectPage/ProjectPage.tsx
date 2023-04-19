import React, { useState, SetStateAction, useContext, createContext } from 'react'
import ProjectDetails from './ProjectDetails';
import ContentBlock from './ContentBlock';
import ProjectHeader from './ProjectHeader';
import TabButton from './TabButton';
import { TMockProject, mockProject } from '../../model/MockProject';


import { Stack, Box, useTheme, Container, Typography, Button, Divider } from '@mui/material';


type TabContent = {
  type: "gallery" | "poster" | "text" | "sectionHeading" | "video" | "codeBlock" | "quote"
  value: string
}

export interface ProjectProps {
  project: TMockProject
  setProject: React.Dispatch<SetStateAction<TMockProject>>
}

const ProjectContext = createContext<TMockProject>(mockProject)

export default function ProjectPage() {
  const theme = useTheme()


  const [selectedTab, setSelectedTab] = useState(0);
  const [project, setProject] = useState<TMockProject>(mockProject)

  let imgs: string[] = [];
  if (mockProject.content.length > 0) {
    imgs = mockProject.content[0].tabContent[1].value
  }


  return (
    <>
      {/* banner */}
      <img
        src={mockProject.banner}
        alt='Project cover photo'
        width={'100%'}
        height={150}
        style={{
          objectFit: 'cover'
        }}
      />

      {/* everything else */}
      <Stack
        bgcolor={'white'}
        minHeight={'92vh'}
        px={6}
        maxWidth={'1600px'}
        mx={'auto'}
      >

        <ProjectHeader
          name={mockProject.name}
          blurb={mockProject.blurb}
          likes={mockProject.likes}
        />

        <Stack flexDirection={'row'} mt={2}>
          <Stack flex={1} alignItems={'center'} mr={4} mb={10} >
            {/* Content goes here */}
            <Stack
              className='tab-btns'
              flexDirection={'row'}
              justifyContent={'center'}
              mb={6}
              pb={3}
              borderBottom={`2px solid ${theme.customColors.DividerGrey}`}
              width={'90%'}
            >
              {mockProject.content.length > 1 &&
                mockProject.content.map((tab, index) => (
                  <TabButton
                    key={index}
                    isSelected={selectedTab === index}
                    value={tab.tabName}
                    setSelected={setSelectedTab}
                    index={index}
                  />
                ))
              }
            </Stack>

            {mockProject.content[selectedTab].tabContent.map((cb, index) => (
              <ContentBlock key={index} {...cb} />
            ))}

          </Stack>
          <ProjectDetails {...{ project, setProject, ...mockProject }} />
        </Stack>
      </Stack>
    </>
  )
}