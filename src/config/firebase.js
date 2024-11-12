import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpGzeUnQHgAyLG9pFX1ICYiMa71pG6udQ",
  authDomain: "chat-app-9e362.firebaseapp.com",
  databaseURL: "https://chat-app-9e362-default-rtdb.firebaseio.com",
  projectId: "chat-app-9e362",
  storageBucket: "chat-app-9e362.appspot.com",
  messagingSenderId: "136996127990",
  appId: "1:136996127990:web:05c136c154a023272158d7",
  measurementId: "G-VLRFDMWC2C",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);

const provider = new GoogleAuthProvider();
export { auth, database, db, provider };

