import { createAsyncThunk } from "@reduxjs/toolkit";
import { generateQuiz } from "../services/quizService";
import { QuizResponseType, QuizInputType } from "../types";

export const createQuizAsync = createAsyncThunk<
  QuizResponseType,
  QuizInputType,
  {
    rejectValue: QuizResponseType;
  }
>("search/createQuiz", async (input: QuizInputType, { rejectWithValue }) => {
  const result = await generateQuiz(input);

  if (!result.quiz?.questions?.length) {
    return rejectWithValue(result);
  }

  return result;
});
