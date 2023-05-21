import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../customHooks/useAuth"
import Logo from "../assets/Logo.svg";
import { Navigate, useNavigate } from "react-router-dom";
export default function ResetPassword() {
const [password, setPassword] = useState("");
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
  const p = validatePassword();
  event.preventDefault();
  // Check if all are valid before submitting to server.
  if (p) {
    const data = new FormData(event.currentTarget);   
    const pw = data.get('password') as string;
    //Create object obeying SignUpProp Interface.

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
      height={'100vh'}
      display={'flex'}
      alignItems={'center'}
    
    >
      
    
    <Container component="main"  maxWidth="sm" sx={{background: 'transparent'}}>
    <Paper elevation={4
    } sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, border:4,borderColor: '#42A5F5' }}>
      <Box
        sx={{

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
              mt: 10,   
              width: "300px",
              flexGrow: 1,
              display: { xs: "flex", md: "flex" },
            }}
          ></Box>
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
                value={password}
                error={!!passwordErrorText}
                helperText={passwordSuccess ? passwordSuccess : passwordErrorText ? passwordErrorText : 'Keep this extra safe!'}
                onChange={e => setPassword(e.target.value)}
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
    </Container>
    </Box>
  
    </div>
)
};
