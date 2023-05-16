import { Chip, Avatar } from '@mui/material'
import { useEffect, useState } from 'react'
import { TUser } from '../../../model/TUser'
import { getUser } from '../../../api/getUser'

interface MemberChipProps {
  userId: string
}

export default function MemberChip({ userId }: MemberChipProps) {

  const [user, setUser] = useState<TUser | undefined>();

  useEffect(() => {
    getUser(userId)
      .then((data) => {
        if (data) {
          setUser(data)
        }
      })
  })

  return (
    <Chip
      label={user?.name}
      variant="outlined"
      component={'a'}
      href={`../user/${userId}`}
      clickable
      avatar={
        <Avatar
          imgProps={{ referrerPolicy: "no-referrer" }}
          sizes='small'
          alt={user?.name}
          src={user?.profilePicture}
          sx={{ width: 30, height: 30 }}
        />}
      sx={{
        m: 0.5
      }}
    />
  )
}
