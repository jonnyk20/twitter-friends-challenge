import Box from "@mui/material/Box/Box";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";

import { useAppSelector } from "../../redux/store";
import { selectRemainingTimePortion } from "../../redux/selectors";

type QuizTimerDisplayProps = {};

const QuizTimerDisplay: React.FC<QuizTimerDisplayProps> = () => {
  const sx: SxProps<Theme> = {
    display: "flex",
    alignItems: "center",
    width: "100%",
  };

  const remainingTimePortion = useAppSelector(selectRemainingTimePortion);

  return (
    <Box sx={sx}>
      <LinearProgress
        sx={{
          height: 16,
          borderRadius: 2,
          width: "100%",
          mr: 1,
        }}
        color="primary"
        value={remainingTimePortion * 100}
        variant="determinate"
      />
      <QueryBuilderIcon fontSize="small" color="primary" />
    </Box>
  );
};

export default QuizTimerDisplay;
