import React, { SetStateAction, useContext } from 'react'
import { Box, Stack, Typography, useTheme, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'


import { TMockProject } from '../../model/MockProject'
import { ProjectProps } from './ProjectPage'
import TeamnameField from './Fields/TeamnameField'
import CategoryField from './Fields/CategoryField'
import SemesterField from './Fields/SemesterField'
import MembersField from './Fields/MembersField'
import StatusChip from './StatusChip'
import TeamMember from './TeamMember'
import GithubBtn from './GithubBtn'
import CodeSandboxBtn from './CodeSandbox'
import AwardBadge from './AwardBadge'
import { ProjectContext } from './ProjectPage'




export default function ProjectDetails() {

  const theme = useTheme()
  const {project, setProject} = useContext(ProjectContext);



  return (
    <Stack
      maxWidth={'30%'}
      bgcolor={'white'}
      style={theme.contentBlock}
      padding={'20px'}
      gap={4}
      sx={{ display: { xs: 'none', md: 'flex' }, position: 'relative' }}
    >
      {/* <StatusChip label='Status:' status='Pending Approval' /> */}

      {project.badges?.length > 0 && <AwardBadge {...project.badges[0]} />}
      <CategoryField />
      <SemesterField />
      <TeamnameField />
      {/* <TeamnameField type='text' name='' label='Team:' text={`${project.teamname}`} /> */}

      <MembersField />
      <Box>
        <Typography fontWeight={400} width={'100px'} variant="body1" mb={2}>Links:</Typography>
        <GithubBtn />
        <CodeSandboxBtn />
      </Box>

      <Stack flexDirection={'row'} gap={1}>
        <Chip size='small' label='#ML' />
        <Chip size='small' label='#Artificial Intelligence' />
        <Chip size='small' label='#Data Science' />
      </Stack>
    </Stack>

  )
}
