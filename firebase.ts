import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

import { FIREBASE_CONFIG } from "./config";

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  app = initializeApp(FIREBASE_CONFIG);
  db = getFirestore(app);
} catch (error) {
  console.error("Failed to initialize firebase");
}

export const firebaseApp = app;
export const firestoreDB = db;
