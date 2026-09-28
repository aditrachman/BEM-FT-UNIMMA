// Auth + storage init lives in its own module so pages that only need
// Firestore (homepage sections) don't pull firebase/auth and
// firebase/storage — and auth's cross-tab iframe — into their bundle.
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { app } from "./firebase";

export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;
