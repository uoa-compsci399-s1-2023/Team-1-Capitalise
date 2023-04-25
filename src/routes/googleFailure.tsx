import { Box, Grid, Typography } from "@mui/material";
import * as React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState} from "react";
import HashLoader from "react-spinners/HashLoader";
import { useNavigate } from "react-router-dom";


export default function GoogleFailure() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [color, setColor] = useState("#ff1507");
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            navigate("/")
        }, 6000)
    },[])
    return (

        <>
        <Grid container direction="column" display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"sx={{ height: '100vh' }}>
            <Grid item >
                
            
                <HashLoader
                    color={color}
                    loading={loading}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader" />
            </Grid>
            <Grid item >
                <Typography fontWeight={500} color={"#ff1507"} sx={{mt: 6 }}>Unable to link with Google account. Redirecting back to Homepage...</Typography>
            </Grid>
        </Grid>
       </>

    );

    

}
