import { Box, Grid, Typography } from "@mui/material";
import * as React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import { Navigate, useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";

export default function UploadComplete() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#1976D2");
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      navigate("/");
      setLoading(false);

    },3000)
  }, [])
  return (
   
    <Grid container direction="column" display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="50vh">
    <Grid item >
        <BounceLoader
        color={color}
        loading={loading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader" />
    </Grid>
    <Grid item >
        <Typography fontWeight={500} color={"#1976D2"} sx={{ mt: 6 }}>
        Uploading your project!</Typography>
    </Grid>
    </Grid>


  );



}
