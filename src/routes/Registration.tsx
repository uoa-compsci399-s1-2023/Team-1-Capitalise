import { Box } from "@mui/material";
import LoginForm from "../components/LoginForm";
import SignUp from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../customHooks/useAuth";
export default function Registration() {
    const nav = useNavigate();
    const auth = useAuth();
    if (auth.user != null) {
        nav("/home");
    } else {
        
    return (<Box> 
        <SignUp/>
    </Box>
    )
};
}
