import { Box, Grid, Typography } from "@mui/material";
import * as React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import { useAuth } from "../customHooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";

export default function GoogleSuccessRedirect() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#22d55f");
  useEffect(() => {
    setLoading(true);
    auth.googleAuth();
    setTimeout(() => {
      navigate("/");
      setLoading(false);
    }, 6000);
  }, []);
  return (
    <>
      <Grid
        container
        direction="column"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ height: "100vh" }}
      >
        <Grid item>
          <HashLoader
            color={color}
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Grid>
        <Grid item>
          <Typography fontWeight={500} color={"#22d55f"} sx={{ mt: 6 }}>
            Successfully linked with Google! Redirecting back to Homepage...
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
