import React, { SetStateAction, useContext } from 'react'
import { Box, Stack, Typography, useTheme, Chip } from '@mui/material'


import TeamnameField from './Fields/TeamnameField'
import CategoryField from './Fields/CategoryField'
import SemesterField from './Fields/SemesterField'
import MembersField from './Fields/MembersField'
import ExternalLinkBtn from './ExternalLinkBtn'
import AwardBadge from './AwardBadge'
import { ProjectContext } from '../../routes/ProjectPage'
import LinksField from './Fields/LinksField'




export default function ProjectDetails() {

  const theme = useTheme()
  const { project, setProjectChanges } = useContext(ProjectContext);

  return (
    <Stack
      width={'300px'}
      bgcolor={'white'}
      style={theme.contentBlock}
      padding={'20px'}
      gap={1}
      mt={4}
      sx={{ display: { xs: 'none', md: 'flex' }, position: 'relative' }}
    >

      {project.badges && <AwardBadge badgeId={project.badges._id} />}

      <CategoryField />
      <SemesterField />
      <TeamnameField />
      <MembersField />

      {/* If there are links to show */}
      {project.links[0] && <LinksField />}
      
      <Stack mt={8} flexDirection={'row'} gap={1} flexWrap={'wrap'}>
        {project.tags.map((tag, i) => (
          <Chip key={i} size='small' label={tag.name} />
        ))}
      </Stack>

    </Stack>
  )
}
