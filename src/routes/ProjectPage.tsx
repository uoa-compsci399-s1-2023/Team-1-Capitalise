import React, { useState, SetStateAction, useContext, createContext, useEffect } from 'react'
import ProjectDetails from '../components/projectPage/ProjectDetails';
import ContentBlock, { ContentBlockProps } from '../components/projectPage/ContentBlock';
import ProjectHeader from '../components/projectPage/ProjectHeader';
import TabButton from '../components/projectPage/TabButton';
import { getProject } from '../api/getProject'
import { Stack, Box, useTheme, Container, Typography, Button, Divider } from '@mui/material';
import { TProject } from '../model/TProject';
import { TProjectPost } from '../model/TPostProject';
import { patchProject } from '../api/patchProject';
import { useAuth } from '../customHooks/useAuth';
import ProjectDetailsAccordian from '../components/projectPage/MobileProjectDetails';
import { useParams } from 'react-router-dom';
import { TComment } from '../model/TComment';
import Comments from '../components/projectPage/Comments/Comments';
import { getProjectComments } from '../api/getProjectComments';


type TabContent = {
  type: "gallery" | "poster" | "text" | "sectionHeading" | "video" | "codeBlock" | "quote"
  value: string[]
}

export interface ProjectProps {
  project: TProject
  setProject: React.Dispatch<SetStateAction<TProject>>
  // projectChanges: Partial<TProject | null>;
  setProjectChanges: React.Dispatch<SetStateAction<TProjectPost | null>> // No getter. Displayed project is always in sync with backend.
}

export const ProjectContext = createContext<ProjectProps>({} as ProjectProps)


export default function ProjectPage() {
  const { projectId } = useParams();
  const theme = useTheme();
  const auth = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  // Holds currently displaying project
  const [project, setProject] = useState<TProject>({} as TProject);
  // Holds modified project that needs to patched in backend
  const [projectChanges, setProjectChanges] = useState<TProjectPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<TComment[] | undefined>();

  // Sets inital project on mount
  useEffect(() => {
    setIsLoading(true)
    getProject(projectId!)
      .then((data) => {
        if (data) {
          setProject(data);
          // We are using the get all comments endpoint to test rendering
          getProjectComments(projectId!)
            .then((respData) => {
              setComments(respData);
            })
        }
      })
      .finally(() => setIsLoading(false));
  }, [])

  // Sends changes to backend and releases lock.
  // If patch request fails, changes are rolled back.
  // Perhaps we need to implement a session timer to release the lock on fail?
  useEffect(() => {
    if (projectChanges) {
      patchProject(
        project._id,
        {
          ...projectChanges,
          ["isBeingEdited"]: false
        },
        auth.getToken() as string,
      ).then(resp => {
        if (resp.ok) {
          // Set project to display updated project.
          resp.json().then(data => setProject(data));
        } else {
          // Log error and do nothing.
          resp.text().then(err => console.log(err))
        }
      }).finally(() => {
        setProjectChanges(null) // Clears changes. Won't cause loop because of null check at start.
      })
    }
  }, [projectChanges]) // Will run anytime changes are set.


  if (!isLoading) {
    return (
      <ProjectContext.Provider value={{ project, setProject, setProjectChanges }}>
      
      {/* Banner */}
        <img
          src={project.banner}
          alt='Project cover photo'
          width={'100%'}
          height={150}
          style={{
            objectFit: 'cover'
          }}
        />
      
      {/* Everything else */}
        <Stack
          bgcolor={'white'}
          minHeight={'92vh'}
          pl={6}
          pr={4}
          maxWidth={'1600px'}
          mx={'auto'}
        >
          {/* Includes title, blurb, like button, etc */}
          <ProjectHeader
            name={project.name}
            blurb={project.blurb}
            likes={project.likes}
          />

          {/* Project details for mobile view */}
          <ProjectDetailsAccordian />

          {/* Tab content and detail sidebar */}
          <Stack
            sx={{
              flexDirection: { md: 'row', sm: 'column' },
            }}
            mt={2}>

            {/* Tab content */}
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

              {/* If content is not empty, otherwise show "no content msg" */}
              {project.content[selectedTab] ?
                project.content[selectedTab].tabContent.map((cb, index) => (
                  <ContentBlock key={index} {...cb as ContentBlockProps} />
                ))
                :
                <Typography variant="body2" color="neutral">No content to display.</Typography>
              }

            </Stack>
            <ProjectDetails />
          </Stack>

        {/* Comments Section */}
          {comments &&
            <Box mt={10} width={'100%'}>
              <Comments comments={comments} projectId={projectId} />
            </Box>}

        </Stack>
      </ProjectContext.Provider>
    )
  } else {
    // Need to replace with loading animation.
    return <h1>Loading...</h1>
  }

}