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

  return (
    <Box
      sx={{ 
        display: { md: 'none', sm: 'block' },
      }}
      p={'20px'}
    >
      {project.badges &&
        <Accordion expanded={expanded === 'panel1'} sx={accordianSx} >
          <NoExpandAccordianSummary
            sx={{
              flexDirection: 'column',
              alignItems: 'center'
            }}
            // expandIcon={<ExpandMoreIcon sx={{ visibility: 'hidden' }} />} // Maintain spacing
            aria-controls="panel1bh-content"
            id="panel1bh-header"
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

      {/* Category */}
      <Accordion expanded={expanded === 'panel2'} sx={accordianSx} >
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
      <Accordion expanded={expanded === 'panel3'} sx={accordianSx}>
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
        <Accordion expanded={expanded === 'panel4'} sx={accordianSx}>
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