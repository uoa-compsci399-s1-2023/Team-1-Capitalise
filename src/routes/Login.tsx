import { Box } from "@mui/material";
import LoginForm from "../components/LoginForm";
import { useEffect } from "react";
import { useAuth } from "../customHooks/useAuth";
import { useNavigate, Link, Navigate } from "react-router-dom";


export default function Login() {
    const nav = useNavigate();
    const auth = useAuth();
    // if (auth.user != null) {
    //     nav("/home");
    //     return <></>
    // } else {

    // Yathi 25/04 - Put it in useEffect to stop BrowserRouter error
    useEffect(() => {
        if (auth.user) {
          nav("/")
        }
      })

    return (
    <Box mt={'-8vh'}> // Yathi 25/04 - Added negative margin as there is no header.
        <LoginForm />
    </Box>
    );
// };
};
