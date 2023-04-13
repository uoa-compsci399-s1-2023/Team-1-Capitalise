import React from 'react'
import { Box, Stack, Typography, useTheme, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

import EditableTextField from './EditableTextField'
import StatusChip from './StatusChip'
import TeamMember from './TeamMember'
import GithubBtn from './GithubBtn'
import CodeSandboxBtn from './CodeSandbox'


export default function ProjectDetails() {

  const theme = useTheme()
  // const EditableText = styled(EditableTextField)();

  return (
    <Stack
      width={'340px'}
      bgcolor={'white'}
      style={theme.contentBlock}
      padding={'40px'}
      m={'40px'}
      gap={4}
    >
      <StatusChip label='Status:' status='Pending Approval' />
      <EditableTextField label='Category:' text='Web Development' />
      <EditableTextField label='Semester:' text='S1 2023' />
      <EditableTextField label='Team:' text='Zuckerg Enterprises' />

      <Box>
        <Typography fontWeight={400} width={'100px'} variant="body1" mb={2}>Members:</Typography>
        <TeamMember name='Rowan Woods' avatar='src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg' />
        <TeamMember name='Jesse Pinkman' avatar='src/components/projectPage/dps/harps-joseph-tAvpDE7fXgY-unsplash.jpg' />
        <TeamMember name='Annie Edison' avatar='src/components/projectPage/dps/tiktok-profile-picture-idea-4--1--1.jpeg' />
        <TeamMember name='Troy Barnes' avatar='src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg' />
        <TeamMember name='Isabelle Gonzalez' avatar='src/components/projectPage/dps/matheus-ferrero-W7b3eDUb_2I-unsplash.jpg' />
      </Box>

      <Box mt={3}>
        <Typography fontWeight={400} width={'100px'} variant="body1" mb={2}>Links:</Typography>
        <GithubBtn />
        <CodeSandboxBtn />
      </Box>





    </Stack>
  )
}
