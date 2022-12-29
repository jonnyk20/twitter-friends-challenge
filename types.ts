export type RequestStatusType =
  | "not-started"
  | "pending"
  | "successful"
  | "failed";

export type TextItemType = {
  id: string;
  text: string;
};

export type RawQuestionType = {
  username: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
};

export type QuestionType = {
  id: string;
  prompt: TextItemType;
  choices: TextItemType[];
  correctChoiceId: string;
};

export type TwitterUserType = {
  id: number;
  username: string;
  profileImageUrl: string;
};

export type MutualsSearchResponseType = {
  mutuals: TwitterUserType[];
  userProfileImageUrl: string;
  error: string;
};

export type ViewType = "home" | "quiz" | "results";

export type TimerStatusType = "running" | "stopped";

export type AnswerType = {
  isCorrect: boolean;
  isRevealed: boolean;
  questionId: string;
  choiceId: string;
};

export type QuizType = {
  id: string;
  questions: QuestionType[];
  userHandle: string;
  quizMutuals: string[];
  userProfileImageUrl: string;
};

export type QuizResponseType = {
  quiz: QuizType;
  error: string;
};

export type QuizState = QuizType & {
  // Pre-Quiz
  mutuals: TwitterUserType[];
  errorMessage: string;
  mutualsSearchStatus: RequestStatusType;
  quizGenerationStatus: RequestStatusType;
  selectedMutualIds: number[];
  view: ViewType;
  // Quiz
  answers: AnswerType[];
  tentativeAnswers: AnswerType[];
  currentQuestionIndex: number;
  isStarted: boolean;
  isFinished: boolean;
  timerStatus: TimerStatusType;
  currentTime: number;
  timerDuration: number;
  timerStartedTime: number | null;
  timerStoppedTime: number | null;
  timerExpireTime: number | null;
  score: number;
  // Leaderboard
  scoreRecords: ScoreRecordType[];
};

export type QuizInputType = {
  selectedMutuals: TwitterUserType[];
  userHandle: string;
};

export type ScoreRecordType = {
  id: string;
  key: string;
  quizId: string;
  username: string;
  score: number;
  quizMutuals: string[];
  userProfileImageUrl: string;
};

export type SubmitScoreResponseType = {
  scoreRecordId: string;
  error: string;
};

export type ScoreRecordInputType = Omit<ScoreRecordType, "id">;
