import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
<<<<<<< HEAD
import Home from "./routes/Home";
import About from "./routes/About";
import "@fontsource/inter";
import Projects from "./routes/Projects";
=======
import "./index.css";
import "@fontsource/inter"; // Don't use this. Will remove later.
import { ThemeProvider } from "./mui";
import { Home, Projects, About } from "./routes"
import customTheme1 from "./themes/custom1"

>>>>>>> aaf597bfdc04a9becd1bd2c1970f66f0d41ff1d6
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
