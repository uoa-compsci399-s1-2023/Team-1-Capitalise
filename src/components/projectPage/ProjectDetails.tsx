import React from 'react'
import { Box, Stack, Typography, useTheme, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'


import { TMockProject } from '../../model/MockProject'
import EditableTextField from './EditableTextField'
import StatusChip from './StatusChip'
import TeamMember from './TeamMember'
import GithubBtn from './GithubBtn'
import CodeSandboxBtn from './CodeSandbox'
import AwardBadge from './AwardBadge'


export default function ProjectDetails(p: TMockProject) {

  const theme = useTheme()
  // const EditableText = styled(EditableTextField)();

  return (
    <Stack
      maxWidth={'30%'}
      bgcolor={'white'}
      style={theme.contentBlock}
      padding={'40px'}
      gap={4}
      sx={{ display: { xs: 'none', md: 'flex' }, position: 'relative' }}
    >
      {/* <StatusChip label='Status:' status='Pending Approval' /> */}

      {p.badges.length > 0 && <AwardBadge {...p.badges[0]} />}
      <EditableTextField label='Category:' text={`${p.category.value}`} />
      <EditableTextField label='Semester:' text={`${p.semester.value}`} />
      <EditableTextField label='Team:' text={`${p.teamname}`} />

      <Box>
        <Typography fontWeight={400} width={'100px'} variant="body1" mb={2}>Members:</Typography>
        {/* {p.members.map((m, i) => (
          <TeamMember name={m.name} avatar='src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg' />

        ))} */}
        <TeamMember name='Rowan Woods' avatar='src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg' />
        <TeamMember name='Rowan Woods' avatar='src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg' />
        <TeamMember name='Jesse Pinkman' avatar='src/components/projectPage/dps/harps-joseph-tAvpDE7fXgY-unsplash.jpg' />
        <TeamMember name='Annie Edison' avatar='src/components/projectPage/dps/tiktok-profile-picture-idea-4--1--1.jpeg' />
        <TeamMember name='Troy Barnes' avatar='src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg' />
        <TeamMember name='Isabelle Gonzalez' avatar='src/components/projectPage/dps/matheus-ferrero-W7b3eDUb_2I-unsplash.jpg' />
      </Box>

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
