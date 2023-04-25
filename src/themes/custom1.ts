import { createTheme, responsiveFontSizes, Palette, PaletteColorOptions } from "@mui/material/styles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Any new theme variables have to be declared in the interfaces below first!
interface CustomThemeStyles {
  customColors: {
    bgGrey?: string;
    DividerGrey?: string;
    excellenceAward?: string;
    communityImpact?: string;
    peoplesChoice?: string;
    likes?: string;
  };
  contentBlock?: {
    border?: string;
    borderRadius?: string;
  }
  projStatus?: {
    pending?: string
    approved?: string
  }
}

declare module "@mui/material/styles" {
  interface Theme extends CustomThemeStyles {

  }

  interface ThemeOptions extends CustomThemeStyles {

  }

  interface CustomPalette {
    neutral: PaletteColorOptions;
    black: PaletteColorOptions;
    editBtnGrey: PaletteColorOptions;
    githubBtn: PaletteColorOptions;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}

}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true
    black: true
    editBtnGrey: true
    githubBtn: true
  }
}

let theme = createTheme({
    palette: {
      neutral: {
        main: '#898989'
      },
      black: {
        main: '#000000',
        light: '#0',
        dark: '#0',
        contrastText: '#0'
      },
      editBtnGrey: {
        main: '#b7b7b7',
      },
      githubBtn: {
        main: '#6e5494'
      }
    },
    typography: {
      button: {
        fontWeight: 400,
        textTransform: 'none'
      },
      h1: {
        fontSize: 36,
        fontWeight: 300
      }
    },
    customColors: {
      bgGrey: '#f9f9f9',
      DividerGrey: '#f7f7f7',
      excellenceAward: '#FFB300',
      communityImpact: '#00E676',
      peoplesChoice: '#F44336',
      likes: "#FF3D00",
    },
    contentBlock: {
      border: "3px solid transparent",
      borderRadius: '10px',
    },
    projStatus: {
      pending: '#ffc107',
      approved: '#8bc34a'
    }
  })

theme = responsiveFontSizes(theme);
export default theme;
