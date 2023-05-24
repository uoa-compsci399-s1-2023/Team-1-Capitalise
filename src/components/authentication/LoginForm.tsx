//REACT
import * as React from "react";
import { useEffect, useState } from "react";
//MUI
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import { Link as reactLink } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
//Project Files
import LoginBg from "../../assets/loginbg.svg";
import Logo from "../../assets/Logo.svg";
import { useAuth } from "../../customHooks/useAuth";
import { Divider } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

import { useNavigate } from "react-router-dom";
import validator from "validator";
import { API_URL } from "../../api/config";

//Sign In Function
function SignInSide() {
  // Auth Provider - important for calling sign in api
  const auth = useAuth();
  const nav = useNavigate();

  // useEffect(() => {
  //   if (auth.error == 'Invalid username or password.') {
  //     setEmailErrorText('Incorrect email or password! Re-enter your details.');
  //     setPasswordErrorText(' ');
  //     auth.error = "";
  //   }
  // })
  //Email Pattern Checker
  const emailF = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  // States for Validation Check
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  // Validation Checks - are the given inputs appropriate?

  useEffect(() => {
    if (auth.error === "Invalid username or password.") {
      setEmailErrorText("Incorrect Username/Email or Password");
      setPasswordErrorText(" ");
    }
  }, [auth.error]);

  const validateEmail = () => {
    if (!email) {
      setEmailErrorText("Please enter email.");
    } else if (!validator.isEmail(email)) {
      setEmailErrorText("Enter an appropriate email Format!");
    } else {
      setEmailErrorText("");
      return true;
    }
  };
  const validatePassword = () => {
    if (!password) {
      setPasswordErrorText("Please enter password.");
    } else {
      setPasswordErrorText("");
      return true;
    }
  };

  // Submit Function - what happens when you submit the form?
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const e = validateEmail();
    const p = validatePassword();
    if (e && p) {
      const data = new FormData(event.currentTarget);
      //Store Form Data as Strings
      const logEmail = data.get("email") as string;
      const logPw = data.get("password") as string;
      // Pass Email and PW onto Auth Provider -> Sign In API
      auth.signin(logEmail.toLowerCase(), logPw);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${LoginBg})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Link href="/">
              <Box
                padding="0 30px"
                component="img"
                src={Logo}
                alt="logo"
                sx={{
                  width: "300px",
                  height: "auto",
                  flexGrow: 1,
                  display: { xs: "flex", md: "flex" },
                }}
              ></Box>
            </Link>
          </Box>

          <Typography component="h1" variant="h5" sx={{ fontWeight: 500 }}>
            Login
          </Typography>

          <Box
            component="form"
            sx={{ paddingLeft: 5, paddingRight: 5 }}
            noValidate
            onSubmit={handleSubmit}
          >
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
              helperText={emailErrorText}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Divider></Divider>
            <Button
              href={`${API_URL}/api/auth/google`}
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ mt: 3, mb: 2 }}
            >
              {" "}
              Sign In with Google
            </Button>

            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item>
                <Link href="/ResetPassword" underline="hover" variant="body2">
                  {"Forgot password?"}
                </Link>
              </Grid>

              <Grid item>
                <Link href="/register" underline="hover" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SignInSide;
