import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";

const useIsMediumScreen = () => {
  const theme = useTheme();
  const useIsMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  return useIsMediumScreen;
};

export default useIsMediumScreen;
