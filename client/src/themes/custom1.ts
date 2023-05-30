import {
  createTheme,
  responsiveFontSizes,
  Palette,
  PaletteColorOptions,
  SimplePaletteColorOptions,
} from "@mui/material/styles";
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
  };
  projStatus?: {
    pending?: string;
    approved?: string;
  };
}

declare module "@mui/material/styles" {
  interface Theme extends CustomThemeStyles {}

  interface ThemeOptions extends CustomThemeStyles {}

  interface CustomPalette {
    primary: SimplePaletteColorOptions;
    primaryDark: PaletteColorOptions;
    neutral: SimplePaletteColorOptions;
    black: PaletteColorOptions;
    whiteButton: PaletteColorOptions;
    editBtnGrey: SimplePaletteColorOptions;
    githubBtn: PaletteColorOptions;
    kaggleBtn: PaletteColorOptions;
    linkedinBtn: PaletteColorOptions;
    spinnerColor: SimplePaletteColorOptions;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    primary: true;
    primaryDark: true;
    neutral: true;
    black: true;
    whiteButton: true;
    editBtnGrey: true;
    githubBtn: true;
    kaggleBtn: true;
    linkedinBtn: true;
    spinnerColor: true;
  }
}

declare module "@mui/material/CircularProgress" {
  interface CircularProgressPropsColorOverrides {
    spinnerColor: true
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    neutral: true
  }
}

let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1220,
      xl: 1820,
    },
  },
  palette: {
    primary: {
      main: "#3388FF",
    },
    primaryDark: {
      main: "#2260B7",
      contrastText: "#ffffff",
    },
    neutral: {
      main: "#898989",
    },
    black: {
      main: "#000000",
      light: "#0",
      dark: "#0",
      contrastText: "#0",
    },
    whiteButton: {
      main: "#ffffff",
      light: "#ffffff",
      dark: "#ffffff",
    },
    editBtnGrey: {
      main: "#b7b7b7",
    },
    githubBtn: {
      main: "#6e5494",
    },
    linkedinBtn: {
      main: "#007EBB",
    },
    kaggleBtn: {
      main: "#20beff"
    },
    spinnerColor: {
      main: "#f7f7f7"
    }
  },
  typography: {
    button: {
      fontWeight: 400,
      textTransform: "none",
    },
    h1: {
      fontSize: 36,
      fontWeight: 300,
    },
  },
  customColors: {
    bgGrey: "#f9f9f9",
    DividerGrey: "#f7f7f7",
    excellenceAward: "#FFB300",
    communityImpact: "#00E676",
    peoplesChoice: "#F44336",
    likes: "#FF3D00",
  },
  contentBlock: {
    border: "3px solid transparent",
    borderRadius: "10px",
  },
  projStatus: {
    pending: "#ffc107",
    approved: "#8bc34a",
  },
});

theme = responsiveFontSizes(theme);
export default theme;
