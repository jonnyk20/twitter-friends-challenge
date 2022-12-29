import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import useLogQuizEvent from "../../hooks/useLogEvent";
import {
  goToNextQuestion,
  startTimer,
  finishQuiz,
  clearTimer,
  submitScoreAsync,
  addScoreRecord,
} from "../../redux/quizSlice";
import {
  selectIsAnswered,
  selectHasNextQuestion,
  selectIsAnsweredCorrectly,
  selectIsAnsweredInCorrectly,
  selectAreAllQuestionsAnswered,
  selectScoreRecordInput,
} from "../../redux/selectors";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { FLEX_COLUMN } from "../../styles";
import {
  QuestionType,
  ScoreRecordInputType,
  ScoreRecordType,
} from "../../types";
import useQuizTimer from "../../hooks/useQuizTimer";
import Question from "./Question";
import { generateId } from "../../utils";

type QuestionWrapperProps = {
  question: QuestionType;
};

const QuestionWrapper: React.FC<QuestionWrapperProps> = ({ question }) => {
  const sx: SxProps<Theme> = {
    width: "100%",
    ...FLEX_COLUMN,
    mt: 3,
  };

  const dispatch = useAppDispatch();
  const isAnswered = useAppSelector(selectIsAnswered);
  const hasNextQuestion = useAppSelector(selectHasNextQuestion);
  const isAnsweredCorrectly = useAppSelector(selectIsAnsweredCorrectly);
  const isAnsweredIncorrectly = useAppSelector(selectIsAnsweredInCorrectly);
  const areAllQuestionsAnswered = useAppSelector(selectAreAllQuestionsAnswered);
  const scoreInput = useAppSelector(selectScoreRecordInput);

  useQuizTimer();
  const logQuizEvent = useLogQuizEvent();

  const onClickNextQuestion = () => {
    dispatch(goToNextQuestion());
    dispatch(startTimer());
    logQuizEvent("nextQuestionClicked");
  };

  const onClickFinish = () => {
    const scoreInputWithKey: ScoreRecordInputType = {
      ...scoreInput,
      key: generateId(),
    };

    dispatch(finishQuiz());
    dispatch(clearTimer());
    dispatch(submitScoreAsync(scoreInputWithKey));

    const tentativeScoreRecord: ScoreRecordType = {
      ...scoreInputWithKey,
      id: generateId(),
    };

    dispatch(addScoreRecord(tentativeScoreRecord));

    logQuizEvent("quizFinished");
  };

  let feedbackText = "";

  if (isAnsweredCorrectly) {
    feedbackText = "Correct!";
  }

  if (isAnsweredIncorrectly) {
    feedbackText = "Nice Try!";
  }

  return (
    <Box sx={sx}>
      <Question question={question} />
      {!!feedbackText && (
        <Typography
          variant="h5"
          color="primary"
          align="center"
          sx={{ mb: 1, mt: 4 }}
        >
          {feedbackText}
        </Typography>
      )}

      {isAnswered && hasNextQuestion && !areAllQuestionsAnswered && (
        <Button onClick={onClickNextQuestion} variant="contained" size="large">
          Next Question
        </Button>
      )}
      {areAllQuestionsAnswered && (
        <Button onClick={onClickFinish} variant="contained" size="large">
          Finish
        </Button>
      )}
    </Box>
  );
};

export default QuestionWrapper;
