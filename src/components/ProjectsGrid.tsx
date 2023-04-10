import { Container, Grid2 } from '../mui'
import ProjectCard from './ProjectCard'
import { TProject } from '../api/getProjects'

interface props {
  projects: TProject[]
}

export default function ProjectsGrid({ projects }: props) {
  return (
    <Container>
      <Grid2
        container
        gap="50px"
        justifyContent="center"
        sx={{ margin: "px" }}
      >
        {projects.map((project) => (
          <Grid2 key={project._id}>
            <ProjectCard
              title={project.name}
              semester={project.semester.value}
            ></ProjectCard>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  )
}
