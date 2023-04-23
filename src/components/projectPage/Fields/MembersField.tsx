import React, { useContext, useEffect, useState } from 'react'
import { Box, Typography, emphasize } from '@mui/material'
import TeamMember from '../TeamMember'
import { ProjectContext } from '../ProjectPage'
import { TUser } from '../../../model/TUser';
import { getUser } from '../../../api/getUser';
import EditButton from '../EditButton';

export default function MembersField() {

  const { project, setProjectChanges } = useContext(ProjectContext);
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
    </Box>
  )
}
