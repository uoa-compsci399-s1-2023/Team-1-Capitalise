import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ProjectContext } from '../../routes/ProjectPage';
import EditButton from './EditButton';
import { Box, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles'
import MemberChip from './Fields/MemberChip';
import ExternalLinkBtn from './ExternalLinkBtn';
import AwardBadge from './AwardBadge';
import TagsField from './Fields/TagsField';

const NoExpandAccordianSummary = styled(AccordionSummary)({
  // border: "none",
  // Set hover pointer to default
  "&:hover:not(.Mui-disabled)": {
    cursor: "default"
  }
})


export default function ProjectDetailsAccordian() {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const { project, setProject } = React.useContext(ProjectContext)
  const theme = useTheme();

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const accordianSx = {
    boxShadow: "none",
    // border: `1px solid ${theme.customColors.DividerGrey}`,
    // borderBottom: "none"
  }

  let tags = ''
  project.tags.forEach(tag => {
    tags += ` ${tag.name}`
  })
  tags = tags.trim()


  return (
    <Box
      sx={{
        display: { md: 'none', sm: 'block' },
      }}
      p={'20px'}
    >
      {project.badges &&
        <Accordion expanded={false} sx={accordianSx} >
          <NoExpandAccordianSummary
            sx={{
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Stack>
              <Typography fontWeight={500} width={'100%'} textAlign={'center'}>
                Award
              </Typography>
              <AwardBadge badgeId={project.badges._id} />
            </Stack>

          </NoExpandAccordianSummary>
        </Accordion>

      }

      {/* Tags */}
      <Accordion
        expanded={false}
        disableGutters
        sx={{
          ...accordianSx,
        }}>
        <NoExpandAccordianSummary
          sx={{
            flexWrap: 'wrap',
            width: "100%",
            ".MuiAccordionSummary-content": {
              justifyContent: 'start',
              alignItems: 'start',
              width: '100%'
            }

          }}
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Tags:
          </Typography>
          <Box width={'67%'}>
            <TagsField />
          </Box>
          {/* <Typography 
            sx={{ 
              color: 'text.secondary', 
              textOverflow: 'ellipsis',
              width: '100%',
              whiteSpace: 'nowrap'
              }}>
            {tags}
          </Typography> */}
        </NoExpandAccordianSummary>
      </Accordion>

      {/* Category */}
      <Accordion expanded={false} sx={accordianSx} >
        <NoExpandAccordianSummary
          expandIcon={<ExpandMoreIcon sx={{ visibility: 'hidden' }} />} // Maintain spacing
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Category:
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{project.category.value}</Typography>
        </NoExpandAccordianSummary>
      </Accordion>

      {/* Semester */}
      <Accordion expanded={false} sx={accordianSx}>
        <NoExpandAccordianSummary
          expandIcon={<ExpandMoreIcon sx={{ visibility: 'hidden' }} />} // Maintain spacing
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Semester:</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {project.semester.value}
          </Typography>
        </NoExpandAccordianSummary>
      </Accordion>

      {/* Links */}
      {project.links.length > 0 &&
        <Accordion expanded={false} sx={accordianSx}>
          <NoExpandAccordianSummary
            expandIcon={<ExpandMoreIcon sx={{ visibility: 'hidden' }} />} // Maintain spacing
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>Links:</Typography>
            <Stack
              flexDirection={'row'}
              flexWrap={'wrap'}
              gap={2}
            >
              {project.links.map((link, index) => (
                <ExternalLinkBtn key={index} {...link} />
              ))}
            </Stack>
          </NoExpandAccordianSummary>
        </Accordion>
      }

      {/* Teamname / members */}
      <Accordion expanded={expanded === 'panel5'} disableGutters onChange={handleChange('panel5')} sx={accordianSx}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Team ({project.teamname.length}):
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {project.teamname}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Stack
            flexDirection={'row'}
            flexWrap={'wrap'}
          >
            {project.members.map((member, index) => (
              <MemberChip userId={member} key={index} />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>



    </Box >
  );
}