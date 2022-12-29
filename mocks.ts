import {
  MutualsSearchResponseType,
  QuizResponseType,
  QuizType,
  ScoreRecordType,
  TwitterUserType,
} from "./types";

const MOCK_PROFILE_IMAGE_URL =
  "https://pbs.twimg.com/profile_images/1541466571767287808/iCBMyCku_400x400.jpg";

export const MOCK_TWITTER_USERS: TwitterUserType[] = [
  {
    id: 1,
    username: "user1",
    profileImageUrl: MOCK_PROFILE_IMAGE_URL,
  },
  {
    id: 2,
    username: "user2",
    profileImageUrl: MOCK_PROFILE_IMAGE_URL,
  },
  {
    id: 3,
    username: "user3",
    profileImageUrl: MOCK_PROFILE_IMAGE_URL,
  },
  {
    id: 4,
    username: "user4",
    profileImageUrl: MOCK_PROFILE_IMAGE_URL,
  },
  {
    id: 5,
    username: "user5",
    profileImageUrl: MOCK_PROFILE_IMAGE_URL,
  },
];

export const MOCK_MUTUALS_SEARCH_RESPONSE: MutualsSearchResponseType = {
  error: "",
  mutuals: MOCK_TWITTER_USERS,
  userProfileImageUrl: MOCK_PROFILE_IMAGE_URL,
};

export const EMPTY_MUTUALS_SEARCH_RESPONSE: MutualsSearchResponseType = {
  error: "Failed to find twitter mutuals",
  mutuals: [],
  userProfileImageUrl: "",
};

// Empty Quiz
export const EMPTY_QUIZ: QuizType = {
  id: "empty",
  questions: [],
  quizMutuals: [],
  userHandle: "",
  userProfileImageUrl: "",
};

export const MOCK_QUIZ: QuizType = {
  id: "new",
  quizMutuals: ["user1", "user2", "user3"],
  userHandle: "mockUser",
  userProfileImageUrl: MOCK_PROFILE_IMAGE_URL,
  questions: [
    {
      choices: [
        {
          id: "choice 1",
          text: "choice 1",
        },
        {
          id: "choice 2",
          text: "choice 2",
        },
        {
          id: "choice 3",
          text: "choice 3",
        },
      ],
      correctChoiceId: "choice 3",
      id: "6a37cb78-2e61-11ed-a5c0-acde48001122",

      prompt: {
        id: "Question 1",
        text: "Question 1",
      },
    },
    {
      choices: [
        {
          id: "choice 1",
          text: "choice 1",
        },
        {
          id: "choice 2",
          text: "choice 2",
        },
        {
          id: "choice 3",
          text: "choice 3",
        },
      ],
      correctChoiceId: "choice 3",
      id: "26a37cb78-2e61-11ed-a5c0-acde48001122",
      prompt: {
        id: "Question 2",
        text: "Question 2",
      },
    },
    {
      choices: [
        {
          id: "choice 1",
          text: "choice 1",
        },
        {
          id: "choice 2",
          text: "choice 2",
        },
        {
          id: "choice 3",
          text: "choice 3",
        },
      ],
      correctChoiceId: "choice 3",
      id: "36a37cb78-2e61-11ed-a5c0-acde48001122",
      prompt: {
        id: "Question 3",
        text: "Question 3",
      },
    },
  ],
};

export const MOCK_QUIZ_RESPONSE: QuizResponseType = {
  error: "",
  quiz: MOCK_QUIZ,
};

export const EMPTY_QUIZ_RESPONSE: QuizResponseType = {
  error: "Failed to create quiz",
  quiz: EMPTY_QUIZ,
};

export const EMPTY_SCORE_RECORD: ScoreRecordType = {
  id: "",
  quizId: "",
  quizMutuals: [],
  score: 0,
  username: "",
  key: "",
  userProfileImageUrl: "",
};
