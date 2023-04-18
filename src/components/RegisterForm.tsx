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
import { useAuth } from '../customHooks/useAuth';
import Logo from "../assets/Logo.svg";

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
  // Auth Provider
  const auth = useAuth();
  // Reg Expressions for validation
  const spCh = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
  const emailF = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailErrorText, setEmailErrorText] = React.useState("");
  const [passwordErrorText, setPasswordErrorText] = React.useState("");
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [nameErrorText, setNameErrorText] = React.useState("");
  const [usernameErrorText, setUsernameErrorText] = React.useState("");
  //Validators
  const validateName = () => {
    if (!name) {
      setNameErrorText("Please enter a name.");
      
    } else if (spCh.test(name)) {
      setNameErrorText("Please enter a name without special characters");
    
    } else {
      setNameErrorText("");
      return true;
    }
  }
  const validateUsername = () => {
    if (!username) {
      setUsernameErrorText("Please enter a username.");
      
    } else {
      setUsernameErrorText("");
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
    const u = validateUsername();
    const e = validateEmail();
    const p = validatePassword();
    event.preventDefault();
    // Check if all are valid before submitting to server.
    if (n && u && e && p) {
      const data = new FormData(event.currentTarget);   
      //Get all form data and convert to string   
      const fn = data.get('fullName') as string;
      const un = data.get('userName') as string;
      const em = data.get('email') as string;
      const pw = data.get('password') as string;
      //Create object obeying SignUpProp Interface.
      const userToSignUp = {name: fn, username: un, email: em , password: pw}
      //Pass object to authenticator provider to add user to database.
      auth.signup(userToSignUp);
      //Error Handler
      if (auth.error != '') {
        if (auth.error == 'Email already registered.') {
          setEmailErrorText('Email is already registered. Please enter another one.')
          
        } else if (auth.error == 'Username already registered.') {
          setUsernameErrorText('Username is already registered. Please enter another one.')
        }
      }
  
  }}

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Box
              padding="0 30px"
              component="img"
              src={Logo}
              alt="logo"
              sx={{
                width: "200px",
                height: "auto",
                flexGrow: 1,
                display: { xs: "flex", md: "flex" },
              }}
            ></Box>
          <Typography component="h1" variant="h6">
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
              <Grid item xs={12} >
                <TextField
                  autoComplete="off"
                  name="userName"
                  id="userName"
                  label="Username"
                  required
                  fullWidth
                  autoFocus
                  value={username}
                  error={!!usernameErrorText}
                  helperText= {usernameErrorText}
                  onChange={e => setUsername(e.target.value)}
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
              sx={{ mt: 3, mb: 2 }}
              >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );}

