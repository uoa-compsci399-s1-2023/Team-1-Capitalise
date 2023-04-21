import React, { useState, SetStateAction, useContext, createContext, useEffect } from 'react'
import ProjectDetails from './ProjectDetails';
import ContentBlock, {ContentBlockProps} from './ContentBlock';
import ProjectHeader from './ProjectHeader';
import TabButton from './TabButton';
import { TMockProject, mockProject } from '../../model/MockProject';
import { getProject } from '../../api/getProject'
import { Stack, Box, useTheme, Container, Typography, Button, Divider } from '@mui/material';
import { TProject } from '../../model/TProject';


type TabContent = {
  type: "gallery" | "poster" | "text" | "sectionHeading" | "video" | "codeBlock" | "quote"
  value: string[]
}

export interface ProjectProps {
  project: TProject
  setProject: React.Dispatch<SetStateAction<TProject>>
}

export const ProjectContext = createContext<ProjectProps>({} as ProjectProps)


export default function ProjectPage({projectId}: {projectId:string}) {
  const theme = useTheme()

  const [selectedTab, setSelectedTab] = useState(0);
  const [project, setProject] = useState<TProject>({} as TProject);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getProject(projectId)
      .then((data) => {data && setProject(data)})
      .finally(() => setIsLoading(false));
  }, [])


  if (!isLoading) {
    return (
      <ProjectContext.Provider value={{ project, setProject }}>
        {/* banner */}
        <img
          src={project.banner}
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
          pl={6}
          pr={4}
          maxWidth={'1600px'}
          mx={'auto'}
        >
          <ProjectHeader
            name={project.name}
            blurb={project.blurb}
            likes={project.likes}
          />
          <Stack
            sx={{
              flexDirection: { md: 'row', sm: 'column' },
            }}
            mt={2}>
            <Stack flex={1} alignItems={'center'} mr={1} mb={10} >
              
              {/* Only render tab buttons if there's more than one tab */}
              {project.content.length > 1 && <Stack
                className='tab-btns'
                flexDirection={'row'}
                justifyContent={'center'}
                mb={6}
                pb={3}
                borderBottom={`2px solid ${theme.customColors.DividerGrey}`}
                width={'90%'}
              >
                {
                  project.content.map((tab, index) => (
                    <TabButton
                      key={index}
                      isSelected={selectedTab === index}
                      value={tab.tabName}
                      setSelected={setSelectedTab}
                      index={index}
                    />
                  ))
                }
              </Stack>}
              {project.content[selectedTab].tabContent.map((cb, index) => (
                <ContentBlock key={index} {...cb as ContentBlockProps} />
              ))}
            </Stack>
            <ProjectDetails />
          </Stack>
        </Stack>
      </ProjectContext.Provider>
    )
  } else {
    return <h1>Loading...</h1>
  }
  
}