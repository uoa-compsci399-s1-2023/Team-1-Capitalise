import { Box } from "@mui/material";
import LoginForm from "../components/LoginForm";
import SignUp from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../customHooks/useAuth";
const Registration = () => {
    const nav = useNavigate();
    const auth = useAuth();
    if (auth.getToken() != null) {
        nav("/home");
    } else {
    return (<Box> 
        <SignUp/>
    </Box>
    )
};
}
export default Registration;