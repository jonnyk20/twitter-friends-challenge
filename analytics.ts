import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import mixpanel from "mixpanel-browser";
import { IS_DEV } from "./config";
import { firestoreDB } from "./firebase";
import { cleanObject } from "./utils";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

if (!!MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN);
  mixpanel.set_config({ debug: IS_DEV });
}

export const logMixpanelEvent = (
  name: string,
  params: { [key: string]: any } = {}
) => {
  try {
    mixpanel.track(name, { ...params });
  } catch (error) {
    console.error("error logging to Mixpanel", error);
  }
};

export const logFirestoreEvent = async (
  name: string,
  params: { [key: string]: any } = {}
) => {
  if (!firestoreDB) return;

  try {
    addDoc(collection(firestoreDB, "events"), {
      ...params,
      name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("error logging to Firestore", error);
  }
};

export const logEvent = async (
  name: string,
  params: { [key: string]: any } = {}
) => {
  try {
    let eventData = { ...params, name, platform: "webapp" };

    eventData = cleanObject(eventData);

    logMixpanelEvent(name, eventData);
    logFirestoreEvent(name, eventData);
  } catch (error) {
    console.error("error logging", error);
  }
};
