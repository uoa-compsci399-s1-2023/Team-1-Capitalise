import React, { useContext } from 'react'
import { Box, Typography } from '@mui/material'
import TeamMember from '../TeamMember'
import { ProjectContext } from '../ProjectPage'

export default function MembersField() {
  const { project, setProject } = useContext(ProjectContext);
  return (
    <Box>
      <Typography fontWeight={400} width={'100px'} variant="body1" mb={2}>Members:</Typography>
      {project.members.map((m, i) => (
        <TeamMember name={m.name} avatar='src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg' />

      ))}
      {/* <TeamMember name='Rowan Woods' avatar='src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg' />
      <TeamMember name='Jesse Pinkman' avatar='src/components/projectPage/dps/harps-joseph-tAvpDE7fXgY-unsplash.jpg' />
      <TeamMember name='Annie Edison' avatar='src/components/projectPage/dps/tiktok-profile-picture-idea-4--1--1.jpeg' />
      <TeamMember name='Troy Barnes' avatar='src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg' />
      <TeamMember name='Isabelle Gonzalez' avatar='src/components/projectPage/dps/matheus-ferrero-W7b3eDUb_2I-unsplash.jpg' /> */}
    </Box>
  )
}
