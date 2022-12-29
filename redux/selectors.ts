import { createSelector } from "@reduxjs/toolkit";
import {
  AnswerType,
  QuestionType,
  QuizInputType,
  QuizType,
  RequestStatusType,
  ScoreRecordInputType,
  ScoreRecordType,
  TwitterUserType,
} from "../types";
import {
  cloneWithRandomIds,
  getUniqueByUsername,
  getUserRank,
  sortByScore,
} from "../utils";
import { RootState } from "./store";

export const selectError = (state: RootState): string =>
  state.quiz.errorMessage;

export const selectHasError = (state: RootState): boolean =>
  !!state.quiz.errorMessage;

export const selectUserHandle = (state: RootState): string =>
  state.quiz.userHandle;

export const selectUserProfileImageUrl = (state: RootState): string =>
  state.quiz.userProfileImageUrl;

export const selectMutualsSearchStatus = (
  state: RootState
): RequestStatusType => state.quiz.mutualsSearchStatus;

export const selectIsMutualsSearchNotStarted = createSelector(
  selectMutualsSearchStatus,
  (mutualsSearchStatus): boolean => mutualsSearchStatus === "not-started"
);

export const selectIsMutualsSearchPending = createSelector(
  selectMutualsSearchStatus,
  (mutualsSearchStatus): boolean => mutualsSearchStatus === "pending"
);

export const selectQuizGenerationStatus = (
  state: RootState
): RequestStatusType => state.quiz.quizGenerationStatus;

export const selectIsQuizGenerationPending = createSelector(
  selectQuizGenerationStatus,
  (quizGenerationStatus): boolean => quizGenerationStatus === "pending"
);

export const selectIsQuizGenerationSuccessful = createSelector(
  selectQuizGenerationStatus,
  (quizGenerationStatus): boolean => quizGenerationStatus === "successful"
);

export const selectMutuals = (state: RootState): TwitterUserType[] =>
  state.quiz.mutuals;

export const selectSelectedMutualIds = (state: RootState): number[] =>
  state.quiz.selectedMutualIds;

export const selectSelectedMutuals = createSelector(
  selectMutuals,
  selectSelectedMutualIds,
  (mutuals, selectedMutualsIds): TwitterUserType[] =>
    mutuals.filter((user) => selectedMutualsIds.includes(user.id))
);

export const selectHasMutualsFound = (state: RootState): boolean =>
  !!state.quiz.mutuals.length;

export const selectHasMutualsSelected = (state: RootState): boolean =>
  !!state.quiz.selectedMutualIds.length;

// Quiz
export const selectQuizId = (state: RootState): string => state.quiz.id;

export const selectQuestions = (state: RootState): QuestionType[] =>
  state.quiz.questions;

export const selectQuestionsCount = (state: RootState): number =>
  state.quiz.questions.length;

export const selectGeneratedQuestionsCount = (state: RootState): number =>
  state.quiz.questions.length;

export const selectAnswers = (state: RootState): AnswerType[] =>
  state.quiz.answers;

export const selectAnswerCount = (state: RootState): number =>
  state.quiz.answers.length;

export const selectRevealedAnswersCount = (state: RootState): number =>
  state.quiz.answers.filter((answer) => answer.isRevealed).length;

export const selectCorrectAnswersCount = (state: RootState): number =>
  state.quiz.answers.filter((answer) => answer.isCorrect).length;

export const selectCorrectlyAnsweredQuestionsCount = createSelector(
  selectCorrectAnswersCount,
  selectRevealedAnswersCount,
  (correctAnswersCount, revealedAnswersCount): number =>
    correctAnswersCount - revealedAnswersCount
);

export const selectIncorrectAnswersCount = (state: RootState): number =>
  state.quiz.answers.filter((answer) => !answer.isCorrect).length;

export const selectTentativeAnswers = (state: RootState): AnswerType[] =>
  state.quiz.tentativeAnswers;

export const selectCurrentQuestionIndex = (state: RootState): number =>
  state.quiz.currentQuestionIndex;

export const selectIsQuizStarted = (state: RootState): boolean =>
  state.quiz.isStarted;

export const selectCurrentQuestion = createSelector(
  selectQuestions,
  selectCurrentQuestionIndex,
  (questions, currentQuestionIndex): QuestionType | null =>
    questions[currentQuestionIndex] || null
);

export const selectCurrentQuestionId = createSelector(
  selectCurrentQuestion,
  (currentQuestion): string => currentQuestion?.id || ""
);

export const selectHasNextQuestion = createSelector(
  selectQuestions,
  selectCurrentQuestionIndex,
  (questions, currentQuestionIndex): boolean =>
    !!questions[currentQuestionIndex] && !!questions[currentQuestionIndex + 1]
);

export const selectHasPreviousQuestion = createSelector(
  selectQuestions,
  selectCurrentQuestionIndex,
  (questions, currentQuestionIndex): boolean =>
    !!questions[currentQuestionIndex] && !!questions[currentQuestionIndex - 1]
);

