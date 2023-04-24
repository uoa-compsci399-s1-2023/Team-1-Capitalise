import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "@fontsource/inter"; // Don't use this. Will remove later.

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
  <React.StrictMode>
      <App />
  </React.StrictMode>
  </>
);
