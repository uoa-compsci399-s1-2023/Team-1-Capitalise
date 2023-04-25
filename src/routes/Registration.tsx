import { useEffect } from "react";
import { Box } from "@mui/material";
import SignUp from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../customHooks/useAuth";
import { useTheme } from "@emotion/react";

export default function Registration() {
    const nav = useNavigate();
    const auth = useAuth();
    const theme = useTheme();
    // if (auth.user != null) {
    //     nav("/");
    //     return <></>
    // } else {

    // Yathi 25/04 - Put it in useEffect to stop BrowserRouter error
    useEffect(() => {
        if (auth.user) {
            nav("/")
        }
    })

    return (
    <Box mt={'-8vh'}>
        <SignUp />
    </Box>
    )
};