export const selectCompletedQuestions = createSelector(
  selectQuestions,
  selectCurrentQuestionIndex,
  (questions, currentQuestionIndex): QuestionType[] =>
    questions.slice(0, currentQuestionIndex)
);

export const selectIsQuizFinished = (state: RootState): boolean =>
  state.quiz.isFinished;

export const selectCurrentQuestionAnswer = createSelector(
  selectCurrentQuestion,
  selectAnswers,
  (currentQuestion, answers): AnswerType | null =>
    answers.find((a) => a.questionId === currentQuestion?.id) || null
);

export const selectIsAnswered = createSelector(
  selectCurrentQuestionAnswer,
  (currentQuestionAnswer): boolean => !!currentQuestionAnswer
);

export const selectIsAnsweredCorrectly = createSelector(
  selectCurrentQuestionAnswer,
  (currentQuestionAnswer): boolean =>
    !!currentQuestionAnswer && currentQuestionAnswer.isCorrect
);

export const selectIsAnsweredInCorrectly = createSelector(
  selectCurrentQuestionAnswer,
  (currentQuestionAnswer): boolean =>
    !!currentQuestionAnswer && !currentQuestionAnswer.isCorrect
);

export const selectCurrentQuestionTentativeAnswer = createSelector(
  selectCurrentQuestion,
  selectTentativeAnswers,
  (currentQuestion, tentativeAnswer): AnswerType | null =>
    tentativeAnswer.find((a) => a.questionId === currentQuestion?.id) || null
);

export const selectIsTentativelyAnswered = createSelector(
  selectCurrentQuestionTentativeAnswer,
  (currentQuestionTentativeAnswer): boolean => !!currentQuestionTentativeAnswer
);

export const selectTimerExpireTime = (state: RootState): number | null =>
  state.quiz.timerExpireTime;

export const selectTimerRemainingTime = (state: RootState): number =>
  typeof state.quiz.timerExpireTime === "number"
    ? state.quiz.timerExpireTime - state.quiz.currentTime
    : 0;

export const selectScore = (state: RootState): number => state.quiz.score;

export const selectTimerDuration = (state: RootState): number =>
  state.quiz.timerDuration;

export const selectTimerStatus = (state: RootState): "running" | "stopped" =>
  state.quiz.timerStatus;

export const selectRemainingTimePortion = createSelector(
  selectTimerRemainingTime,
  selectTimerDuration,
  (remainingTime, maxTime): number => remainingTime / (maxTime || 1)
);

export const selectQuizProgress = createSelector(
  selectIsQuizFinished,
  selectCurrentQuestionIndex,
  selectQuestionsCount,
  (isQuizFinished, currentQuestionIndex, questionCount): number => {
    if (isQuizFinished) return 1;

    return currentQuestionIndex / (questionCount || 1);
  }
);

export const selectAreAllQuestionsAnswered = createSelector(
  selectAnswerCount,
  selectQuestionsCount,
  (answersCount, questionsCount): boolean => answersCount >= questionsCount
);

export const selectQuizMutuals = (state: RootState): string[] =>
  state.quiz.quizMutuals;

export const selectQuiz = createSelector(
  selectQuizId,
  selectQuestions,
  selectUserHandle,
  selectQuizMutuals,
  selectUserProfileImageUrl,
  (
    quizId,
    questions,
    userHandle,
    quizMutuals,
    userProfileImageUrl
  ): QuizType => ({
    id: quizId,
    questions,
    userHandle,
    quizMutuals,
    userProfileImageUrl,
  })
);

export const selectQuizInput = createSelector(
  selectUserHandle,
  selectSelectedMutuals,
  (userHandle: string, selectedMutuals: TwitterUserType[]): QuizInputType => ({
    userHandle,
    selectedMutuals,
  })
);

// Leaderboard
export const selectScoreRecords = (state: RootState): ScoreRecordType[] =>
  sortByScore(getUniqueByUsername(state.quiz.scoreRecords)).concat([
    ...cloneWithRandomIds(state.quiz.scoreRecords),
    ...cloneWithRandomIds(state.quiz.scoreRecords),
    ...cloneWithRandomIds(state.quiz.scoreRecords),
    ...cloneWithRandomIds(state.quiz.scoreRecords),
    ...cloneWithRandomIds(state.quiz.scoreRecords),
  ]);

export const selectScoreRecordInput = createSelector(
  selectUserHandle,
  selectScore,
  selectQuizMutuals,
  selectQuizId,
  selectUserProfileImageUrl,
  (
    username: string,
    score: number,
    quizMutuals: string[],
    quizId: string,
    userProfileImageUrl: string
  ): Omit<ScoreRecordInputType, "key"> => ({
    username,
    score,
    quizMutuals,
    quizId,
    userProfileImageUrl,
  })
);

export const selectUserRank = createSelector(
  selectUserHandle,
  selectScoreRecords,
  (userHandle: string, scoreRecords: ScoreRecordType[]): number =>
    getUserRank(userHandle, scoreRecords)
);
