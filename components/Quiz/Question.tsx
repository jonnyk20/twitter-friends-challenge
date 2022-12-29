import Box from "@mui/material/Box/Box";
import Stack from "@mui/material/Stack/Stack";
import Typography from "@mui/material/Typography/Typography";
import { SxProps } from "@mui/system/styleFunctionSx/styleFunctionSx";
import { Theme } from "@mui/system/createTheme/createTheme";
import { AnswerType, QuestionType, TextItemType } from "../../types";
import { addAnswer, addToScore, stopTimer } from "../../redux/quizSlice";
import {
  selectCurrentQuestionAnswer,
  selectCurrentQuestionTentativeAnswer,
  selectIsAnswered,
  selectRemainingTimePortion,
} from "../../redux/selectors";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { FLEX_COLUMN } from "../../styles";
import useLogQuizEvent from "../../hooks/useLogEvent";
import { PER_ANSWER_SCORE } from "../../constants";
import { createAnswer } from "../../utils";
import QuestionChoice from "./QuestionChoice";

type QuestionProps = {
  question: QuestionType;
};

const Question: React.FC<QuestionProps> = ({ question }) => {
  const sx: SxProps<Theme> = {
    width: "100%",
    ...FLEX_COLUMN,
  };
  const currentQuestionAnswer = useAppSelector(
    selectCurrentQuestionAnswer
  ) as AnswerType | null;
  const currentQuestionTentativeAnswer = useAppSelector(
    selectCurrentQuestionTentativeAnswer
  ) as AnswerType | null;
  const isQuestionAnswered = useAppSelector(selectIsAnswered);

  const dispatch = useAppDispatch();
  const logQuizEvent = useLogQuizEvent();

  const { choices, correctChoiceId, id, prompt } = question;

  const answeredChoiceId = currentQuestionAnswer?.choiceId || "";
  const selectedChoiceId = currentQuestionTentativeAnswer?.choiceId || "";
  const remainingTimePortion = useAppSelector(selectRemainingTimePortion);
  const isAnswered = useAppSelector(selectIsAnswered);

  const handleClick = (selectedChoiceId: string) => {
    if (isAnswered) return;

    dispatch(stopTimer());

    const isCorrect = selectedChoiceId === correctChoiceId;

    const baseScore = isCorrect ? PER_ANSWER_SCORE : 0;
    const timeBonus = isCorrect
      ? Math.ceil(PER_ANSWER_SCORE * remainingTimePortion)
      : 0;
    const scoreToAdd = baseScore + timeBonus;

    dispatch(
      addAnswer(
        createAnswer({
          choiceId: selectedChoiceId,
          isCorrect,
          questionId: id,
          isRevealed: false,
        })
      )
    );
    dispatch(addToScore(scoreToAdd));
    logQuizEvent("selectAnswer", { selectedChoiceId });
  };

  return (
    <Box sx={sx}>
      <Typography
        variant="h5"
        component="h2"
        color="primary"
        align="center"
        sx={{ mb: 2, mt: 2 }}
      >
        {prompt.text}
      </Typography>
      <Stack spacing={1} sx={{ width: "100%" }}>
        {choices.map((choice: TextItemType) => {
          const { id, text } = choice;

          let shouldShowAsCorrect = false;
          let shouldShowAsIncorrect = false;

          const isAnswered = id === answeredChoiceId;
          const isCorrect = id === correctChoiceId;
          const isIncorrect = !isCorrect;

          const isAnsweredIncorrectly = isAnswered && isIncorrect;

          const shouldShowAsSelected = id === selectedChoiceId;

          if (isQuestionAnswered && isCorrect) {
            shouldShowAsCorrect = true;
          }

          if (isAnsweredIncorrectly) {
            shouldShowAsIncorrect = true;
          }

          return (
            <QuestionChoice
              key={id}
              id={id}
              text={text}
              shouldShowAsSelected={shouldShowAsSelected}
              shouldShowAsIncorrect={shouldShowAsIncorrect}
              shouldShowAsCorrect={shouldShowAsCorrect}
              onClick={handleClick}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default Question;
