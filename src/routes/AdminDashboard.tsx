import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { getUser } from "../api/getUser";
import { TUser } from "../model/TUser";
import { TProject } from "../model/TProject";
import { useEffect, useState } from "react";
import MyTabs from "../components/MyTabs";
import ProjectCard from "../components/projects/ProjectCard";
import { getProject } from "../api/getProject";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import MyButton from "../components/MyButton";
import { error } from "console";

const AdminDashboard = () => {
    // need to connect up all the admin functionality we want here
    // useEffect() can be used to load in all the stuff we might want to display.

    return (
        <Box display={{ xs: "flex", md: "block" }} width="100%" >
            <Box paddingTop={5} paddingLeft={25} width={{ xs: "25%", md: "80%" }} sx={{ aspectRatio: "1 / 1", objectFit: "cover", backgroundColor: 'primary.dark' }}>
                <Typography variant="h1">ADMIN DASHBOARD</Typography>
                <Divider />
                <Stack paddingTop={2}>
                    <Typography variant="h6">Welcome Admin</Typography>
                </Stack>
                <Stack paddingTop={1}>
                    <Typography variant="h6">Here you will be able to carry out admin functions</Typography>
                </Stack>
                <Stack paddingTop={5}>
                    <Box sx={{
                    width: 1000,
                    height: 500,
                    backgroundColor: 'white',
                    }}>
                    </Box>
                    
                </Stack>
                <Box sx={{
                    width: 200,
                    height: 200,
                    backgroundColor: 'red',
                    }}>
                    </Box>
                    <Box sx={{
                    width: 200,
                    height: 200,
                    backgroundColor: 'green',
                    }}>
                    </Box>
            </Box>
        </Box>
    );
};

export default AdminDashboard;