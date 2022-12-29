import Box from "@mui/material/Box/Box";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { selectQuizProgress } from "../../redux/selectors";
import { useAppSelector } from "../../redux/store";

type QuizProgressDisplayProps = {};

const QuizProgressDisplay: React.FC<QuizProgressDisplayProps> = () => {
  const sx: SxProps<Theme> = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    mb: 1,
  };
  const progress = useAppSelector(selectQuizProgress);

  return (
    <Box sx={sx}>
      <LinearProgress
        sx={{
          height: 16,
          borderRadius: 2,
          width: "100%",
          mr: 1,
        }}
        color="success"
        value={progress * 100}
        variant="determinate"
      />
      <EmojiEventsIcon fontSize="small" color="success" />
    </Box>
  );
};

export default QuizProgressDisplay;
