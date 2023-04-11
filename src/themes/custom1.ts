import { createTheme } from "@mui/material/styles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";


// Any new theme variables have to be declared in the interfaces below first!
declare module "@mui/material/styles" {
  interface Theme {
    customColors: {
      bgGrey: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    customColors?: {
      bgGrey?: string;
    };
  }
}

export default createTheme({
  customColors: {
    bgGrey: "#f9f9f9",
  },
  
});
