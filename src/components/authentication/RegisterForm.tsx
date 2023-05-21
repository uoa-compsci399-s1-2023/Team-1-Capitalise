import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../customHooks/useAuth';
import Logo from "../../assets/Logo.svg";
import { Alert, Divider, Fade } from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import validator from 'validator';
//Copyright bottom of page
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

//Sign Up Function
export default function SignUp() {
    // Reg Expressions for validation
    
    const spCh = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    const emailF = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailErrorText, setEmailErrorText] = useState("");
    const [passwordErrorText, setPasswordErrorText] = useState("");
    const [name, setName] = useState("");
    const [nameErrorText, setNameErrorText] = useState("");

  // Auth Provider
  const auth = useAuth();

  //Validators
  const validateName = () => {
    if (!name) {
      setNameErrorText("Please enter a name.");

      
    } else if(name.length > 50) {
      setNameErrorText("Name has reached maximum characters of 50");
    } else if (spCh.test(name)) {
      setNameErrorText("Please enter a name without special characters");
    
    } else {
      setNameErrorText("");
      return true;
    }
  }
  
  const validateEmail = () => {
    if (!email) {
      setEmailErrorText("Please enter email.");
     
    } else if (!emailF.test(email)) {
      setEmailErrorText("Enter an email in the format of example@aucklanduni.ac.nz or example@domain.com");
     
    } else {
      setEmailErrorText("");
      return true;
      
    }
  }
    
  const validatePassword = () => {
    if (!password) {
      setPasswordErrorText("Please enter password.");
     
      
    } else if (password.length < 5) {
      setPasswordErrorText("Please enter a password longer than 5 characters");
    
    } else {
      setPasswordErrorText("");
      return true;
    }
  }
    
  // Submit Function (What happens when you submit the form?)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    
    //Retrieve validation booleans. Must keep this so all errors appear on the UI  at the same time
    const n = validateName();

    const e = validateEmail();
    const p = validatePassword();
    event.preventDefault();
    // Check if all are valid before submitting to server.
    if (n && e && p) {
      const data = new FormData(event.currentTarget);   
      //Get all form data and convert to string   
      const fn = data.get('fullName') as string;
      const em = data.get('email') as string;
      const pw = data.get('password') as string;
      //Create object obeying SignUpProp Interface.
      const userToSignUp = {name: fn, email: em , password: pw}
      //Pass object to authenticator provider to add user to database.
      auth.signup(userToSignUp);

      
    }
    
  }
//Error Handler
  

  return (
    // Yathi - Don't need to recreate theme. It's already in App.tsx
    // <ThemeProvider theme={theme}> 
      <Container component="main" maxWidth="xs">
        <CssBaseline />
    
        <Box
          sx={{
            // mt: "16vh",  Yathi - don't need this. Margin added in parent component
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
              component="img"
              src={Logo}
              alt="logo"
              sx={{
                width: "300px",
                flexGrow: 1,
                display: { xs: "flex", md: "flex" },
              }}
            ></Box>
          <Typography sx={{fontWeight: "700"}}component="h1" variant="h6">
            Register
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  label="Full Name"
                  name="fullName"
                  autoComplete="full-name"
                  id="fullName"
                  required
                  autoFocus
                  fullWidth
                  value={name}
                  error={!!nameErrorText}
                  helperText= {nameErrorText}
                  onChange={e => setName(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="off"
                  value={email}
                  error={!!emailErrorText}
                  helperText= {emailErrorText}
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="off"
                  value={password}
                  error={!!passwordErrorText}
                  helperText={passwordErrorText}
                  onChange={e => setPassword(e.target.value)}
                />
              </Grid>
              
             
            </Grid>
          
       
             <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
    
            
            <Divider></Divider>
            <Button href="https://bh71phacjb.execute-api.ap-southeast-2.amazonaws.com/api/auth/google" fullWidth variant="outlined" startIcon={<GoogleIcon/>} sx={{mt: 3, mb: 2}}> Sign up with Google</Button>
            <Grid sx={{mb:2}}container justifyContent="center">
              <Grid item>
                <Link href="/login" underline="hover"variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
   
       
      </Container>
    // </ThemeProvider>
  );
            }          
            
          