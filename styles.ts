import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import green from "@mui/material/colors/green";
import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    success: {
      contrastText: "#fff",
      main: green[500],
    },
    // mode: 'dark',
  },
  typography: {
    fontFamily: [
      "Roboto Condensed",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    // fontSize: 16,
  },
});

export const FLEX_COLUMN: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export const ROUNDED_BLUE_BORDER: SxProps<Theme> = {
  border: "solid 1px",
  borderColor: "primary.main",
  borderRadius: 2,
};
