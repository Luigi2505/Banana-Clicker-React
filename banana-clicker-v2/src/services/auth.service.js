import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

export const authService = {
  login: async (email, senha) => {
    return await signInWithEmailAndPassword(auth, email, senha);
  },
  cadastrar: async (email, senha) => {
    return await createUserWithEmailAndPassword(auth, email, senha);
  },
  sair: async () => {
    return await signOut(auth);
  },
};
