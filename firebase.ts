
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC9GS1lDvHeKYosGxXTVT59iUwUgv2rdls",
  authDomain: "notebook-b2b12.firebaseapp.com",
  databaseURL: "https://notebook-b2b12-default-rtdb.firebaseio.com",
  projectId: "notebook-b2b12",
  storageBucket: "notebook-b2b12.firebasestorage.app",
  messagingSenderId: "774718650771",
  appId: "1:774718650771:android:9ff87254c9de3649af1066"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
