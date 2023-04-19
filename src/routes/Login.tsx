import { Box } from "@mui/material";
import LoginForm from "../components/LoginForm";
import { useEffect } from "react";
import { useAuth } from "../customHooks/useAuth";
import { useNavigate, Link, Navigate } from "react-router-dom";


export default function Login() {
    const nav = useNavigate();
    const auth = useAuth();
    if (auth.user != null) {
        nav("/home");
    } else {
    return (<Box> 
        <LoginForm />
    </Box>
    );
};
};
