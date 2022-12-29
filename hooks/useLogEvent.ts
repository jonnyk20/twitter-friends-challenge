import { logEvent } from "../analytics";
import {
  selectAnswerCount,
  selectCorrectAnswersCount,
  selectCurrentQuestion,
  selectCurrentQuestionIndex,
  selectIncorrectAnswersCount,
  selectQuizInput,
} from "../redux/selectors";
import { useAppSelector } from "../redux/store";

const useLogQuizEvent = () => {
  const currentQuestionIndex = useAppSelector(selectCurrentQuestionIndex);
  const quizCreationInput = useAppSelector(selectQuizInput);
  const currentQuestion = useAppSelector(selectCurrentQuestion);
  const answersCount = useAppSelector(selectAnswerCount);
  const correctAnswersCount = useAppSelector(selectCorrectAnswersCount);
  const incorrectAnswersCount = useAppSelector(selectIncorrectAnswersCount);

  const logQuizEvent = (
    name: string,
    params: {
      [key: string]: any;
    } = {}
  ) => {
    logEvent(name, {
      ...params,
      currentQuestionIndex,
      quizCreationInput,
      currentQuestion: JSON.stringify(currentQuestion),
      answersCount,
      correctAnswersCount,
      incorrectAnswersCount,
    });
  };

  return logQuizEvent;
};

export default useLogQuizEvent;
