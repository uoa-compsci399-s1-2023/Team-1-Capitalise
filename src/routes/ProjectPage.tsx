import React, { useState, SetStateAction, useContext, createContext, useEffect } from 'react'
import ProjectDetails from '../components/projectPage/ProjectDetails';
import ContentBlock, { ContentBlockProps } from '../components/projectPage/ContentBlock';
import ProjectHeader from '../components/projectPage/ProjectHeader';
import ProjectBanner from '../components/projectPage/ProjectBanner';
import TabButtonSelection from '../components/projectPage/TabButtonSelection';
import TabButton from '../components/projectPage/TabButton';
import { getProject } from '../api/getProject'
import { Stack, Box, useTheme, Container, Typography, Button, Divider, useMediaQuery } from '@mui/material';
import { TProject } from '../model/TProject';
import { TProjectPost } from '../model/TPostProject';
import { patchProject } from '../api/patchProject';
import { useAuth } from '../customHooks/useAuth';
import ProjectDetailsAccordian from '../components/projectPage/MobileProjectDetails';
import { useParams } from 'react-router-dom';
import { TComment } from '../model/TComment';
import Comments from '../components/projectPage/Comments/Comments';
import { getProjectComments } from '../api/getProjectComments';
import LoadingDialog from '../components/projectPage/dialogs/LoadingDialog';


type TabContent = {
  type: "gallery" | "poster" | "text" | "sectionHeading" | "video" | "codeBlock" | "quote"
  value: string[]
}

export interface ProjectProps {
  project: TProject
  setProject: React.Dispatch<SetStateAction<TProject>>
  // projectChanges: Partial<TProject | null>;
  setProjectChanges: React.Dispatch<SetStateAction<TProjectPost | null>> // No getter. Displayed project is always in sync with backend.
  setSelectedTab: React.Dispatch<SetStateAction<number>>
  checkIsEdit: () => boolean
  checkIsAdminEdit: () => boolean
  // isLoading: boolean
  // setIsLoading: React.Dispatch<SetStateAction<boolean>>
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
  const [isEditMode, setIsEditMode] = useState(true);
  const [comments, setComments] = useState<TComment[] | undefined>();

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

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
  // Too many api calls so commented out - Yathi 17/05/2022 
  useEffect(() => {
    if (projectChanges) {
      setIsLoading(true);
      patchProject(
        project._id,
        {
          ...projectChanges,
          // ["isBeingEdited"]: false
        },
        auth.getToken() as string,
      ).then(resp => {
        if (resp.ok) {
          // Set project to display updated project.
          return resp.json();
        } else {
          // Log error and do nothing.
          return resp.text()
        }
      }).then((data) => {
        if (typeof data === typeof {}) {
          setProject(data)
        } else {
          console.log(data);
        }
      }).finally(() => {
        setProjectChanges(null) // Clears changes. Won't cause loop because of null check at start.
        setIsLoading(false)
      })
    }
  }, [projectChanges]) // Will run anytime changes are set.

  const checkIsEdit = () => {
    return (
      isEditMode &&
      isDesktop &&
      auth.isAllowed(['admin'], project.members)
    )
  }

  const checkIsAdminEdit = () => {
    return isEditMode && isDesktop && auth.isAllowed(['admin'])
  }

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
        setProjectChanges,
        checkIsEdit,
        checkIsAdminEdit,
        setSelectedTab,
        // isLoading,
        // setIsLoading
      }}
    >
      <LoadingDialog
        isOpen={isLoading}
      />
      {project.content &&
        <>
        {/* Banner */}
        <ProjectBanner />
          {/* Everything else */}
          <Stack
            bgcolor={'white'}
            minHeight={'92vh'}
            maxWidth={'1600px'}
            mx={'auto'}
            sx={{
              pl: { md: 6, xs: 1 },
              pr: { md: 4, xs: 1 }
            }}
          >
            {/* Includes title, blurb, like button, etc */}
            <ProjectHeader
              name={project.name}
              blurb={project.blurb}
              {...{ isEditMode, setIsEditMode }}
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
              <Stack flex={1} alignItems={'center'} mr={1} mb={6}>

                <TabButtonSelection {...{ selectedTab, setSelectedTab }} />

                {
                  project.content && project.content[selectedTab] ?
                    project.content[selectedTab].tabContent.map((cb, index) => (
                      <ContentBlock
                        key={index}
                        {...{
                          ...cb,
                          ['tabIndex']: selectedTab,
                          ['blockIndex']: index
                        }}
                      />
                    ))
                    :
                    <Typography variant="body2" color="text.secondary">No content to display.</Typography>
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

        </>
      }
    </ProjectContext.Provider>
  )
}