import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Typography from "@mui/material/Typography/Typography";
import Box from "@mui/material/Box/Box";
import { Theme } from "@mui/system/createTheme/createTheme";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { FLEX_COLUMN } from "../styles";

type LoadingDisplayProps = {
  text?: string;
  showText?: boolean;
  secondaryText?: string;
};

const LoadingDisplay: React.FC<LoadingDisplayProps> = ({
  text,
  secondaryText,
  showText = true,
}) => {
  const sx: SxProps<Theme> = {
    ...FLEX_COLUMN,
  };

  return (
    <Box sx={sx}>
      {showText && (
        <>
          <Typography
            variant="h3"
            color="primary"
            align="center"
            sx={{ mb: 4 }}
          >
            {text || "Please Wait..."}
          </Typography>

          {!!secondaryText && (
            <Typography
              variant="h6"
              color="primary"
              align="center"
              sx={{ mb: 4 }}
            >
              {secondaryText}
            </Typography>
          )}
        </>
      )}
      <CircularProgress size={96} color="primary" />
    </Box>
  );
};

export default LoadingDisplay;
