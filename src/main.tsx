import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import About from "./routes/About";
import "./index.css";
import "@fontsource/inter";
import { ThemeProvider } from "./mui";

import Projects from "./routes/Projects";
import customTheme1 from "./themes/custom1"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={customTheme1}>
      <RouterProvider router={router} />{" "}
    </ThemeProvider>
  </React.StrictMode>
);
