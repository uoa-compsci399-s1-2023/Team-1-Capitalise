import { Container, Box, Typography, Button } from "@mui/material";
import { useAuth } from "../customHooks/useAuth";

export default function Upload() {
    const auth = useAuth();
    auth.onlyAuthenticated()
    return (
        //Only logged in users!
        
        <Container maxWidth="md">
            <Box py={8} textAlign="center">
            <Typography variant="overline" component="span">Welcome new Opportunities</Typography>
            <Typography variant="h3" component="h2">Upload</Typography>
            <Box mt={4}>
                <Button color="primary" >Read more</Button>
            </Box>
            </Box>
        </Container>


    )

}