import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";


// Any new theme variables have to be declared in the interfaces below first!
declare module "@mui/material/styles" {
  interface Theme {
    customColors: {
      bgGrey: string;
      netural: string;
    };
    contentBlock: {
      border: string;
      borderRadius: string;
    }
    projStatus: {
      pending: string
      approved: string
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    customColors?: {
      bgGrey?: string
      neutral?: string
    }
    contentBlock?: {
      border?: string;
      borderRadius?: string;
    }
    projStatus?: {
      pending?: string
      approved?: string
    }
  }

  interface Palette {
    neutral: Palette['primary'];
    black: Palette['primary'];
  }

  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    black: Palette['secondary'];
  }

}



let theme = createTheme({
    palette: {
      neutral: {
        main: '#292929'
      },
      black: {
        main: '#000000',
        light: '#0',
        dark: '#0',
        contrastText: '#0'
      }
    },
    typography: {
      button: {
        fontWeight: 400
      },
      h1: {
        fontSize: 36,
        fontWeight: 300
      }
    },
    customColors: {
      bgGrey: '#f9f9f9',
      // neutral: '#c7c7c7'
    },
    contentBlock: {
      border: "1px solid #f5f5f5",
      borderRadius: '10px'
    },
    projStatus: {
      pending: '#ffc107',
      approved: '#8bc34a'
    }
  })

theme = responsiveFontSizes(theme);
export default theme;