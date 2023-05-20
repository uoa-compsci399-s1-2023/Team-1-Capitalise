import { Grid, Paper, Box, Typography, TextField, Button, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../customHooks/useAuth";
import validator from "validator";
import Logo from "../../assets/Logo.svg";
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
     console.log(emailSuccessText);
   } 
   if (auth.success) {
     setEmailSuccessText(auth.success);
     console.log(emailSuccessText + email);
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

     <Grid container component="main" sx={{ height: '100vh' }}>
       <Grid
         item
         xs={false}
         sm={4}
         md={7}
         sx={{
            //backgroundImage: `url(${LoginBg})`,
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
           <Box sx={{mb: 3, mt: "11vh"}}>
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
           </Box>
           <Typography component="h1" variant="h5" sx={{fontWeight: 500}}>
             Reset Password
           </Typography>
           <Box component="form" noValidate onSubmit={handleSubmit} >
             <TextField
               margin="normal"
               required
               fullWidth
               id="email"
               label="Email Address"
               name="email"
               autoComplete="off"
               color={emailSuccessText ? 'success' : 'primary'}
               variant={emailSuccessText ? "filled" : 'standard'}
               autoFocus
               value={email}
               error={!!emailErrorText}
               helperText= {emailSuccessText ? emailSuccessText : emailErrorText ? emailErrorText : ''}
               onChange={e => setEmail(e.target.value)}
             />
      
             <Button
               type="submit"
               fullWidth
               variant="contained"
               sx={{ mt: 3, mb: 2 }}
             >
               Reset Password
             </Button>
             
           </Box>
         </Box>
       </Grid>
     </Grid>

 );
}
