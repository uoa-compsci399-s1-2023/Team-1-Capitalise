  import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useAuth } from "../customHooks/useAuth"
  import Logo from "../assets/Logo.svg";
  import { Link, Navigate, useNavigate } from "react-router-dom";
  import LoginBg from "../assets/loginbg.svg"

  export default function ResetPassword() {

  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");

  // Auth Provider
  const auth = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (auth.success) {
      setPasswordSuccess(auth.success);
      nav('/')
    }

    }, [auth.success]

  )
  // Reg Expressions for validation

  

  //Validators
  const validatePassword = (pw: string, cpw: string) => {
    if (!pw) {
      setPasswordErrorText("Please enter password.");
    } else if (pw.length < 5) {
      setPasswordErrorText("Please enter a password longer than 5 characters");
    } else if (!(pw == cpw)){
      setPasswordErrorText("Passwords do not match!")
    } else {
      setPasswordErrorText("");
      return true;
    }
  }
    
  // Submit Function (What happens when you submit the form?)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    
    //Retrieve validation booleans. Must keep this so all errors appear on the UI  at the same time
    const data = new FormData(event.currentTarget);  
    const pw = data.get('password') as string;
    const cpw = data.get('confirmPassword') as string;
    const p = validatePassword(pw, cpw);
    event.preventDefault();
    // Check if all are valid before submitting to server.
    if (p) {
      let params = new URLSearchParams(document.location.search);
      let passwordResetToken = params.get("passwordResetToken");

      const newPassword = {'password': pw, 'passwordResetToken': passwordResetToken}
      //Pass object to authenticator provider to add user to database.
      auth.changePassword(newPassword);
    }
  }
  //Error Handler


  return (
      <div style={{background: "white"}}>
      <Box
        mt={'-8vh'}
    
      
      >
        
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#f0f0f0" // Set your desired background color
        sx={{ backgroundImage: `url(${LoginBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'}}
      >
      {/*</Box><Box sx={{ backgroundImage: `url(${LoginBg})`}}>*/}
    
      <Paper elevation={10
      } sx={{ my: { xs: 3, md: 6 }, px: { xs: 5, md: 15 } }}>
        <Box
          sx={{

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        
          }}
        >
          <Link to="/">
          <Box
              component="img"
              src={Logo}
              alt="logo"
              sx={{
                mt: 10,   
                width: "300px",
                flexGrow: 1,
                display: { xs: "flex", md: "flex" },
              }}
            />
            </Link>
          <Typography sx={{fontWeight: "700", marginBottom: 2, mt: 2, color: '#42A5F5'}}component="h1" variant="h5">
            Enter a New Password
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  variant={passwordSuccess ? "filled" : "standard"}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="off"
                  error={!!passwordErrorText}
                  helperText={passwordSuccess ? passwordSuccess : passwordErrorText ? passwordErrorText : 'Keep this extra safe!'}
                  
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  variant={passwordSuccess ? "filled" : "standard"}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="off"
                  error={!!passwordErrorText}
                  helperText={passwordSuccess ? passwordSuccess : passwordErrorText ? passwordErrorText : ''}
                
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 10 }}>
              Reset Password
            </Button>
          </Box>
        </Box>
  
        </Paper>
      </Box>
      </Box>
    
      </div>
  )
  };
