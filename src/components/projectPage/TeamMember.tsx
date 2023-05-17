import { Button, Chip, Avatar, useTheme, Box, Icon } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../customHooks/useAuth';



interface FieldProps {
  name: string
  avatar: string
  role?: string
  userId: string
  isDeletable?: boolean
  onDelete?: () => void
}

export default function TeamMember({ name, avatar, userId, isDeletable, onDelete }: FieldProps) {

  const theme = useTheme();
  const auth = useAuth();

  const Member = styled(Button)({
    borderRadius: '5px',
    textTransform: 'capitalize',
    fontWeight: 300,
    display: "flex",
    justifyContent: "flex-start",
    paddingLeft: "40px",
    color: 'black',
    ':hover': {
      backgroundColor: theme.customColors.DividerGrey
    }
  })

  return (
    <Box width='100%' display='flex' flexDirection={'row'} >
      {/* Needs to redirect to user page onclick */}
      <Link to={`../user/${userId}`} style={{ width: '100%' }} target='_blank'>
        <Member
          startIcon={
            <Avatar
              imgProps={{ referrerPolicy: "no-referrer" }}
              sizes='small'
              alt={name}
              src={avatar}
              sx={{ width: 30, height: 30 }}
            />
          }
          variant='text'
          color='neutral' // Ignore type error.
          size='large'
          fullWidth
        >
          {name}
        </Member>
      </Link>
      {isDeletable &&
        < Button
          color='editBtnGrey'
          onClick={onDelete}
          sx={{
            ':hover': {
              backgroundColor: theme.customColors.DividerGrey
            }
          }}
        >
          <ClearIcon fontSize='small' />
        </Button>}
    </Box >
  )
}
