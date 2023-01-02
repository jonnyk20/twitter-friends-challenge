import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logEvent } from "../analytics";
import { DEFAULT_TIMER_DURATION, MUTUALS_SELECTION_MAX } from "../constants";
import { EMPTY_MUTUALS_SEARCH_RESPONSE } from "../mocks";
import { createScore } from "../services/leaderboardService";
import { getMutualsForUser } from "../services/quizService";
import {
  AnswerType,
  MutualsSearchResponseType,
  QuizState,
  ScoreRecordInputType,
  ScoreRecordType,
  SubmitScoreResponseType,
  TwitterUserType,
} from "../types";
import { returnEmptyStringIfUndefined, updateAnswers } from "../utils";
import { createQuizAsync } from "./thunkActions";

const initialState: QuizState = {
  // Pre-Quiz
  errorMessage: "",
  quizGenerationStatus: "not-started",
  mutualsSearchStatus: "not-started",
  userHandle: "",
  userProfileImageUrl: "",
  mutuals: [],
  selectedMutualIds: [],
  view: "home",
  // Quiz
  id: "",
  questions: [],
  quizMutuals: [],
  answers: [],
  tentativeAnswers: [],
  currentQuestionIndex: 0,
  isStarted: false,
  isFinished: false,
  timerStatus: "stopped",
  currentTime: Date.now(),
  timerDuration: DEFAULT_TIMER_DURATION,
  timerExpireTime: null,
  timerStartedTime: null,
  timerStoppedTime: null,
  score: 0,
  // Leaderboard
  scoreRecords: [],
};

export const searchMutualsAsync = createAsyncThunk<
  MutualsSearchResponseType,
  string,
  {
    rejectValue: MutualsSearchResponseType;
  }
>("quiz/searchMutuals", async (userHandle: string, { rejectWithValue }) => {
  const result = await getMutualsForUser(userHandle);

  if (!result.mutuals?.length) {
    return rejectWithValue({
      ...EMPTY_MUTUALS_SEARCH_RESPONSE,
      error: !result.error ? result.error : EMPTY_MUTUALS_SEARCH_RESPONSE.error,
    });
  }

  return result;
});

export const submitScoreAsync = createAsyncThunk<
  SubmitScoreResponseType,
  ScoreRecordInputType,
  {
    rejectValue: SubmitScoreResponseType;
  }
>(
  "quiz/submitScore",
  async (input: ScoreRecordInputType, { rejectWithValue }) => {
    const result = await createScore(input);

    if (!result.scoreRecordId) {
      return rejectWithValue({
        error: !result.error ? result.error : "Something went wrong",
        scoreRecordId: "",
      });
    }

    return result;
  }
);

const addDataToEvent = (state: QuizState, _: any = {}) => {
  return state;
};

