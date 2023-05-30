import { Grid, Paper, Box, Typography, TextField, Button, Divider, ThemeProvider, Alert, AlertTitle } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../customHooks/useAuth";
import validator from "validator";
import Logo from "../../assets/Logo.svg";
import LoginBg from "../../assets/loginbg.svg";


export default function ResetPasswordForm() { 
 // Auth Provider - important for calling sign in api
 const auth = useAuth();

 // States for Validation Check
 const [email, setEmail] = useState("");
 const [emailErrorText, setEmailErrorText] = useState("");
 const [emailSuccessText, setEmailSuccessText] = useState("");
 // Validation Checks 
 useEffect(() => {
   if (auth.error === 'No account is associated with this email address.') {
     setEmailErrorText('No account is associated with this email address.');
     auth.error = ''
   } else if (auth.success) {
     setEmailSuccessText(auth.success)
     auth.success = ''
     
   }
 }, [auth.error, auth.success, email])

 const validateEmail = () => {
   if (!email) {
     setEmailErrorText("Please enter an email.");
    
   } else if (!validator.isEmail(email)) {
     setEmailErrorText("Enter an email in the format of example@aucklanduni.ac.nz or example@gmail.com");
    
   } else {
     setEmailErrorText("");
     return true;
     
   }
 }

 // Submit Function
 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
   event.preventDefault();
   const e = validateEmail();
   if (e) {
     const data = new FormData(event.currentTarget);
     const logEmail = data.get('email') as string;
     const sendEmail = {'email': logEmail};
     // Pass Email and PW onto Auth Provider -> Sign In API
     auth.resetPassword(sendEmail);
    
     
     }
   }
 
 return (
     <Grid container component="main" sx={{ height: '100vh'}}>
       <Grid
         item
         xs={false}
         sm={4}
         md={7}
         sx={{
           backgroundImage: `url(${LoginBg})`,
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
          
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center'
            }}
            >
          <Link to="/">
          <Box
            component="img"
            src={Logo}
            alt="logo"
            sx={{
              height: 'auto',
              width: "300px",
              flexGrow: 1,
              display: { xs: "flex", md: "flex" },
            }}
          ></Box></Link>
           <Typography component="h1" variant="h5" sx={{fontWeight: 500, mb: 5, mt: 5, color: '#42A5F5'}}>
             Reset Password
           </Typography>
           <Box component="form" noValidate onSubmit={handleSubmit} sx={{mx: 10}} >
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
               helperText= {'Do not forget your email either!'}
               onChange={e => setEmail(e.target.value)}
             />
      
             <Button
               type="submit"
               fullWidth
               disabled={emailSuccessText ? true: false}
               variant="contained"
               sx={{ mt: 3, mb: 2 }}
             >
               Reset Password
             </Button>
              {emailSuccessText && <Alert severity="success">
            <AlertTitle>Successful!</AlertTitle>
            {emailSuccessText} 
            </Alert>}
            
            {emailErrorText && <Alert severity="error">
            <AlertTitle>Unsuccessful</AlertTitle>
            {emailErrorText} 
            </Alert>}
           </Box>
         </Box>
       </Grid>
     </Grid>

 );
}
