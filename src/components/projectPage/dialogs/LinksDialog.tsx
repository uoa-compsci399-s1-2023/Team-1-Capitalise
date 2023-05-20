import React, { SetStateAction, useContext, useState, useEffect } from 'react'
import { TProject } from '../../../model/TProject'
import { Dialog, DialogContent, DialogTitle, FormControl, OutlinedInput, DialogActions, Button, FormHelperText, InputLabel, TextField } from '@mui/material'
import { ProjectContext } from '../../../routes/ProjectPage'
import { TProjectPost } from '../../../model/TPostProject'


interface LinksDialogProps {
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<SetStateAction<boolean>>
}

export default function LinksDialog({ isDialogOpen, setIsDialogOpen }: LinksDialogProps) {

  const { project, setProjectChanges } = useContext(ProjectContext);
  const [githubLink, setGithubLink] = useState<TProject['links'][0]['value'] | ''>('');
  const [githubError, setGithubError] = useState<string>('');
  const [codeSandboxLink, setCodeSandboxLink] = useState<TProject['links'][0]['value'] | ''>('');
  const [codeSandboxError, setCodeSandboxError] = useState<string>('');
  const [demoLink, setDemoLink] = useState<TProject['links'][0]['value'] | ''>('');
  const [demoError, setDemoError] = useState<string>('');

  useEffect(() => {
    const initialLinks = project.links
    const github = initialLinks.find(link => link.type === 'github');
    const codeSandbox = initialLinks.find(link => link.type === 'codesandbox');
    const demo = initialLinks.find(link => link.type === 'deployedSite');
    if (github) {
      setGithubLink(github.value)
    }
    if (codeSandbox) {
      setCodeSandboxLink(codeSandbox.value)
    }
    if (demo) {
      setDemoLink(demo.value)
    }
    setGithubError('')
    setCodeSandboxError('')
    setDemoError('')
  }, [isDialogOpen])

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  // Helper for link validation
  const isUrlValid = (url: string, urlWebsite: string) => {
    return (
      !url.includes(" ") &&
      (url.startsWith("https://www." + urlWebsite) ||
        url.startsWith("https://" + urlWebsite) ||
        url.startsWith("http://" + urlWebsite) ||
        !url
      ));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, type: TProject['links'][0]['type']) => {
    const value = e.target.value.trim();
    switch (type) {
      case 'github':
        setGithubLink(value);
        if (value && !isUrlValid(value, "github.com/")) {
          setGithubError('Please enter a vaild Github link. (Don\'t forget the https!)')
        } else {
          setGithubError('')
        }
        break;
      case 'codesandbox':
        setCodeSandboxLink(value);
        if (value && !isUrlValid(value, "codesandbox.io/")) {
          setCodeSandboxError('Please enter a vaild CodeSandbox link. (Don\'t forget the https!)')
        } else {
          setCodeSandboxError('')
        }
        break;
      case 'deployedSite':
        setDemoLink(value);
        if (value && !isUrlValid(value, "")) {
          setDemoError('Please enter a vaild HTTP URL')
        } else {
          setDemoError('')
        }
        break;
    }
  }

  const handleSave = () => {
    if (!githubError && !codeSandboxError && !demoError) {

      // Get current content, and change the required block value.
      const links: TProjectPost['links'] = []

      if (!githubError && githubLink) {
        links.push({
          type: 'github',
          value: githubLink
        })
      }
      if (!codeSandboxError && codeSandboxLink) {
        links.push({
          type: 'codesandbox',
          value: codeSandboxLink
        })
      }
      if (!demoLink && demoLink) {
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
      maxWidth='sm'
      PaperProps={{ sx: { p: 2 } }}
    >

      <DialogTitle>Edit Links</DialogTitle>
      <DialogContent
      >
        <TextField
          label="Github"
          id='github-link-edit'
          // placeholder='Github link'
          variant='outlined'
          error={!!githubError}
          helperText={githubError || ' '}
          value={githubLink}
          onChange={(e) => handleChange(e, 'github')}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} // Save if enter pressed
          fullWidth
          sx={{ my: 1 }}
        />

        <TextField
          label="CodeSandbox"
          id='codesandbox-link-edit'
          // placeholder='CodeSandbox link'
          variant='outlined'
          error={!!codeSandboxError}
          helperText={codeSandboxError || ' '}
          value={codeSandboxLink}
          onChange={(e) => handleChange(e, 'codesandbox')}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} // Save if enter pressed
          fullWidth
          sx={{ my: 1 }}
        />

        <TextField
          label="Deployed Artefact"
          id='demo-link-edit'
          // placeholder='Deployed artefact link'
          variant='outlined'
          error={!!demoError}
          helperText={demoError || ' '}
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