export const quiz = createSlice({
  name: "editor",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    clearErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = "";
    },
    setUserHandle: (state, action: PayloadAction<string>) => {
      state.userHandle = action.payload;
    },
    clearSelectedMutuals: (state) => {
      state.selectedMutualIds = [];
    },
    addToSelectedMutuals: (state, action: PayloadAction<TwitterUserType>) => {
      const userToAdd = action.payload;

      if (
        state.selectedMutualIds.length < MUTUALS_SELECTION_MAX &&
        !state.selectedMutualIds.includes(userToAdd.id)
      ) {
        state.selectedMutualIds = [...state.selectedMutualIds, userToAdd.id];
      }
    },
    removeFromSelectedMutuals: (state, action: PayloadAction<number>) => {
      const userIdToRemove = action.payload;

      state.selectedMutualIds = state.selectedMutualIds.filter(
        (userId) => userId !== userIdToRemove
      );
    },
    // Quiz
    startQuiz: (state) => {
      state.isStarted = true;
    },
    addAnswer: (state, action: PayloadAction<AnswerType>) => {
      state.answers = updateAnswers(state.answers, action.payload);
    },
    setAnswers: (state, action: PayloadAction<AnswerType[]>) => {
      state.answers = action.payload;
    },
    clearAnswers: (state) => {
      state.answers = [];
    },
    addTentativeAnswer: (state, action: PayloadAction<AnswerType>) => {
      state.tentativeAnswers = updateAnswers(
        state.tentativeAnswers,
        action.payload
      );
    },
    setTentativeAnswers: (state, action: PayloadAction<AnswerType[]>) => {
      state.tentativeAnswers = action.payload;
    },
    clearTentativeAnswers: (state) => {
      state.tentativeAnswers = [];
    },
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    goToNextQuestion: (state) => {
      const lastQuestionIndex = state.questions.length - 1;

      if (state.currentQuestionIndex !== lastQuestionIndex) {
        state.currentQuestionIndex = state.currentQuestionIndex + 1;
      }
    },
    goToPreviousQuestion: (state) => {
      const lastQuestionIndex = state.questions.length - 1;
      const nextIndex =
        state.currentQuestionIndex === 0
          ? lastQuestionIndex
          : state.currentQuestionIndex - 1;
      state.currentQuestionIndex = nextIndex;
    },
    addToScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    resetQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.tentativeAnswers = [];
      state.isStarted = false;
      state.isFinished = false;
    },
    finishQuiz: (state) => {
      state.isFinished = true;
    },
    clearTimer: (state) => {
      state.timerStatus = "stopped";
      const currentTime = Date.now();
      state.timerStatus = "running";
      state.currentTime = currentTime;
      state.timerExpireTime = null;
      state.timerStartedTime = null;
      state.timerStoppedTime = null;
    },
    stopTimer: (state) => {
      state.timerStatus = "stopped";
    },
    startTimer: (state) => {
      const currentTime = Date.now();
      state.timerStatus = "running";
      state.currentTime = currentTime;
      state.timerExpireTime = currentTime + state.timerDuration;
      state.timerStartedTime = null;
      state.timerStoppedTime = null;
    },
    tickTimer: (state) => {
      const newCurrentTime = Date.now();

      state.currentTime = newCurrentTime;

      const isTimerFinished = newCurrentTime > (state.timerExpireTime || 0);

      if (isTimerFinished) {
        state.timerStatus = "stopped";
      }
    },
    // Leaderboard
    setScoreRecords: (state, action: PayloadAction<ScoreRecordType[]>) => {
      state.scoreRecords = action.payload;
    },
    addScoreRecord: (state, action: PayloadAction<ScoreRecordType>) => {
      state.scoreRecords = [...state.scoreRecords, action.payload];
    },
    resetTwitterChallengeState: () => initialState,
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(searchMutualsAsync.pending, (state) => {
        logEvent("searchMutualsAsyncStarted", {
          ...addDataToEvent(state, {}),
        });
        state.mutualsSearchStatus = "pending";
      })
      .addCase(searchMutualsAsync.rejected, (state, action) => {
        state.mutualsSearchStatus = "failed";
        state.errorMessage = action?.payload?.error || "";

        logEvent("searchMutualsFailed", {
          ...addDataToEvent(state, {}),
          error: action?.payload?.error || "",
        });
      })
      .addCase(searchMutualsAsync.fulfilled, (state, action) => {
        state.mutualsSearchStatus = "successful";
        state.mutuals = action.payload.mutuals;
        state.userProfileImageUrl = action.payload.userProfileImageUrl;

        logEvent("searchMutualsSucceeded", { ...addDataToEvent(state, {}) });
      })
      .addCase(createQuizAsync.pending, (state) => {
        logEvent("quizCreationStarted", {
          ...addDataToEvent(state),
        });
        state.quizGenerationStatus = "pending";
      })
      .addCase(createQuizAsync.rejected, (state, action) => {
        state.quizGenerationStatus = "failed";
        state.errorMessage = returnEmptyStringIfUndefined(
          action?.payload?.error
        );

        logEvent("quizCreationFailed", {
          ...addDataToEvent(state),
          error: returnEmptyStringIfUndefined(action?.payload?.error),
        });
      })
      .addCase(createQuizAsync.fulfilled, (state, action) => {
        state.quizGenerationStatus = "successful";
        const { quiz } = action.payload;

        const { id, questions, quizMutuals } = quiz;

        state.id = id;
        state.questions = questions;
        state.quizMutuals = quizMutuals;

        logEvent("quizCreationSucceeded", {
          ...addDataToEvent(state),
          quizId: id,
          quiz: JSON.stringify(questions),
        });
      })
      /// Leaderboard
      .addCase(submitScoreAsync.pending, (state) => {
        logEvent("scoreSubmissionStarted", {
          ...addDataToEvent(state),
        });
      })
      .addCase(submitScoreAsync.rejected, (state, action) => {
        logEvent("scoreSubmissionFailed", {
          ...addDataToEvent(state),
          error: returnEmptyStringIfUndefined(action?.payload?.error),
        });
      })
      .addCase(submitScoreAsync.fulfilled, (state, action) => {
        logEvent("scoreSubmissionSucceeded", {
          ...addDataToEvent(state),
        });
      });
  },
});

export const {
  setErrorMessage,
  clearErrorMessage,
  setUserHandle,
  addToSelectedMutuals,
  removeFromSelectedMutuals,
  clearSelectedMutuals,
  resetTwitterChallengeState,
  // Quiz
  startQuiz,
  addAnswer,
  setAnswers,
  clearAnswers,
  addTentativeAnswer,
  setTentativeAnswers,
  clearTentativeAnswers,
  setCurrentQuestionIndex,
  goToNextQuestion,
  goToPreviousQuestion,
  resetQuiz,
  finishQuiz,
  clearTimer,
  stopTimer,
  startTimer,
  addToScore,
  tickTimer,
  // Leaderboard
  setScoreRecords,
  addScoreRecord,
} = quiz.actions;

export default quiz.reducer;
