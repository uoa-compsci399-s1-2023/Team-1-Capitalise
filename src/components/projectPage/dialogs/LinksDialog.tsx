import React, { SetStateAction, useContext, useState, useEffect } from 'react'
import { TProject } from '../../../model/TProject'
import { Dialog, DialogContent, DialogTitle, FormControl, OutlinedInput, DialogActions, Button, FormHelperText, InputLabel, TextField } from '@mui/material'
import { ProjectContext } from '../../../routes/ProjectPage'
import { TProjectPost } from '../../../model/TPostProject'


interface TextBlockDialogProps {
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<SetStateAction<boolean>>
  initialLinks: TProject['links']
}

export default function TextBlockDialog({ isDialogOpen, setIsDialogOpen, initialLinks }: TextBlockDialogProps) {

  const { project, setProjectChanges } = useContext(ProjectContext);
  const [githubLink, setGithubLink] = useState<TProject['links'][0]['value'] | ''>('');
  const [githubError, setGithubError] = useState<string>('');
  const [codeSandboxLink, setCodeSandboxLink] = useState<TProject['links'][0]['value'] | ''>('');
  const [codeSandboxError, setCodeSandboxError] = useState<string>('');
  const [demoLink, setDemoLink] = useState<TProject['links'][0]['value'] | ''>('');
  const [demoError, setDemoError] = useState<string>('');


  useEffect(() => {
    const github = initialLinks.filter(link => link.type === 'github');
    const codeSandbox = initialLinks.filter(link => link.type === 'codesandbox');
    const demo = initialLinks.filter(link => link.type === 'deployedSite');
    if (github.length > 0) {
      setGithubLink(github[0].value)
    }
    if (codeSandbox.length > 0) {
      setCodeSandboxLink(codeSandbox[0].value)
    }
    if (demo.length > 0) {
      setDemoLink(demo[0].value)
    }
  }, [isDialogOpen])

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, type: TProject['links'][0]['type']) => {
    const value = e.target.value;
    switch(type) {
      case 'github':
        setGithubLink(value);
        break;
      case 'codesandbox':
        setCodeSandboxLink(value);
        break;
      case 'deployedSite':
        setDemoLink(value);
        break;
    }
  }

  const handleSave = () => {
    if (!githubError && !codeSandboxError && !demoError) {

      // Get current content, and change the required block value.
      const links: TProjectPost['links'] = []


      if (githubLink) {
        links.push({
          type: 'github',
          value: githubLink
        })
      }
      if (codeSandboxLink) {
        links.push({
          type: 'codesandbox',
          value: codeSandboxLink
        })
      }
      if (demoLink) {
        links.push({
          type: 'deployedSite',
          value: demoLink
        })
      }

      setProjectChanges({
        ['links']: links
      })
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      fullWidth
      maxWidth='lg'
      PaperProps={{ sx: { p: 2 } }}
    >

      <DialogTitle>Edit links</DialogTitle>
      <DialogContent
      >
        <TextField
          id='github-link-edit'
          placeholder='Github link'
          variant='outlined'
          error={!!githubError}
          helperText={githubError}
          value={githubLink}
          onChange={(e) => handleChange(e, 'github')}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} // Save if enter pressed
          fullWidth
          sx={{ my: 1 }}
        />

        <TextField
          id='codesandbox-link-edit'
          placeholder='CodeSandbox link'
          variant='outlined'
          error={!!codeSandboxError}
          helperText={codeSandboxError}
          value={codeSandboxLink}
          onChange={(e) => handleChange(e, 'codesandbox')}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} // Save if enter pressed
          fullWidth
          sx={{ my: 1 }}
        />

        <TextField
          id='demo-link-edit'
          placeholder='Deployed artefact link'
          variant='outlined'
          error={!!demoError}
          helperText={demoError}
          value={demoLink}
          onChange={(e) => handleChange(e, 'deployedSite')}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} // Save if enter pressed
          fullWidth
          sx={{ my: 1 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog >

  )
}

