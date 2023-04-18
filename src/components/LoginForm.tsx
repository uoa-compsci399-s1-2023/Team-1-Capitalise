//REACT
import * as React from 'react';
//MUI 
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//Project Files
import Logo from "../assets/Logo.svg";
import { useAuth } from '../customHooks/useAuth';

//Copyright (Bottom of Screen)
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="capitalise.space">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
//Theme
const theme = createTheme();

//Sign In Function
function SignInSide() {
  // Auth Provider - important for calling sign in api
  const auth = useAuth();
  //Email Pattern Checker
  const emailF = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  // States for Validation Check
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailErrorText, setEmailErrorText] = React.useState("");
  const [passwordErrorText, setPasswordErrorText] = React.useState("");
  // Validation Checks - are the given inputs appropriate?
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
    } else {
      setPasswordErrorText("");
      return true;
    }
  }
  // Submit Function - what happens when you submit the form?
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const e = validateEmail();
    const p = validatePassword();
    if (e && p) {
      const data = new FormData(event.currentTarget);
      //Store Form Data as Strings
      const logEmail = data.get('email') as string;
      const logPw = data.get('password') as string;
      // Pass Email and PW onto Auth Provider -> Sign In API
      auth.signin(logEmail, logPw);
      setEmailErrorText(auth.error)
      if (auth.error == 'Invalid username or password.') {
        setEmailErrorText('Incorrect Username/Email or Password')
        setPasswordErrorText(" ")
        
      

      }
    }
  }
    

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${("/src/assets/loginbg.svg")})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}  
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
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
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="off"
                autoFocus
                value={email}
                error={!!emailErrorText}
                helperText= {emailErrorText}
                onChange={e => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
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
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}


export default SignInSide;