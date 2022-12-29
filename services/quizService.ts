import { wait } from "../utils";
import {
  EMPTY_QUIZ_RESPONSE,
  MOCK_MUTUALS_SEARCH_RESPONSE,
  MOCK_QUIZ_RESPONSE,
} from "../mocks";
import {
  QuizResponseType,
  MutualsSearchResponseType,
  QuizInputType,
} from "../types";
import { MOCK_REQUESTS_ENABLED } from "../config";

export const mutualsSearchRequest = async (
  userHandle: string
): Promise<MutualsSearchResponseType> => {
  try {
    const res = await fetch(`/api/get_mutuals`, {
      body: JSON.stringify({ userHandle }),
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },

      method: "POST",
    });

    const data = await res.json();

    return data as MutualsSearchResponseType;
  } catch (error) {
    console.error("Failed to analyze sentences", error);

    return {
      mutuals: [],
      error: "failed to get mutuals",
      userProfileImageUrl: "",
    };
  }
};

export const getMutualsForUser = async (
  userHandle: string
): Promise<MutualsSearchResponseType> => {
  if (MOCK_REQUESTS_ENABLED) {
    await wait(1000);

    return MOCK_MUTUALS_SEARCH_RESPONSE;
  }

  const response: MutualsSearchResponseType = await mutualsSearchRequest(
    userHandle
  );

  return response;
};

export const quizCreationRequest = async (
  input: QuizInputType
): Promise<QuizResponseType> => {
  try {
    const res = await fetch(`/api/create_quiz`, {
      body: JSON.stringify(input),
      credentials: "same-origin",
      // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const data = await res.json();

    return data as QuizResponseType;
  } catch (error) {
    console.error("Failed to create quiz", error);

    return EMPTY_QUIZ_RESPONSE;
  }
};

export const generateQuiz = async (
  input: QuizInputType
): Promise<QuizResponseType> => {
  if (MOCK_REQUESTS_ENABLED) {
    await wait(1000);
    const mockResponse = MOCK_QUIZ_RESPONSE;
    return mockResponse;
  }

  const response = await quizCreationRequest(input);

  return response;
};
