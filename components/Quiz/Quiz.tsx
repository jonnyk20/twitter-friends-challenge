import Box from "@mui/material/Box/Box";

import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";

import QuizStart from "./QuizStart";
import {
  selectIsQuizStarted,
  selectCurrentQuestion,
  selectIsQuizFinished,
} from "../../redux/selectors";
import { useAppSelector } from "../../redux/store";
import QuizCompleteDisplay from "./QuizCompleteDisplay";
import QuizProgressDisplay from "./QuizProgressDisplay";
import QuizTimerDisplay from "./QuizTimerDisplay";
import QuestionWrapper from "./QuestionWrapper";

type QuizProps = {};

const Quiz: React.FC<QuizProps> = () => {
  const sx: SxProps<Theme> = {
    width: "100%",
    maxWidth: 800,
  };

  const headerSx: SxProps<Theme> = {
    // p: 1,
  };

  const isQuizStarted = useAppSelector(selectIsQuizStarted);
  const currentQuestion = useAppSelector(selectCurrentQuestion);

  const isQuizFinished = useAppSelector(selectIsQuizFinished);

  if (!isQuizStarted)
    return (
      <Box sx={sx}>
        <QuizStart />
      </Box>
    );

  if (!currentQuestion)
    return (
      <Box sx={sx}>
        <Typography>No questions Found</Typography>
      </Box>
    );

  return (
    <Box sx={sx}>
      {!isQuizFinished && (
        <Box sx={headerSx}>
          <QuizProgressDisplay />
          <QuizTimerDisplay />
        </Box>
      )}
      {!isQuizFinished && <QuestionWrapper question={currentQuestion} />}
      {isQuizFinished && <QuizCompleteDisplay />}
    </Box>
  );
};

export default Quiz;
