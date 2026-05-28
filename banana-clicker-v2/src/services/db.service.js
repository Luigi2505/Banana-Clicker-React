import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const dbService = {
  carregarProgresso: async (uid) => {
    const docSnap = await getDoc(doc(db, "usuarios", uid));
    return docSnap.exists() ? docSnap.data() : null;
  },
  salvarProgresso: async (uid, progressoAtualizado) => {
    await updateDoc(doc(db, "usuarios", uid), {
      progresso: progressoAtualizado,
    });
  },
  criarPerfil: async (uid, dadosIniciais) => {
    await setDoc(doc(db, "usuarios", uid), dadosIniciais);
  },
};
