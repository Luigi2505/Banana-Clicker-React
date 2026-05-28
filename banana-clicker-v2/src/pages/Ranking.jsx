import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { ITENS_POWERUP, META } from "../context/GameContext";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Ranking() {
  const { bananas, porClique, porSegundo, qtdProducao, powerupsComprados, nomePerfil } = useGame();
  
  // Estados para gerenciar a API
  const [ranking, setRanking] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Lógica das Suas Estatísticas (Mantida intacta)
  const totalPowerups = Object.keys(powerupsComprados).length;
  const totalProducao = Object.values(qtdProducao).reduce((a, b) => a + b, 0);
  const progresso     = Math.min(((bananas / META) * 100), 100).toFixed(1);

  // Consumo da API do Firebase para o Placar Geral
  useEffect(() => {
    const buscarRanking = async () => {
      try {
        const usuariosRef = collection(db, "usuarios");
        const q = query(usuariosRef, orderBy("progresso.bananas", "desc"), limit(10));
        const querySnapshot = await getDocs(q);

        const listaRankeada = querySnapshot.docs.map((doc) => {
          const dados = doc.data();
          return {
            id: doc.id,
            nome: dados.nomePerfil || "Anônimo",
            bananas: dados.progresso?.bananas || 0
          };
        });

        setRanking(listaRankeada);
      } catch (error) {
        console.error("Erro ao buscar ranking:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarRanking();
  }, []);

  return (
    <div style={styles.pagina}>
      <h2 style={styles.titulo}>🏆 Ranking & Estatísticas</h2>

      <div style={styles.secao}>
        <h3 style={styles.subtitulo}>📊 Suas Estatísticas</h3>
        <table style={styles.tabela}>
          <tbody>
            <tr><td style={styles.td}>🍌 Bananas acumuladas</td>      <td style={styles.tdNum}>{Math.floor(bananas).toLocaleString()}</td></tr>
            <tr><td style={styles.td}>👆 Bananas por clique</td>      <td style={styles.tdNum}>{porClique}</td></tr>
            <tr><td style={styles.td}>⏱ Bananas por segundo</td>     <td style={styles.tdNum}>{porSegundo}</td></tr>
            <tr><td style={styles.td}>🏭 Itens de producao</td>       <td style={styles.tdNum}>{totalProducao}</td></tr>
            <tr><td style={styles.td}>⚡ Power-ups comprados</td>     <td style={styles.tdNum}>{totalPowerups} / {ITENS_POWERUP.length}</td></tr>
            <tr><td style={styles.td}>🎯 Progresso para a meta</td>   <td style={styles.tdNum}>{progresso}%</td></tr>
          </tbody>
        </table>
      </div>

      <div style={styles.secao}>
        <h3 style={styles.subtitulo}>🥇 Placar Geral</h3>
        <table style={styles.tabela}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Jogador</th>
              <th style={styles.th}>Bananas</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "15px" }}>Carregando dados...</td>
              </tr>
            ) : (
              ranking.map((r, i) => (
                // Destaca a linha se o nome do jogador no banco for igual ao nome do perfil logado
                <tr key={r.id} style={{ background: r.nome === nomePerfil ? "#fffde7" : "transparent" }}>
                  <td style={styles.td}>{i + 1}º</td>
                  <td style={styles.td}>{r.nome === nomePerfil ? `👤 ${r.nome}` : r.nome}</td>
                  <td style={styles.tdNum}>🍌 {Math.floor(r.bananas).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  pagina:    { maxWidth: 520, margin: "0 auto", padding: 24 },
  titulo:    { fontSize: 22, marginBottom: 20, borderBottom: "2px solid #222", paddingBottom: 8 },
  secao:     { marginBottom: 28 },
  subtitulo: { fontSize: 16, marginBottom: 10 },
  tabela:    { width: "100%", borderCollapse: "collapse", border: "1px solid #aaa", background: "#fff", fontSize: 14 },
  th:        { padding: "8px 12px", borderBottom: "2px solid #222", textAlign: "left", background: "#f0f0f0" },
  td:        { padding: "8px 12px", borderBottom: "1px solid #ddd" },
  tdNum:     { padding: "8px 12px", borderBottom: "1px solid #ddd", textAlign: "right", fontWeight: "bold" },
};
