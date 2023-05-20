import React, { SetStateAction, useContext } from 'react'
import { Box, Stack, Typography, useTheme, Chip } from '@mui/material'


import TeamnameField from './Fields/TeamnameField'
import CategoryField from './Fields/CategoryField'
import SemesterField from './Fields/SemesterField'
import MembersField from './Fields/MembersField'
import LinksField from './Fields/LinksField'
import TagsField from './Fields/TagsField'
import AwardBadge from './AwardBadge'
import { ProjectContext } from '../../routes/ProjectPage'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


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
      mt={0}
      sx={{ display: { xs: 'none', md: 'flex' }, position: 'relative' }}
    >

      <AwardBadge badgeId={project.badges?._id} />

      <TagsField />

      <CategoryField />
      <SemesterField />
      <TeamnameField />
      <MembersField />
      <LinksField />

    </Stack>
  )
}
