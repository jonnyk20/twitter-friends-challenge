import type { NextApiRequest, NextApiResponse } from "next";
import * as R from "ramda";
import { parse } from "yaml";
import { TweetV2, TwitterApi } from "twitter-api-v2";
import { shuffle } from "lodash";
import { Configuration, OpenAIApi } from "openai";

import { EMPTY_QUIZ } from "../../mocks";
import {
  QuestionType,
  QuizResponseType,
  QuizType,
  RawQuestionType,
  TwitterUserType,
} from "../../types";
import { formatTextItem, generateId } from "../../utils";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const client = new TwitterApi(process.env.TWITTER_API_KEY || "");

const personalPronouns = ["me", "I", "mine", "my", "myself"];

const personalPronounRegex = new RegExp(
  `\\b(${personalPronouns.join("|")})\\b`,
  "i"
);

const timeWords = [
  "morning",
  "afternoon",
  "evening",
  "night",
  "yesterday",
  "today",
  "tomorrow",
  "week",
  "month",
  "year",
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "weekend",
];

const timeWordsRegex = new RegExp(`\\b(${timeWords.join("|")})\\b`, "i");

const PROMPT_INPUT_MARKER = "{INPUT}";
const CODE_BLOCK_MARKER = "```";
const EXAMPLE_USERNAME = "@jack";
const EXAMPLE_QUESTION = `What could ${EXAMPLE_USERNAME} not wait to try`;

const COMPLETION_PREFIX = `
${CODE_BLOCK_MARKER}
questions:
- username: "${EXAMPLE_USERNAME}"
  question: "${EXAMPLE_QUESTION}"
  correctAnswer: "a gelato place" 
  incorrectAnswers:
  - "a ramen restaurant"
  - "a recipe"
  - "snowboarding"
- username: "@
`;

const BASE_PROMPT = `
Create a 6-question quiz about some Twitter users based on their tweets.
Use the following YAML format:

${CODE_BLOCK_MARKER}
questions:
- username: "<text>"
  question: "<text>"
  correctAnswer: "<text>" 
  incorrectAnswers:
  - "<text>"
  - "<text>"
  - "<text>"
${CODE_BLOCK_MARKER}

## TWEETS
${PROMPT_INPUT_MARKER}
- ${EXAMPLE_USERNAME}: Can't wait to try the new gelato place next door

## QUESTIONS
${COMPLETION_PREFIX}
`.trim();

const getWordCount = (tweet: TweetV2) => tweet.text.split(" ").length;

const containsPersonalPronoun = (tweet: TweetV2) =>
  Number(personalPronounRegex.test(tweet.text));

const containsTimeWords = (tweet: TweetV2) => timeWordsRegex.test(tweet.text);

const isToxic = (tweet: TweetV2) => false;

const isInvalid = R.anyPass([isToxic, containsTimeWords]);

const isValidTweet = (tweet: TweetV2) => {
  return !isInvalid(tweet);
};

const sortTweetsByRelevance = R.sortWith([
  R.descend(containsPersonalPronoun),
  R.descend(getWordCount),
]);

type UserTweetsObjectType = {
  tweets: TweetV2[];
  user: TwitterUserType;
};

const getUserTweets = async (
  user: TwitterUserType
): Promise<UserTweetsObjectType> => {
  try {
    const { id } = user;
    const tweetsResponse = await client.v2.userTimeline(id.toString(), {
      max_results: 100,
      exclude: ["replies", "retweets"],
    });
    const tweets = tweetsResponse.data.data;

    const validTweets = tweets.filter(isValidTweet);

    const sortedValidTweets = sortTweetsByRelevance(validTweets);

    return {
      tweets: sortedValidTweets,
      user,
    };
  } catch (error) {
    return {
      tweets: [],
      user,
    };
  }
};

const PROMPT_TWEETS_LIMIT = 9;

