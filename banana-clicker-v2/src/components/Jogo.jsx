import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

function Jogo() {
  const [perfil, setPerfil] = useState("");
  const [bananas, setBananas] = useState(0);
  const [dinheiro, setDinheiro] = useState(0);
  const [multiplicador, setMultiplicador] = useState(1);
  const [carregando, setCarregando] = useState(true);

  const usuarioAtual = auth.currentUser;

  // 1. CARREGAR O JOGO SALVO AO ENTRAR
  useEffect(() => {
    const carregarProgresso = async () => {
      if (!usuarioAtual) return;

      const jogadorRef = doc(db, "usuarios", usuarioAtual.uid);
      const docSnap = await getDoc(jogadorRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();
        setPerfil(dados.nomePerfil);
        setBananas(dados.progresso.bananas);
        setDinheiro(dados.progresso.dinheiro);
        setMultiplicador(dados.progresso.multiplicador);
      }
      setCarregando(false);
    };

    carregarProgresso();
  }, [usuarioAtual]);

  // 2. SISTEMA DE AUTO-SAVE (A cada 30 segundos)
  useEffect(() => {
    if (carregando || !usuarioAtual) return;

    const intervalo = setInterval(() => {
      salvarJogo();
    }, 30000); // 30000 milissegundos = 30 segundos

    // Limpa o intervalo se o componente for desmontado
    return () => clearInterval(intervalo);
  }, [bananas, dinheiro, multiplicador, carregando, usuarioAtual]);

  // 3. FUNÇÃO DE SALVAR NO FIREBASE
  const salvarJogo = async () => {
    if (!usuarioAtual) return;

    const jogadorRef = doc(db, "usuarios", usuarioAtual.uid);
    try {
      await updateDoc(jogadorRef, {
        progresso: {
          bananas: bananas,
          dinheiro: dinheiro,
          multiplicador: multiplicador,
        },
      });
      console.log("Jogo salvo no Firebase!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  // 4. LÓGICA DO CLIQUE (Altera apenas a tela, sem gastar o banco)
  const clicarBanana = () => {
    setBananas((prevBananas) => prevBananas + multiplicador);
  };

  if (carregando) return <p>Carregando seu save...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Fazenda do {perfil}</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <h3>🍌 Bananas: {bananas}</h3>
        <h3>💰 Dinheiro: {dinheiro}</h3>
      </div>

      <button
        onClick={clicarBanana}
        style={{ padding: "15px 30px", fontSize: "24px", cursor: "pointer" }}
      >
        Clicar na Banana!
      </button>

      <div style={{ marginTop: "30px" }}>
        <button onClick={salvarJogo} style={{ padding: "10px 20px" }}>
          Salvar Progresso Manualmente
        </button>
      </div>
    </div>
  );
}

export default Jogo;
