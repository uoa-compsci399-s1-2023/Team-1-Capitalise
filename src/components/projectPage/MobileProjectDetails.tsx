import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ProjectContext } from '../../routes/ProjectPage';
import EditButton from './EditButton';
import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles'
import MemberChip from './Fields/MemberChip';
import ExternalLinkBtn from './ExternalLinkBtn';

export default function ProjectDetailsAccordian() {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const { project, setProject } = React.useContext(ProjectContext)

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const NoExpandAccordianSummary = styled(AccordionSummary)({
    // Set hover pointer to default
    "&:hover:not(.Mui-disabled)": {
      cursor: "default"
    }
  })

  return (
    <Box
      sx={{ display: { md: 'none', sm: 'block' } }}
      p={'20px'}
    >

      <Accordion expanded={expanded === 'panel1'} >
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

      <Accordion expanded={expanded === 'panel2'}>
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

      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
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



      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Links:</Typography>
          <Stack
            flexDirection={'row'}
            flexWrap={'wrap'}
          >
            {project.links.map((link, index) => (
              <ExternalLinkBtn key={index} {...link} />
            ))}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
            amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}