const getTweetsString = (mutualsTweets: UserTweetsObjectType[]): string => {
  let tweetsString = "";
  let promptTweetsCount = 0;
  let targetTweetIndex = 0;

  // Loop through each object in mutualsTweets
  // On each iteration and a tweet to the string and increment promptTweetsCount
  // Break out of the loop when promptTweetsCount is equal to PROMPT_TWEETS_LIMIT
  while (promptTweetsCount < PROMPT_TWEETS_LIMIT) {
    mutualsTweets.forEach((mutualTweetsObject) => {
      const { tweets, user } = mutualTweetsObject;
      const tweet = tweets[targetTweetIndex];
      if (tweet) {
        tweetsString += `- @${user.username}: ${tweet.text.replaceAll(
          "\n",
          " "
        )}\n`;
        promptTweetsCount++;
      }
    });
    targetTweetIndex++;
  }

  return tweetsString.trim();
};

const formatPrompt = (tweetsString: string): string => {
  const prompt = BASE_PROMPT.replace(PROMPT_INPUT_MARKER, tweetsString);

  return prompt;
};

const generateQuizString = async (prompt: string): Promise<string> => {
  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 1000,
  });

  return baseCompletion?.data?.choices?.[0].text?.trim() || "";
};

const isNotExampleQuestion = (question: RawQuestionType) =>
  !question.question.includes(EXAMPLE_QUESTION);

const formatQuestions = (rawQuestions: RawQuestionType[]): QuestionType[] => {
  let questions: QuestionType[] = [];

  const filteredRawQuestions = rawQuestions.filter(isNotExampleQuestion);

  filteredRawQuestions.forEach((rawQuestion) => {
    const { question, correctAnswer, incorrectAnswers } = rawQuestion;
    const formattedCorrectAnswer = formatTextItem(correctAnswer);
    const formattedIncorrectAnswers = incorrectAnswers.map(formatTextItem);
    const correctChoiceId = formattedCorrectAnswer.id;

    const choices = [formattedCorrectAnswer, ...formattedIncorrectAnswers];
    const shuffledChoices = shuffle(choices);

    const formattedQuestion: QuestionType = {
      id: generateId(),
      prompt: formatTextItem(question),
      choices: shuffledChoices,
      correctChoiceId,
    };

    questions.push(formattedQuestion);
  });

  return questions;
};

const formatQuiz = (
  completion: string,
  userHandle: string
): Omit<QuizType, "quizMutuals"> => {
  const quizString = (COMPLETION_PREFIX.trim() + completion.trim()).replaceAll(
    "`",
    ""
  );

  try {
    const rawQuestions: RawQuestionType[] = parse(quizString).questions;
    const questions = formatQuestions(rawQuestions);

    return {
      id: generateId(),
      questions,
      userHandle,
      userProfileImageUrl: "",
    };
  } catch (error) {
    error = "Failed to format quiz.";
    console.error("Failed to format quiz.");
    console.error(error);
    return EMPTY_QUIZ;
  }
};

const generateQuiz = async (
  username: string,
  mutualsTweets: UserTweetsObjectType[],
  selectedMutuals: TwitterUserType[]
): Promise<QuizResponseType> => {
  let quiz: QuizType = EMPTY_QUIZ;
  let error: string = "";

  try {
    const selectedTweetsString = getTweetsString(mutualsTweets);
    const prompt = formatPrompt(selectedTweetsString);
    const quizMutuals = selectedMutuals.map(({ username }) => username);

    const quizString = await generateQuizString(prompt);
    const quiz: QuizType = {
      ...formatQuiz(quizString, username),
      quizMutuals,
    };

    if (quiz.id === EMPTY_QUIZ.id) {
      error = "Failed to generate quiz.";
    }

    return {
      quiz,
      error,
    };
  } catch (error) {
    error = "Failed to generate quiz.";
    console.error("Failed to generate quiz.");
    console.error(error);
  }

  return {
    quiz,
    error,
  };
};

const createQuiz = async (
  req: NextApiRequest,
  res: NextApiResponse<QuizResponseType>
) => {
  const {
    userHandle,
    selectedMutuals,
  }: { userHandle: string; selectedMutuals: TwitterUserType[] } = req.body;

  try {
    const mutualsTweets: UserTweetsObjectType[] = await Promise.all(
      selectedMutuals.map(getUserTweets)
    );
    const quizResponse = await generateQuiz(
      userHandle,
      mutualsTweets,
      selectedMutuals
    );

    res.status(200).json(quizResponse);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get mutuals",
      quiz: EMPTY_QUIZ,
    });
  }
};

export default createQuiz;
