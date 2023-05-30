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

  const [kaggleLink, setKaggleLink] = useState<TProject['links'][0]['value'] | ''>('');
  const [kaggleError, setKaggleError] = useState<string>('');

  const [codePenLink, setCodePenLink] = useState<TProject['links'][0]['value'] | ''>('');
  const [codePenError, setCodePenError] = useState<string>('');

  const [notionLink, setNotionLink] = useState<TProject['links'][0]['value'] | ''>('');
  const [notionError, setNotionError] = useState<string>('');

  useEffect(() => {
    const initialLinks = project.links
    const github = initialLinks.find(link => link.type === 'github');
    const codeSandbox = initialLinks.find(link => link.type === 'codesandbox');
    const demo = initialLinks.find(link => link.type === 'deployedSite');
    const kaggle = initialLinks.find(link => link.type === 'kaggle');
    const notion = initialLinks.find(link => link.type === 'notion');
    const codepen = initialLinks.find(link => link.type === 'codepen');
    if (github) {
      setGithubLink(github.value)
    }
    if (codeSandbox) {
      setCodeSandboxLink(codeSandbox.value) 
    }
    if (demo) {
      setDemoLink(demo.value)
    }
    if (kaggle) {
      setKaggleLink(kaggle.value)
    }
    if (notion) {
      setNotionLink(notion.value)
    }
    if (codepen) {
      setCodePenLink(codepen.value)
    }
    setGithubError('')
    setCodeSandboxError('')
    setDemoError('')
    setKaggleError('')
    setNotionError('')
    setCodePenError('')
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
      case 'kaggle':
        setKaggleLink(value);
        if (value && !isUrlValid(value, "kaggle.com/")) {
          setKaggleError('Please enter a vaild Kaggle link. (Don\'t forget the https!)')
        } else {
          setKaggleError('')
        }
        break;
      case 'notion':
        setNotionLink(value);
        if (value && !isUrlValid(value, "notion.so/")) {
          setNotionError('Please enter a vaild notion link. (Don\'t forget the https!)')
        } else {
          setNotionError('')
        }
        break;
      case 'codepen':
        setCodePenLink(value);
        if (value && !isUrlValid(value, "codepen.io/")) {
          setCodePenError('Please enter a vaild codepen link. (Don\'t forget the https!)')
        } else {
          setCodePenError('')
        }
        break;
    }
  }

  const handleSave = () => {
    if (!githubError && !codeSandboxError && !demoError && !kaggleError) {

      // Get current content, and change the required block value.
      const links: TProjectPost['links'] = []

      if (!demoError && demoLink) {
        links.push({
          type: 'deployedSite',
          value: demoLink
        })
      }
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
      if (!kaggleError && kaggleLink) {
        links.push({
          type: 'kaggle',
          value: kaggleLink
        })
      }
      if (!codePenError && codePenLink) {
        links.push({
          type: 'codepen',
          value: codePenLink
        })
      }
      if (!notionError && notionLink) {
        links.push({
          type: 'notion',
          value: notionLink
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

        <TextField
          label="Kaggle"
          id='kaggle-link-edit'
          // placeholder='Deployed artefact link'
          variant='outlined'
          error={!!kaggleError}
          helperText={kaggleError || ' '}
          value={kaggleLink}
          onChange={(e) => handleChange(e, 'kaggle')}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} // Save if enter pressed
          fullWidth
          sx={{ my: 1 }}
        />

        <TextField
          label="notion"
          id='notion-link-edit'
          // placeholder='Deployed artefact link'
          variant='outlined'
          error={!!notionError}
          helperText={notionError || ' '}
          value={notionLink}
          onChange={(e) => handleChange(e, 'notion')}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} // Save if enter pressed
          fullWidth
          sx={{ my: 1 }}
        />

        <TextField
          label="codepen"
          id='codepen-link-edit'
          // placeholder='Deployed artefact link'
          variant='outlined'
          error={!!codePenError}
          helperText={codePenError || ' '}
          value={codePenLink}
          onChange={(e) => handleChange(e, 'codepen')}
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

