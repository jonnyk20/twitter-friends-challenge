import { logEvent } from "../analytics";
import {
  selectAnswerCount,
  selectCorrectAnswersCount,
  selectCurrentQuestion,
  selectCurrentQuestionIndex,
  selectIncorrectAnswersCount,
  selectMutuals,
  selectQuestions,
  selectQuizInput,
  selectSelectedMutuals,
  selectUserHandle,
} from "../redux/selectors";
import { useAppSelector } from "../redux/store";

const useLogQuizEvent = () => {
  const currentQuestionIndex = useAppSelector(selectCurrentQuestionIndex);
  const quizCreationInput = useAppSelector(selectQuizInput);
  const currentQuestion = useAppSelector(selectCurrentQuestion);
  const answersCount = useAppSelector(selectAnswerCount);
  const correctAnswersCount = useAppSelector(selectCorrectAnswersCount);
  const incorrectAnswersCount = useAppSelector(selectIncorrectAnswersCount);
  const userName = useAppSelector(selectUserHandle);
  const selectedMutuals = useAppSelector(selectSelectedMutuals);
  const mutuals = useAppSelector(selectMutuals);
  const questions = useAppSelector(selectQuestions);

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
      currentQuestion,
      answersCount,
      correctAnswersCount,
      incorrectAnswersCount,
      userName,
      selectedMutuals,
      mutuals,
      questions,
    });
  };

  return logQuizEvent;
};

export default useLogQuizEvent;
