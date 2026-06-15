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
  // FUNÇÃO NOVA ADICIONADA:
  salvarFotoPerfil: async (uid, base64) => {
    // Usamos setDoc com merge: true em vez de updateDoc
    // Isso garante que a foto salve mesmo se o documento do jogador ainda não existir
    await setDoc(
      doc(db, "usuarios", uid),
      {
        fotoPerfil: base64,
      },
      { merge: true },
    );
  },
};
