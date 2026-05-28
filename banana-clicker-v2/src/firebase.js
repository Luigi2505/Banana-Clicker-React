import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDm_9geSp7VcmrxGh9AZgYRHQna7TocXPg",
  authDomain: "bananaclickerreact.firebaseapp.com",
  projectId: "bananaclickerreact",
  storageBucket: "bananaclickerreact.appspot.com",
  messagingSenderId: "328559339493",
  appId: "1:328559339493:web:da57132def6a1a23da710c",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
