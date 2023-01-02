import { pickBy, identity, uniqBy } from "lodash";
import { UserV2 } from "twitter-api-v2";
import { v4 as uuidv4 } from "uuid";
import {
  AnswerType,
  ScoreRecordType,
  TextItemType,
  TwitterUserType,
} from "./types";

export const wait = (amount = 0) =>
  new Promise((resolve) => setTimeout(resolve, amount));

export const stringifyValue = (value: any): string => {
  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return value.toString();
  }
};

export const stringifyObject = (ob: any): { [key: string]: string } => {
  let output: { [key: string]: string } = {};

  for (const key in ob) {
    const value = ob[key];

    if (typeof value !== "undefined") {
      output[key] = stringifyValue(value);
    }
  }

  return output;
};

export const cleanObject = (originalObject: any): any => {
  const objectWithDefinedValues = pickBy(originalObject, identity);

  return stringifyObject(objectWithDefinedValues);
};

export const updateAnswers = (
  answers: AnswerType[],
  additionalAnswer: AnswerType
): AnswerType[] => [
  ...answers.filter(
    (answer) => answer.questionId !== additionalAnswer.questionId
  ),
  additionalAnswer,
];

export const createAnswer = ({
  choiceId,
  isCorrect,
  questionId,
  isRevealed,
}: Omit<AnswerType, "variation">): AnswerType => ({
  choiceId,
  isCorrect,
  questionId,
  isRevealed,
});

export const returnEmptyStringIfUndefined = (value: string | undefined) =>
  value || "";

export const compareFollowersCount = (a: UserV2, b: UserV2) =>
  (b.public_metrics?.followers_count || 0) -
  (a.public_metrics?.followers_count || 0);

export const formatTwitterUser = (user: UserV2): TwitterUserType => ({
  id: Number(user.id),
  username: user.username,
  profileImageUrl: user.profile_image_url || "",
});

export const generateId = (): string => uuidv4();

export const formatTextItem = (text: string): TextItemType => ({
  id: generateId(),
  text,
});

export const getUniqueByUsername = (
  scores: ScoreRecordType[]
): ScoreRecordType[] => {
  // If there are multiple scores with the same username, keep the one with the highest score
  const scoresWithUniqueUsernamesAndHighestScore = scores.map((score) => {
    const duplicateScores = scores.filter((s) => s.username === score.username);
    const highestScore = Math.max(...duplicateScores.map((s) => s.score));
    return { ...score, score: highestScore };
  });

  return scoresWithUniqueUsernamesAndHighestScore;
};

export const hasKey = (scoreRecord: ScoreRecordType): boolean =>
  scoreRecord.key !== "";

export const getUserRank = (
  username: string,
  sores: ScoreRecordType[]
): number => {
  const userScoreRecord = sores.find((score) => score.username === username);
  if (!userScoreRecord) return 0;
  return sores.indexOf(userScoreRecord) + 1;
};

export const getOrdinalSuffix = (rank: number): string => {
  var j = rank % 10,
    k = rank % 100;
  if (j == 1 && k != 11) {
    return rank + "st";
  }
  if (j == 2 && k != 12) {
    return rank + "nd";
  }
  if (j == 3 && k != 13) {
    return rank + "rd";
  }
  return rank + "th";
};

export const sortByScore = (scores: ScoreRecordType[]): ScoreRecordType[] =>
  [...scores].sort((a, b) => b.score - a.score);

export function cloneWithRandomIds<T>(arr: T[]): T[] {
  return arr.map((item) => ({ ...item, id: generateId() }));
}
