import React, { useContext, useEffect, useState } from 'react'
import { Box, Typography, emphasize } from '@mui/material'
import TeamMember from '../TeamMember'
import { ProjectContext } from '../ProjectPage'
import { TUser } from '../../../model/TUser';
import { getUser } from '../../../api/getUser';

export default function MembersField() {
  const { project, setProject } = useContext(ProjectContext);
  const [members, setMembers] = useState<TUser[]>([]);

  useEffect(() => {
    const promises: Promise<Promise<TUser>|null>[] = []
    for (const mId of project.members) {
      promises.push(getUser(mId));
    }
    Promise.all(promises)
      .then((results) => setMembers(results.filter(e => e) as TUser[])) // Remove nulls
  }, [])

  return (
    <Box>
      <Typography fontWeight={400} width={'100px'} variant="body1" mb={2}>Members:</Typography>
      {members.map((m, i) => (
        <TeamMember key={i} name={m.name} avatar={m.profilePicture} />

      ))}
      {/* <TeamMember name='Rowan Woods' avatar='src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg' />
      <TeamMember name='Jesse Pinkman' avatar='src/components/projectPage/dps/harps-joseph-tAvpDE7fXgY-unsplash.jpg' />
      <TeamMember name='Annie Edison' avatar='src/components/projectPage/dps/tiktok-profile-picture-idea-4--1--1.jpeg' />
      <TeamMember name='Troy Barnes' avatar='src/components/projectPage/dps/brooke-cagle-wKOKidNT14w-unsplash.jpg' />
      <TeamMember name='Isabelle Gonzalez' avatar='src/components/projectPage/dps/matheus-ferrero-W7b3eDUb_2I-unsplash.jpg' /> */}
    </Box>
  )
}
