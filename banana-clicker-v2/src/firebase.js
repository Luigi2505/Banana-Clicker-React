import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1xDc19PBo-LP74rMq2yUtst2VwTmTT0Y",
  authDomain: "banana-clicker-react-v2.firebaseapp.com",
  projectId: "banana-clicker-react-v2",
  storageBucket: "banana-clicker-react-v2.firebasestorage.app",
  messagingSenderId: "490995789299",
  appId: "1:490995789299:web:7895b9202c3a5c5a70b686",
};

const app = initializeApp(firebaseConfig);

// Estas duas linhas são o que faz o seu jogo funcionar
export const db = getFirestore(app);
export const auth = getAuth(app);
