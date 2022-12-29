import {
  doc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  getFirestore,
  deleteDoc,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { logMixpanelEvent } from "../analytics";

import { firestoreDB } from "../firebase";
import {
  ScoreRecordInputType,
  ScoreRecordType,
  SubmitScoreResponseType,
} from "../types";

const formatScoreFromFirestore = (
  userScore: ScoreRecordType
): ScoreRecordType => ({
  score: userScore.score,
  username: userScore.username,
  quizId: userScore.quizId,
  quizMutuals: userScore.quizMutuals,
  id: userScore.id,
  key: userScore.key,
  userProfileImageUrl: userScore.userProfileImageUrl,
});

const db = getFirestore();

export const createScore = async (
  scoreRecordInput: ScoreRecordInputType
): Promise<SubmitScoreResponseType> => {
  if (!firestoreDB)
    return {
      error: "Failed to submit score",
      scoreRecordId: "",
    };

  try {
    const doc = await addDoc(collection(db, "scoreRecords"), {
      ...scoreRecordInput,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      error: "",
      scoreRecordId: doc.id,
    };
  } catch (error) {
    console.error("Failed to submit score", error);
    logMixpanelEvent("firestoreRequestFailed", { error });
    return {
      error: "Failed to submit score",
      scoreRecordId: "",
    };
  }
};

export const deleteScore = async (scoreId: string) => {
  if (!firestoreDB) return;
  try {
    await deleteDoc(doc(firestoreDB, "scoreRecords", scoreId));
  } catch (error) {
    console.error("Failed to delete score", error);
    logMixpanelEvent("firestoreRequestFailed", { error });
  }
};

export const getScores = async (): Promise<ScoreRecordType[]> => {
  try {
    const q = query(collection(db, "scoreRecords"), orderBy("score", "desc"));

    const querySnapshot = await getDocs(q);

    const userScores: ScoreRecordType[] = [];

    querySnapshot.forEach((doc) => {
      userScores.push({
        ...formatScoreFromFirestore(doc.data() as ScoreRecordType),
        id: doc.id,
      });
    });

    return userScores;
  } catch (error) {
    console.error(`Failed to fetch userScores`, error);
    return [] as ScoreRecordType[];
  }
};
