import { Box, Stack, Typography, useTheme, Button, Chip } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

interface ProjectHeaderProps {
  name: string
  blurb?: string
  likes: number
}


export default function ProjectHeader({ name, blurb, likes }: ProjectHeaderProps) {

  const theme = useTheme()

  return (
    <>
      <Stack
        // style={theme.contentBlock}
        padding={'0 20px'}
        width={'100%'}
        mt={4}
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Box>
          <Typography 
            variant="h1" 
            color="initial" 
            mt={1}
            fontWeight={600}
            alignSelf={'center'}
          >
            {name}
          </Typography>
          <Typography
            component='p'
            variant='body2'
            fontSize={16}
            mt={1}
          >
            {blurb}
          </Typography>
        </Box>

        <Stack flexDirection={'row'} gap={2}>
          <Button
            variant='contained'
            color='error'
            startIcon={<FavoriteIcon />}
          >
            {`Like (${likes})`}
          </Button>
          <Button
            variant='outlined'
            color='neutral'
            startIcon={<ChatOutlinedIcon />}
          >
            Comment
          </Button>
        </Stack>
      </Stack>

    </>
  )
}
