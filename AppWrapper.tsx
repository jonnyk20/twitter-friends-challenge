import { ReactNode } from "react";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { Provider } from "react-redux";
import { muiTheme } from "./styles";
import { store } from "./redux/store";

type AppWrapperProps = {
  children: ReactNode;
};

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </Provider>
  );
};

export default AppWrapper;
